//Listener func that waits for button press
if (typeof browser !== 'undefined') {
  //For Firefox and other browsers
  browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    handleMessage(request, sender, sendResponse);
  });
} else if (typeof chrome !== 'undefined') {
  //For Chrome
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    handleMessage(request, sender, sendResponse);
  });
}

function handleMessage(request, sender, sendResponse) {
  if (request.action === 'logSelectedText') {
    // Log the selected text to the console
    var txt = getSelectedText();
    sendSelectedTextToServer(txt, function(response) {
      // Handle the response from the server
      handleServerResponse(response);
      // Send the response back to the popup
      sendResponse({ text: txt });
    });
  }
  else if (request.action === 'checkText') {
    var pageText = document.body.innerText;
    // If action is to extract text (from button press) then we take all of the innerHTML from the page and send to func.
    sendTextToServer(pageText, function(response) {
      // Handle the response from the server
      handleServerResponse(response);
      // Send the response back to the popup
      sendResponse({ text: pageText });
    });

    // Async func requirement.
    return true;
  }
}

//contains selected text.
function getSelectedText() {
  var selectedText = '';
  if (window.getSelection) {
      selectedText = window.getSelection().toString();
  } else if (document.selection && document.selection.type != 'Control') {
      selectedText = document.selection.createRange().text;
  }
  return selectedText.trim() || "bingchilling";
}

function sendTextToServer(text, callback) {
  if (typeof browser !== 'undefined') {
    browser.runtime.sendMessage({
      action: 'makeAPICall',
      text: text
    })
    .then(response => {
      console.log('Response from API:', response);
      // Color the detected sections within the document
      colorDetectedSections(response.detected_sections);
      callback({ data: response, error: null });
    })
    .catch(error => {
      console.error('Error making API call:', error);
      callback({ data: null, error: 'Failed to make API call' });
    });
  }
  else {
        //this is the part that sends an API call to the backend (ai model)
  fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bulk_text: text
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Response from API:', data);
    //Color the detected sections within the document
    colorDetectedSections(data.detected_sections);
    callback({ data: data, error: null });
  })
  .catch(error => {
    console.error('Error making API call:', error);
    callback({ data: null, error: 'Failed to make API call' });
  });
  }
}

function sendSelectedTextToServer(text, callback) {
  if (typeof browser !== 'undefined') {
    browser.runtime.sendMessage({
      action: 'selectedText',
      text: text
    })
    .then(response => {
      console.log('Response from API:', response);
      callback({ data: response, error: null });
    })
    .catch(error => {
      console.error('Error making API call:', error);
      callback({ data: null, error: 'Failed to make API call' });
    });
  }
  else {
  fetch('http://127.0.0.1:5000/positive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Response from API:', data);
    callback({ data: data, error: null });
  })
  .catch(error => {
    console.error('Error making API call:', error);
    callback({ data: null, error: 'Failed to make API call' });
  });
  }
}

function colorDetectedSections(detectedSections) {
  // Add CSS style for the hover effect and tooltip
  var style = document.createElement('style');
  style.textContent = `
  .highlight-wrapper {
      position: relative;
      display: inline-block;
      z-index: 9999;
  }

  .highlight {
      border: 2px solid red;
      color: red;
      display: inline-block;
      position: relative;
  }

  .tooltip {
      position: absolute;
      top: -40px; /* Adjust this value as needed */
      right: 0;
      background: rgba(255, 255, 255, 0.8); /* Translucent white background */
      color: black; /* White text color */
      padding: 5px;
      border: 1px solid #ccc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1;
      visibility: hidden;
  }

  .highlight-wrapper:hover .tooltip {
      visibility: visible;
      z-index: 9999;%
  }

  .falseAlarmButton {
      cursor: pointer;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      padding: 5px 10px;
      border-radius: 5px;
      transition: background-color 0.3s ease; /* Add transition effect */
  }

  .falseAlarmButton:hover {
      background-color: #d4d4d4; /* Change background color on hover */
  }
`;

  document.head.appendChild(style);

  detectedSections.forEach(section => {
      var wrapper = document.createElement('div');
      wrapper.className = 'highlight-wrapper';

      var span = document.createElement('span');
      span.className = 'highlight';
      var confidence = section.confidence;
      var color = getColorFromConfidence(confidence);
      span.style.color = color;
      span.textContent = section.text;

      var tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = 'Detection information: ' + section.additionalInfo;

      var falseAlarmButton = document.createElement('button');
      falseAlarmButton.className = 'falseAlarmButton';
      falseAlarmButton.textContent = 'False Alarm';
      falseAlarmButton.addEventListener('click', function(section) {
        console.log("button clicked");
        var text = section.text;
        if (typeof browser !== 'undefined') {
          browser.runtime.sendMessage({
            action: 'deleteText',
            text: text
          })
          .then(response => {
            console.log('Response from API:', response);
            callback({ data: response, error: null });
          })
          .catch(error => {
            console.error('Error making API call:', error);
            callback({ data: null, error: 'Failed to make API call' });
          });
        }
        else {
        fetch('http://127.0.0.1:5000/negative', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Response from API:', data);
          callback({ data: data, error: null });
        })
        .catch(error => {
          console.error('Error making API call:', error);
          callback({ data: null, error: 'Failed to make API call' });
        });
        }
    });
    

      tooltip.appendChild(falseAlarmButton);
      span.appendChild(tooltip);
      wrapper.appendChild(span);

      replaceTextWithElement(section.text, wrapper);
  });
}
  
function getColorFromConfidence(confidence) {
  //hue maker
  var hue = (1 - confidence) * 120; //green -> 0 to red -> 1
  return `hsl(${hue}, 100%, 50%)`;
}

function replaceTextWithElement(text, element) {
  var regex = new RegExp('(' + escapeRegExp(text) + ')', 'gi');
  console.log(document.body.innerHTML);
  console.log(regex);
  document.body.innerHTML = document.body.innerHTML.replace(regex, function(match) {
    return element.outerHTML;
  });
}

function escapeRegExp(string) {
  // Exclude characters commonly used in HTML tags, including text within angle brackets
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function handleServerResponse(response){
  console.log("recieved");
}