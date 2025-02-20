document.addEventListener('DOMContentLoaded', async () => {
    const { savedPrompt } = await chrome.storage.sync.get(["savedPrompt"]);
    if (savedPrompt) {
      document.getElementById('savedPrompt').value = savedPrompt;
    }

    document.getElementById('saveButton').addEventListener('click', () => {
      const prompt = document.getElementById('savedPrompt').value;
      chrome.storage.sync.set({ savedPrompt: prompt }, () => {
        alert('Prompt saved!');
      });
    });

    // Add API key guide modal handling
    const guideModal = document.getElementById('api-key-guide-modal');
    document.getElementById('get-api-key-link').addEventListener('click', (e) => {
        e.preventDefault();
        guideModal.style.display = 'block';
    });
    
    document.getElementById('close-guide-modal').addEventListener('click', () => {
        guideModal.style.display = 'none';
    });
  });