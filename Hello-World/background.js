window.result = {}
function onClickHandler(info, tab) {
  console.log(`${info.selectionText}`);
  fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: `{getSearchResult(query:"${info.selectionText}"){category professor courseID courseTitle _id score numRate}}`})
  })
    .then(r => r.json())
    .then(data => { window.result = data; chrome.runtime.sendMessage(data);} );
};

chrome.contextMenus.create({
  "id" : "GobertSearch",
  "title": "Search in GoBert",
  "contexts": ["selection"],
  "onclick": onClickHandler
});


