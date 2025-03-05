let activeTabId = null;

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.action === 'summarize') {
            // Handle the summarization request
            const model = request.model || 'gemini-2.0-flash-lite-preview-02-05';
            summarizeTranscript(request.transcript, request.customPrompt, model)
                .then(summary => {
                    // Create new tab and send summary
                    chrome.tabs.create({ url: 'summary.html' }, async (newTab) => {
                        try {
                            const summary = await summarizeTranscript(request.transcript, request.customPrompt, model);
                            chrome.tabs.sendMessage(newTab.id, {
                                action: 'updateSummary',
                                summary: summary
                            });
                        } catch (error) {
                            chrome.tabs.sendMessage(newTab.id, {
                                action: 'updateSummary',
                                error: error.message
                            });
                        }
                    });
                })
                .catch(error => {
                    console.error('Summarization failed:', error);
                    chrome.tabs.create({ url: 'error.html' });
                });
            
            return true; // Keep message channel open
        }
        if (request.action === "openSummaryTab") {
            if (!chrome.runtime?.id) throw new Error('Extension context lost');
            
            // Reuse existing tab if possible
            if (activeTabId) {
                chrome.tabs.update(activeTabId, { active: true });
                return true; // Keep channel open
            }

            // Create new tab and setup communication
            chrome.tabs.create({
                url: chrome.runtime.getURL("summary.html"),
                active: true
            }, (tab) => {
                activeTabId = tab.id;
                
                // Wait for tab to be fully loaded
                chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo) {
                    if (tabId === tab.id && changeInfo.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                        
                        // Handle the actual summarization
                        summarizeTranscript(request.transcript, request.customPrompt, request.model)
                            .then(summary => {
                                chrome.tabs.sendMessage(tab.id, {
                                    action: 'updateSummary',
                                    summary: summary
                                });
                            })
                            .catch(error => {
                                chrome.tabs.sendMessage(tab.id, {
                                    action: 'updateSummary',
                                    error: error.message
                                });
                            });
                    }
                });

                // Cleanup listeners
                chrome.tabs.onRemoved.addListener(function tabClosedListener(tabId) {
                    if (tabId === activeTabId) {
                        activeTabId = null;
                        chrome.tabs.onRemoved.removeListener(tabClosedListener);
                    }
                });
            });
            
            return true; // Indicate we'll respond asynchronously
        }
        if (request.action === 'manageStorage') {
            // Handle prompt deletion differently
            if (request.operation === 'deletePrompt') {
                manageStorage('deletePrompt', null, request.value)
                    .then(() => sendResponse({ success: true }))
                    .catch(error => sendResponse({ success: false, error }));
            } else {
                manageStorage(request.operation, request.key, request.value)
                    .then(() => sendResponse({ success: true }))
                    .catch(error => sendResponse({ success: false, error }));
            }
            return true;
        }
        if (request.action === 'getStorageData') {
            // Return all saved prompts with array validation
            chrome.storage.sync.get(['savedPrompts', 'geminiApiKey'])
                .then(data => sendResponse({ 
                    success: true, 
                    prompts: Array.isArray(data.savedPrompts) ? data.savedPrompts : [],
                    apiKey: data.geminiApiKey || '' 
                }))
                .catch(error => sendResponse({ success: false, error }));
            return true;
        }
    }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=> {
    if (tab.url && tab.url.includes("youtube") && tab.url.includes("/watch")){
        console.log("injecting ui");
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: () => {
                callInjectUI();
            }
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>{
    if (tab.url && tab.url.includes("youtube") && !tab.url.includes("/watch")){
        console.log("removing ui");
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: () => {
                removeInjectUI();
            }
        });
    }
});


// Add extension reload handler
chrome.runtime.onSuspend.addListener(() => {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                action: 'extensionReloaded'
            });
        });
    });
});

// ... existing code ...

async function summarizeTranscript(transcript, customPrompt, model) {
    const { savedPrompts = [], geminiApiKey } = await chrome.storage.sync.get(["savedPrompts", "geminiApiKey"]);
    
    if (!geminiApiKey) {
        throw new Error('No Gemini API key found. Please set your API key in the settings.');
    }
    
    const defaultPrompt = "Summarize this YouTube transcript:";
    
    // Ensure savedPrompts is always an array
    const promptsArray = Array.isArray(savedPrompts) ? savedPrompts : [];
    const selectedPrompt = promptsArray.find(p => p.content === customPrompt);
    const mainPrompt = selectedPrompt?.content || customPrompt || defaultPrompt;

    const promptText = `${mainPrompt}\n\n${transcript}`;
    
    try {
        const apiKey = geminiApiKey;
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const data = {
            contents: [{
                parts: [{
                    text: promptText
                }]
            }]
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (!response.ok) {
            console.error('API Error:', result);
            throw new Error(result.error?.message || 'Failed to generate summary');
        }

        if (result.candidates && result.candidates.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            throw new Error('No response received from the model');
        }

    } catch (error) {
        console.error('Full Error Details:', {
            error,
            prompt: mainPrompt,
            transcriptLength: transcript.length
        });
        throw new Error(`Failed to summarize: ${error.message}`);
    }
}

// Add new storage management functions
async function manageStorage(action, key, value = null) {
    if (action === 'set') {
        await chrome.storage.sync.set({ [key]: value });
    } else if (action === 'delete') {
        if (key === 'savedPrompts') {
            const { savedPrompts } = await chrome.storage.sync.get('savedPrompts');
            const validPrompts = Array.isArray(savedPrompts) ? savedPrompts : [];
            const updatedPrompts = validPrompts.filter(p => p.name !== value);
            await chrome.storage.sync.set({ savedPrompts: updatedPrompts });
        } else {
            await chrome.storage.sync.remove(key);
        }
    } else if (action === 'deletePrompt') {
        const { savedPrompts } = await chrome.storage.sync.get('savedPrompts');
        const validPrompts = Array.isArray(savedPrompts) ? savedPrompts : [];
        const updatedPrompts = validPrompts.filter(p => p.name !== value);
        await chrome.storage.sync.set({ savedPrompts: updatedPrompts });
    } else if (action === 'addPrompt') {
        const result = await chrome.storage.sync.get('savedPrompts');
        const validPrompts = Array.isArray(result.savedPrompts) ? result.savedPrompts : [];
        const updatedPrompts = [...validPrompts, value];
        await chrome.storage.sync.set({ savedPrompts: updatedPrompts });
    }
}