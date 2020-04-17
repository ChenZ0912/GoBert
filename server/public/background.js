window.result = {}
chrome.storage.local.clear();
function onClickHandler(info, tab) {
  console.log(`${info.selectionText}`);
  fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: `{getSearchResult(query:"${info.selectionText}"){category professor courseID courseTitle score numRate}}`})
  })
    .then(r => r.json())
    .then(data => { window.result = data; chrome.runtime.sendMessage({type :"course-selection", result: result}); })
};

chrome.contextMenus.create({
  "id" : "GobertSearch",
  "title": "Search in GoBert",
  "contexts": ["selection"],
  "onclick": onClickHandler
});


chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  if (request.type == "authorized-token") {
    console.log("Received token from login page");
    chrome.storage.local.set({'jwtToken': request.data}, function(){
      console.log("Token Saved");
      chrome.storage.local.get('jwtToken', function(items) {
        console.log("Token found");
        console.log(items['jwtToken']);
      });
    });
  } else if (request.type == "log-out") {
    console.log("User log out");
    chrome.storage.local.clear(function(){
      chrome.storage.local.get({'jwtToken' : 'not-found'}, function(items) {
        console.log(items['jwtToken']);
      });
    })
  }
});


