document.addEventListener('DOMContentLoaded', () => {
    const summaryElement = document.getElementById('content');
    const loadingElement = document.getElementById('loading');
    
    // Show loading state initially
    loadingElement.style.display = 'block';
    
    // Single message listener for summary updates
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'updateSummary') {
            if (!summaryElement || !loadingElement) {
                console.error('UI elements missing!');
                return;
            }

            if (request.error) {
                document.body.innerHTML = `<h2>Error</h2><p>${request.error}</p>`;
            } else {
                let summaryText = request.summary;
                // Find text enclosed in ** and wrap it with bold and larger font-size
                summaryText = summaryText.replace(/\*\*(.*?)\*\*/g, '<b style="font-size: 1.2em;">$1</b>');
                summaryElement.innerHTML = summaryText;
                summaryElement.style.display = 'block';
                loadingElement.style.display = 'none';
            }
        } else if (request.action === 'extensionReloaded') {
            document.body.innerHTML = '<h2>Extension updated - please reload page</h2>';
        }
    });

    // Add timeout handling
    const LOAD_TIMEOUT = 60000; // 60 seconds
    setTimeout(() => {
        if (!summaryElement.textContent) {
            document.body.innerHTML = '<h2 style="color: red">Summary timed out - try again</h2>';
        }
    }, LOAD_TIMEOUT);
});
