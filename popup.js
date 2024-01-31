document.addEventListener('DOMContentLoaded', function() {
  // Listener for the "Check Text" button
  document.getElementById('checkButton').addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'checkText' }, function(response) {
              // Handle the response if needed
          });
      });
  });

  // Listener for the "Extract Selected Text" button
  document.getElementById('extractButton').addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'logSelectedText' }, function(response) {
              // Handle the response if needed
          });
      });
  });
});
