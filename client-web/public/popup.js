function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    console.log(key);
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

function render(array) {
  $(".table").empty();
  const table = document.querySelector(".table")
  if (array != undefined) {
    const keys = Object.keys(array[0]);
    generateTableHead(table,keys);
    generateTable(table,array);
    $(".search-result").html(table)
  }
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.type == "course-selection") {
      const result = request.result;
      const array = result.data['getSearchResult']
      render(array);
    }
    return true;
  }
);
window.onload = function() {
  console.log("Pop is opened");
  const bg = chrome.extension.getBackgroundPage();
  chrome.storage.local.get({"jwtToken":"not-logined"}, function(result){
    if (result["jwtToken"] != "not-logined") {
      console.log(result["jwtToken"].username);
      $(".not-login").hide();
      $(".logined").show();
      $("#username").html(result["jwtToken"].username);
    } else if (result["jwtToken"] == "not-logined") {
      $(".not-login").show();
      $(".logined").hide();
    }
  });
  if (bg.result != undefined) {
    render(bg.result.data['getSearchResult']);
  }
};

$(document).ready(function() {
  $("#search-submit").click(function() {
    console.log("Submitted");
    let input = $("input").val();
    fetch('http://localhost:4000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: `{getSearchResult(query:"${input}"){category professor courseID courseTitle _id score numRate}}`})
    })
      .then(r => r.json())
      .then(result => render(result.data['getSearchResult']) );
    return false;
  })

  $("#login").click(function() {
    login_url = "http://www.gobertweb.com:3000/login"
    chrome.tabs.create({url : login_url});
  });

  $("#signup").click(function() {
    register_url = "http://www.gobertweb.com:3000/register"
    chrome.tabs.create({url : register_url});
  });
});

