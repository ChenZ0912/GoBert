// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
   });
});

function onClickHandler(info, tabs) {
  alert("Search: " + info.selectionText)
};

chrome.contextMenus.create({
  "title": "test",
  "contexts": ["selection"],
  "onclick": onClickHandler
});

