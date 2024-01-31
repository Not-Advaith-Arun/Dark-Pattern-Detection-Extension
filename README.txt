*************************************************************
**                     Browser Extension                    **
*************************************************************

** Content Script (`content.js`) **

[Event Listeners]
1. 'Check Text' Button Listener
   - Description: Listens for clicks on the "Check Text" button in the extension popup.
   - Action: Sends a message to the active tab requesting to check the text on the page.
   - Usage: Triggered by clicking the "Check Text" button in the extension popup.

2. 'Extract Selected Text' Button Listener
   - Description: Listens for clicks on the "Extract Selected Text" button in the extension popup.
   - Action: Sends a message to the active tab requesting to log the selected text on the page.
   - Usage: Triggered by clicking the "Extract Selected Text" button in the extension popup.

** Manifest File (`manifest.json`) **

[Permissions]
- activeTab: Allows the extension to interact with the currently active tab.
- http://127.0.0.1:5000/*: Permits communication with a local server at the specified address.

[Browser Action]
- Icon: Uses a custom icon for the extension.
- Popup: Displays the HTML file (popup.html) when the extension icon is clicked.

[Content Scripts]
- Matches: Injects the content.js script into all URLs.

[Icons]
- Defines icons of different sizes for the extension.

[Browser-Specific Settings (for Firefox)]
- Extension ID: "text-extractor@example.com"
- Strict Minimum Version: 42.0

[Web Accessible Resources]
- Makes the content.js script accessible to web pages.

[Background Script]
- Script: Uses background.js as the background script.
- Persistence: Non-persistent background script.

** Background Script (`background.js`) **

[Message Listener]
- Listens for messages from the content script.

[Actions]
1. 'makeAPICall'
   - Description: Makes a POST request to 'http://127.0.0.1:5000/predict' with the provided text.
   - Response: Sends the detected sections back to the content script.

2. 'selectedText'
   - Description: Makes a POST request to 'http://127.0.0.1:5000/positive' with the selected text.
   - Response: Sends the detected sections back to the content script.

3. 'deleteText'
   - Description: Makes a POST request to 'http://127.0.0.1:5000/negative' with the text to be deleted.
   - Response: Sends the detected sections back to the content script.

[Asynchronous Response]
- Returns true to indicate that the response will be sent asynchronously.

[Error Handling]
- Logs errors to the console and sends an empty array of detected sections in case of an error.

** Additional Functions **

- getSelectedText()
  - Description: Retrieves the currently selected text on the webpage.
  - Returns: Selected text or a default string if no text is selected.

- sendTextToServer(text, callback)
  - Description: Sends the provided text to the server for processing.
  - Parameters: text - Text to be sent to the server, callback - Callback function to handle the server response.

- sendSelectedTextToServer(text, callback)
  - Description: Sends the selected text to the server for processing.
  - Parameters: text - Selected text to be sent to the server, callback - Callback function to handle the server response.

- colorDetectedSections(detectedSections)
  - Description: Adds CSS styles to highlight and display information about detected sections.
  - Parameters: detectedSections - Array of detected sections with confidence and additional information.

- getColorFromConfidence(confidence)
  - Description: Converts confidence level to an HSL color for highlighting.
  - Parameters: confidence - Confidence level of a detected section.

- replaceTextWithElement(text, element)
  - Description: Replaces occurrences of a specified text with a given HTML element.
  - Parameters: text - Text to be replaced, element - HTML element to replace the text.

- escapeRegExp(string)
  - Description: Escapes special characters in a string for use in regular expressions.
  - Parameters: string - Input string to be escaped.

- handleServerResponse(response)
  - Description: Logs the receipt of a server response to the console.

*************************************************************
