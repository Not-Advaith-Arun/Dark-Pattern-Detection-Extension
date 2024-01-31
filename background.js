// background.js

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'makeAPICall') {
      fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bulk_text: request.text
        }),
      })
      .then(response => response.json())
      .then(data => {
        sendResponse({ detected_sections: data.detected_sections });
      })
      .catch(error => {
        console.error('Error making API call:', error);
        sendResponse({ detected_sections: [] });
      });
  
      // Indicate that the response will be sent asynchronously
      return true;
    }
    else if (request.action === 'selectedText') {
        fetch('http://127.0.0.1:5000/positive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bulk_text: request.text
          }),
        })
        .then(response => response.json())
        .then(data => {
          sendResponse({ detected_sections: data.detected_sections });
        })
        .catch(error => {
          console.error('Error making API call:', error);
          sendResponse({ detected_sections: [] });
        });
    
        // Indicate that the response will be sent asynchronously
        return true;
      }
      else if (request.action === 'deleteText') {
        fetch('http://127.0.0.1:5000/negative', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bulk_text: request.text
          }),
        })
        .then(response => response.json())
        .then(data => {
          sendResponse({ detected_sections: data.detected_sections });
        })
        .catch(error => {
          console.error('Error making API call:', error);
          sendResponse({ detected_sections: [] });
        });
    
        // Indicate that the response will be sent asynchronously
        return true;
      }
  });
  