document.addEventListener('DOMContentLoaded', () => {
    const summaryElement = document.getElementById('content');
    const loadingElement = document.getElementById('loading');
    
    // Single message listener for summary updates
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'updateSummary') {
            if (!summaryElement || !loadingElement) {
                console.error('UI elements missing!');
                return;
            }

            if (request.error) {
                loadingElement.style.display = 'none';
                summaryElement.innerHTML = `
                    <div class="error">
                        <h2>Error</h2>
                        <p>${request.error}</p>
                    </div>`;
                summaryElement.style.display = 'block';
            } else {
                loadingElement.style.display = 'none';
                summaryElement.style.display = 'block';
                summaryElement.innerHTML = formatSummary(request.summary);
            }
        }
    });
    
    // Show loading state initially
    loadingElement.style.display = 'block';
    summaryElement.style.display = 'none';

    // Add timeout handling
    const LOAD_TIMEOUT = 60000; // 60 seconds
    setTimeout(() => {
        if (loadingElement.style.display !== 'none') {
            loadingElement.style.display = 'none';
            summaryElement.innerHTML = '<h2 style="color: red">Summary timed out - please try again</h2>';
            summaryElement.style.display = 'block';
        }
    }, LOAD_TIMEOUT);
});

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