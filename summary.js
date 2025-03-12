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
                summaryText = summaryText.split('\n').map(line => {
                    if (line.startsWith('# ')) {
                        const text = line.replace(/^# /, '').trim();
                        return `<span style="font-size:2.5rem; font-weight: bold;color:rgb(88, 177, 236);">${text}</span>`;
                    } else if (line.startsWith('#')) {
                        const text = line.replace(/^#+/, '').trim();
                        return `<span style="font-size:2rem;font-weight: bold;color:rgb(118, 169, 204);">${text}</span>`;
                    } else {
                        return line;
                    }
                }).join('\n')
                summaryText = summaryText.replace(/\*\*(.*?)\*\*/g, '<span style="font-size:1.5rem;font-weight:bold;color:rgb(179, 176, 44);">$1</span>');
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
