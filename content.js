const MODELS = [
    {
        value: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash'
    },
    {
        value: 'gemini-2.0-flash-lite-preview-02-05',
        name: 'Gemini 2.0 Flash Lite'
    },
    {
        value: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro'
    },
    {
        value: 'gemini-1.5-flash-8b',
        name: 'Gemini 1.5 Flash 8B'
    }
];

    function callInjectUI(){
        let container = document.getElementById('summarizer-container');
        console.log(" Gemmery logs: Injection trails")
        if (container) {
            console.log(" Gemmery logs: UI found. Injection trails stopped")
            if(intervalId1) clearInterval(intervalId1)
            return;
        }
        let intervalId1 = setInterval(() => {
            const videoContainer = document.getElementById('secondary-inner');
            if (videoContainer && !document.getElementById('summarizer-container')) {
                console.log('Gemmery logs: Injecting UI');
                injectUI(videoContainer);
                clearInterval(intervalId1);
                console.log(" Gemmery logs: UI injected") 
            }
        }, 500); // Check every 100ms
        setTimeout(()=>{clearInterval(intervalId1);console.log(" Gemmery logs: UI injection trails timedout")}, 5000)
    }

    function removeInjectUI(){
        let container = document.getElementById('summarizer-container');
        console.log(" Gemmery logs: removal trails")
        if (!container) {
            console.log(" Gemmery logs: UI not found. Removal trails stopped")
            if(intervalId2) clearInterval(intervalId2)
            return;
        }
        let intervalId2 = setInterval(() => {
            container.remove();
            clearInterval(intervalId2);
            console.log(" Gemmery logs: UI removed") // Stop interval once removed
        }, 500)
        setTimeout(()=>{clearInterval(intervalId2);console.log(" Gemmery logs: UI removal trails timedout")}, 5000)
    }

    // Modified injectUI function
    function injectUI(containerElement) {
        if (document.getElementById('summarizer-container')) return;

        const container = document.createElement('div');
        container.id = 'summarizer-container';
        container.style.cssText = `
            position: relative;
            color: white;
            font-family: sans-serif;
            margin-bottom: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            border: 1px solid #3f3f3f;
            border-radius: 12px;
            padding: 20px;
            gap: 15px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            backdrop-filter: blur(4px);
        `;

        // Add this after line 45
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-secondary: center;
            justify-content: center;
            position: relative;
            width: 100%;
            padding: 0;
            margin-top: 5px;
            margin-bottom: 5px;
            `;

        // Info Button
        const infoButton = document.createElement('button');
        infoButton.textContent = 'i';
        infoButton.style.cssText = `
            padding: 6px 12px;
            border: 1px solid #666;
            border-radius: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            color: #e0e0e0;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: absolute;
            left: 0;
            top: 0;
            line-height: 1;
            margin: 0;
            &:hover {
                background-color: rgba(255, 255, 255, 0.15);
                border-color: #888;
            }
        `;
        infoButton.onclick = showInfoModal;

        const title = document.createElement('h1');
        title.textContent = 'Gemmery';
        title.style.cssText = `
            color: #3da6ff;
            margin: 0;
            padding: 0;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            line-height: 1;
        `;

        // Settings Button
        const settingsButton = document.createElement('button');
        settingsButton.textContent = 'Settings';
        settingsButton.style.cssText = `
            padding: 6px 12px;
            border: 1px solid #666;
            border-radius: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            color: #e0e0e0;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: absolute;
            right: 0;
            top: 0;
            line-height: 1;
            margin: 0;
            &:hover {
                background-color: rgba(255, 255, 255, 0.15);
                border-color: #888;
            }
        `;
        settingsButton.onclick = showSettingsModal;

        header.appendChild(infoButton);
        header.appendChild(title);
        header.appendChild(settingsButton);
        container.appendChild(header);

        // Textarea styling update
        const promptInput = document.createElement('textarea');
        promptInput.id = 'prompt-input';
        promptInput.placeholder = 'Enter custom prompt or select from saved...';
        promptInput.style.cssText = `
            width: 93%;
            padding: 12px;
            border: 1px solid #444;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.05);
            min-height: 80px;
            resize: vertical;
            color: #e0e0e0;
            font-size: 14px;
            line-height: 1.4;
            
            &:focus {
                outline: none;
                border-color: #3da6ff;
                box-shadow: 0 0 0 2px rgba(61, 166, 255, 0.2);
            }
        `;

        // Dropdown styling update
        const promptSelect = document.createElement('select');
        promptSelect.id = 'saved-prompts';
        promptSelect.style.cssText = `
            width: 100%;
            color: #e0e0e0;
            border: 1px solid #444;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.05);
            height: 40px;
            padding: 0 12px;
            font-size: 14px;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888888'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
            
            &:focus {
                border-color: #3da6ff;
                box-shadow: 0 0 0 2px rgba(61, 166, 255, 0.2);
            }
        `;

        // Populate with models
        MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.name;
            promptSelect.appendChild(option);
        });

        // Button row styling update
        const buttonRow = document.createElement('div');
        buttonRow.style.cssText = `
            display: flex;
            gap: 12px;
            width: 100%;
        `;

        // Updated button styling
        const buttonBaseStyle = `
            flex: 1;
            padding: 12px;
            border: 1px solid #444;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.1);
            color: #e0e0e0;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            
            &:hover {
                background-color: rgba(255, 255, 255, 0.15);
                border-color: #666;
            }
            
            &:active {
                transform: scale(0.98);
            }
        `;

        // Summarize Button
        const summarizeButton = document.createElement('button');
        summarizeButton.textContent = 'Summarize';
        summarizeButton.style.cssText = buttonBaseStyle;
        summarizeButton.addEventListener('click', handleSummarizeClick);

        // Save Prompt Button
        const savePromptButton = document.createElement('button');
        savePromptButton.textContent = 'Save Prompt';
        savePromptButton.style.cssText = buttonBaseStyle;
        savePromptButton.addEventListener('click', savePrompt);

        // Event listener for dropdown selection
        promptSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                promptInput.value = e.target.value;
            }
        });

        // Add this after the promptSelect element
        const modelSelect = document.createElement('select');
        modelSelect.id = 'model-select';
        modelSelect.style.cssText = `
            width: 100%;
            color: #e0e0e0;
            border: 1px solid #444;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.05);
            height: 40px;
            padding: 0 12px;
            font-size: 14px;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888888'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
            
            &:focus {
                border-color: #3da6ff;
                box-shadow: 0 0 0 2px rgba(61, 166, 255, 0.2);
            }
        `;

        // Populate with models
        MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });

        // Assemble UI
        buttonRow.appendChild(summarizeButton);
        buttonRow.appendChild(savePromptButton);
        
        container.appendChild(promptInput);
        container.appendChild(promptSelect);
        container.appendChild(modelSelect);
        container.appendChild(buttonRow);

        // Add this style block to handle dropdown options
        const style = document.createElement('style');
        style.textContent = `
            #saved-prompts option {
                background-color: #2b2b2b;
                color: #e0e0e0;
                padding: 8px;
            }
            
            #saved-prompts:focus {
                outline: 1px solid #3da6ff;
                border-color: #3da6ff;
            }
        `;
        document.head.appendChild(style);

        // Add this style block for dropdown options
        const modelStyle = document.createElement('style');
        modelStyle.textContent = `
            #model-select option {
                background-color: #2b2b2b;
                color: #e0e0e0;
                padding: 8px;
            }
            
            #model-select:focus {
                outline: 1px solid #3da6ff;
                border-color: #3da6ff;
            }
        `;
        document.head.appendChild(modelStyle);

        // Add settings modal structure
        const settingsModal = document.createElement('div');
        settingsModal.id = 'settings-modal';
        settingsModal.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #282828;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 1001;
            width: 400px;
            color: white;
        `;

        // API Key Management Section
        const apiKeySection = document.createElement('div');
        apiKeySection.innerHTML = `
            <h3 style="text-align: center; margin-bottom: 5px; margin-top: 5;">Settings</h3>
            <h4 style="margin-top:5px; margin-bottom:5px;">Gemini API key</h4>
            <input type="password" id="api-key-input" placeholder="Enter Gemini API Key" 
                   style="width: 95%; padding: 8px; margin-bottom: 10px;">
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <button id="save-api-key" style="flex:1;">Save Key</button>
                <button id="delete-api-key" style="flex:1;">Delete Key</button>
            </div>
            <div style="text-align: center;">
                <a href="https://youtu.be/Gl2Y3OmsMuM" target="_blank" style="color: #3da6ff; text-decoration: none; font-size: 12px;">
                    How to get Gemini API key?
                </a>
                <a href="https://youtu.be/XwNnV1gi99o" target="_blank" style="color: #3da6ff; text-decoration: none; font-size: 12px;">
                    How to check usage?
                </a>
            </div>
        `;
        settingsModal.appendChild(apiKeySection);

        // Saved Prompts Management Section
        const promptsSection = document.createElement('div');
        promptsSection.innerHTML = `
        <br/>
            <h4>Saved Prompts</h4>
            <div id="prompts-list" style="max-height: 200px; overflow-y: auto;"></div>
        `;
        settingsModal.appendChild(promptsSection);

        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `width: fit; margin-top: 15px; margin-left:45%;padding:10px,border: 1px solid #444;
        border-radius: 10 px; `;
        closeButton.onclick = () => settingsModal.style.display = 'none';
        settingsModal.appendChild(closeButton);

        document.body.appendChild(settingsModal);

        // Info Modal
        const infoModal = document.createElement('div');
        infoModal.id = 'info-modal';
        infoModal.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #282828;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 1002;
            width: 400px;
            color: white;
            text-align: center;
        `;
        infoModal.innerHTML = `
            <h1 style="margin-top: 0;">Why Gemini?</h1>
            <div style="margin-bottom: 20px;">
                <p>Because Gemini is the only provider of a free tier for APIs.</p><p>Also, it is the best in terms of context length.</p> 
                <p>With the introduction of the Gemini 2.0 series of models, they have really raised the bar to match the top models in all areas.</p> 
                <p>They offer such a generous free tier that you never feel limited. Moreover, it resets every day.</p> 
                <p>So enjoy your free summaries with Gemmery.</p><p> If you want to support us in creating more tools like this, donate <a href="">here</a>.
            </div>
            <button id="close-info-modal" style="padding: 10px 15px; border: none; border-radius: 5px; background-color: #555; color: white; cursor: pointer;">Close</button>
        `;
        document.body.appendChild(infoModal);

        containerElement.insertBefore(container, containerElement.firstChild);
        
        loadPrompts();
        loadApiKey(); // New function to load existing API key
    }

    // New function to show settings modal
    function showSettingsModal() {
        const modal = document.getElementById('settings-modal');
        modal.style.display = 'block';
        
        // Load current API key
        chrome.runtime.sendMessage({action: 'getStorageData'}, response => {
            if (response.success) {
                document.getElementById('api-key-input').value = response.apiKey || '';
            }
        });

        // Load saved prompts for management
        chrome.runtime.sendMessage({action: 'getStorageData'}, response => {
            const promptsList = document.getElementById('prompts-list');
            promptsList.innerHTML = '';
            
            if (response.prompts?.length > 0) {
                response.prompts.forEach(prompt => {
                    const div = document.createElement('div');
                    div.style.cssText = `display: flex; justify-content: space-between; align-secondary: center; padding: 5px 0;`;
                    
                    div.innerHTML = `
                        <span>${prompt.name}</span>
                        <button class="delete-prompt" data-name="${prompt.name}" 
                                style="color: #ff6b6b; padding: 2px 8px;">Delete</button>
                    `;
                    
                    div.querySelector('.delete-prompt').addEventListener('click', deletePrompt);
                    promptsList.appendChild(div);
                });
            } else {
                promptsList.innerHTML = '<div style="color: #888;">No saved prompts found</div>';
            }
        });
    }

    // Updated savePrompt function with proper error handling
    function savePrompt() {
        const promptName = prompt('Enter a name for this prompt:');
        if (!promptName) return;

        const promptContent = document.getElementById('prompt-input').value.trim();
        if (!promptContent) return;

        chrome.runtime.sendMessage({
            action: 'manageStorage',
            operation: 'addPrompt',
            value: {name: promptName, content: promptContent}
        }, response => {
            if (response.success) {
                loadPrompts();
                document.getElementById('prompt-input').value = '';
                // Refresh settings modal immediately
                showSettingsModal();  
            } else {
                alert(`Failed to save prompt: ${response.error?.message || response.error}`);
            }
        });
    }

    // New function to delete prompts
    function deletePrompt(event) {
        const promptName = event.target.dataset.name;
        if (!confirm(`Delete "${promptName}" permanently?`)) return;

        chrome.runtime.sendMessage({
            action: 'manageStorage',
            operation: 'deletePrompt',
            value: promptName
        }, response => {
            if (response.success) {
                loadPrompts();
                showSettingsModal(); // Refresh the list
            } else {
                alert('Error deleting prompt: ' + response.error);
            }
        });
    }

    // Updated loadPrompts function
    function loadPrompts() {
        chrome.runtime.sendMessage({action: 'getStorageData'}, response => {
            const promptSelect = document.getElementById('saved-prompts');
            promptSelect.innerHTML = '<option value="">Select a saved prompt</option>';
            
            if (response.prompts?.length > 0) {
                response.prompts.forEach(prompt => {
                    const option = document.createElement('option');
                    option.value = prompt.content;
                    option.textContent = prompt.name;
                    promptSelect.appendChild(option);
                });
            }
        });
    }

    // New API key management functions
    function loadApiKey() {
        chrome.runtime.sendMessage({action: 'getStorageData'}, response => {
            if (response.success) {
                // Update any UI elements that need the API key status
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.id === 'save-api-key') {
            const apiKey = document.getElementById('api-key-input').value.trim();
            chrome.runtime.sendMessage({
                action: 'manageStorage',
                operation: 'set',
                key: 'geminiApiKey',
                value: apiKey
            }, response => {
                if (response.success) {
                    alert('API key saved successfully!');
                }
            });
        }
        
        if (event.target.id === 'delete-api-key') {
            if (!confirm('Delete stored API key permanently?')) return;
            chrome.runtime.sendMessage({
                action: 'manageStorage',
                operation: 'delete',
                key: 'geminiApiKey'
            }, response => {
                if (response.success) {
                    document.getElementById('api-key-input').value = '';
                } else {
                    alert('Error deleting API key: ' + response.error);
                }
            });
        }

        if (event.target.id === 'show-api-key-guide') {
            event.preventDefault();
            document.getElementById('api-key-guide-modal').style.display = 'block';
        }
        if (event.target.id === 'close-guide-modal') {
            document.getElementById('api-key-guide-modal').style.display = 'none';
        }

        if (event.target.id === 'close-info-modal') {
            document.getElementById('info-modal').style.display = 'none';
        }
    });

    // Function to get the transcript
    async function getTranscript() {
        // Try to expand transcript if not visible
        const expandButton = document.querySelector('tp-yt-paper-button#expand');
        if (expandButton) {
            expandButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay
        }

        // Wait for and click transcript tab
        try {
            const transcriptTab = await waitForElement(
                'button[aria-label="Show transcript"]', // Updated selector
                3000
            );
            
            if (transcriptTab) {
                transcriptTab.click();
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        } catch (error) {
            console.warn('Gemmery logs: Could not find transcript tab:', error);
        }

        // Wait for panels to load
        await waitForElement('#panels', 10000); // 10 second timeout

        const existingSegments = document.querySelectorAll('ytd-transcript-segment-renderer');
        console.log('Gemmery logs: Found transcript segments:', existingSegments.length);
        
        if (existingSegments.length > 0) {
            const transcript = extractTranscriptText(existingSegments);
            return transcript;
        }
        
        console.warn('Gemmery logs: No transcript segments found after expansion');
        return null;
    }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve(el);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Element not found: ' + selector));
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    function extractTranscriptText(segments) {
        return Array.from(segments).map(segment => {
            // Directly target the formatted text element
            const textEl = segment.querySelector('yt-formatted-string.segment-text');
            return textEl ? textEl.textContent.trim() : '';
        }).filter(text => text.length > 0) // Remove empty entries
        .join(' '); // Combine into single string
    }

    let isProcessing = false; // Add global flag

    // Handle the button click
    async function handleSummarizeClick() {
        if (isProcessing) return;
        
        // Get selected model
        const modelSelect = document.getElementById('model-select');
        const selectedModel = modelSelect.value;

        // Check for API key
        const { geminiApiKey } = await chrome.storage.sync.get('geminiApiKey');
        if (!geminiApiKey) {
            // Create custom alert modal
            const alertModal = document.createElement('div');
            alertModal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #282828;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                color: white;
                z-index: 1003;
                width: 300px;
            `;
            alertModal.innerHTML = `
                <h3 style="margin: 0 0 15px 0;">API Key Required</h3>
                <p style="margin-bottom: 15px;">Please set your Gemini API key to continue.</p>
                <a href="#" id="show-guide-from-alert" 
                   style="color: #3da6ff; text-decoration: none; font-size: 14px;">
                    Where to get API key?
                </a>
                <div style="margin-top: 20px;">
                    <button id="close-alert-modal" 
                        style="padding: 8px 16px; background-color: #3da6ff; 
                               border: none; border-radius: 4px; color: white; 
                               cursor: pointer;">
                        Close
                    </button>
                </div>
            `;
            
            // Add modal to DOM
            document.body.appendChild(alertModal);

            // Add event listeners
            alertModal.querySelector('#show-guide-from-alert').addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('api-key-guide-modal').style.display = 'block';
                alertModal.remove();
            });

            alertModal.querySelector('#close-alert-modal').addEventListener('click', () => {
                alertModal.remove();
            });

            return;
        }

        isProcessing = true;
        
        try {
            if (!chrome.runtime?.id) {
                throw new Error('Extension updated - please reload this page');
            }

            const transcript = await getTranscript();
            if (!transcript) return;

            sessionStorage.setItem('lastTranscript', transcript);

            chrome.runtime.sendMessage({
                action: "openSummaryTab",
                transcript: transcript,
                customPrompt: document.getElementById('prompt-input').value,
                model: selectedModel
            });
            
        } catch (error) {
            console.error('Gemmery logs: Summary failed:', error);
            alert(`Error: ${error.message}\n\nCheck console for details`);
        } finally {
            isProcessing = false;
        }
    }

    // New function to show info modal
    function showInfoModal() {
        const modal = document.getElementById('info-modal');
        modal.style.display = 'block';
    }

 