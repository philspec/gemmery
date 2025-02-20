document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'updateSummary') {
            const summaryElement = document.getElementById('summary-content');
            const loadingElement = document.getElementById('loading');
            
            if (!summaryElement || !loadingElement) {
                console.error('UI elements missing!');
                return;
            }

            if (request.error) {
                document.body.innerHTML = `<h2>Error</h2><p>${request.error}</p>`;
            } else {
                summaryElement.textContent = request.summary;
                summaryElement.style.display = 'block';  // Ensure visibility
                loadingElement.style.display = 'none';
            }
        }
    });
    
    // Show loading state initially
    document.getElementById('loading').style.display = 'block';

    // Add context recovery
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'extensionReloaded') {
            document.body.innerHTML = '<h2>Extension updated - please reload page</h2>';
        }
    });

    // Add timeout handling
    const LOAD_TIMEOUT = 60000; // Increased to 60 seconds

    setTimeout(() => {
        if (!document.getElementById('summary-content').textContent) {
            document.body.innerHTML = '<h2 style="color: red">Summary timed out - try again</h2>';
        }
    }, LOAD_TIMEOUT);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.transcript) {
        generateSummary(request.transcript, request.customPrompt);
    }
});

async function generateSummary(transcript, customPrompt) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    // Show loading animation
    loading.style.display = 'block';
    content.style.display = 'none';

    chrome.runtime.sendMessage({
        action: "summarize",
        transcript: transcript,
        customPrompt: customPrompt
    }, (response) => {
        if (response.error) {
            loading.innerHTML = `<div class="error">Error: ${response.error}</div>`;
            return;
        }
        
        // Hide loading and show content
        loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = formatSummary(response.summary);
    });
}

function formatSummary(text) {
    // Preserve line breaks and basic formatting
    return text.replace(/\n/g, '<br>')
               .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Update message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSummary') {
        const loading = document.getElementById('loading');
        const content = document.getElementById('content');
        
        if (request.error) {
            loading.innerHTML = `<div class="error">Error: ${request.error}</div>`;
            return;
        }
        
        loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = formatSummary(request.summary);
    }
});

// Replace this with your actual API call
async function fetchSummaryFromAPI(transcript, prompt) {
    // Simulated API response with formatted text
    return `## Key Takeaways
    
* The video discusses three main approaches to AI safety
* Current models show emergent capabilities requiring new safety paradigms
* Researchers propose a multi-layered defense strategy

## Detailed Analysis

### Technical Safeguards
* Improved alignment techniques using constitutional AI
* Development of truthfulness benchmarks
* Automated oversight systems

### Policy Recommendations
* Graduated deployment of advanced AI systems
* International cooperation frameworks
* Third-party auditing requirements`;
}