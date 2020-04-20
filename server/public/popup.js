const addToShoppingCartClass = "add-to-shoppingcart"
function generateTableHead(table, keys) {
  let thead = table.createTHead();
  let row = thead.insertRow();

  for (let key of keys) {
    if (key == undefined) continue;
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data, keys, isCourse) {
  let tbody = table.createTBody();
  for (let element of data) {
    let row = tbody.insertRow();
    let course_data = []
    for (let key of keys) {
      if (key == undefined) continue;
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
      if (key == "courseID" || key == "courseTitle") {
        course_data.push(element[key]);
      }
    }
    if (isCourse) {
      let cell = row.insertCell();
      generateSubmitButtonInTable(cell, course_data);
    }
  }
}

function generateSubmitButtonInTable(cell, course_data)  {
  let button = document.createElement("button");
  button.classList.add(addToShoppingCartClass)
  button.classList.add("btn");
  button.classList.add("btn-info")
  button.setAttribute("type", "submit");
  button.setAttribute("data-course", JSON.stringify(course_data))
  let text = document.createTextNode("Add");
  button.appendChild(text);
  cell.appendChild(button);
}
function render(array) {
  console.log("Render: ");
  console.log(array);
  $(".table").empty();
  const table = document.querySelector(".table")
  if (array != undefined) {
    const category = array[0]["category"];
    const keys = Object.keys(array[0]);
    var isCourse = false;
    if (category == "Professor") {
      delete keys[2];
      delete keys[3];
    } else if (category == "Course") {
      isCourse = true;
      delete keys[1];
    }
    console.log("Keys are: ")
    console.log(keys);
    generateTableHead(table, keys);
    generateTable(table, array, keys, isCourse);
    $(".search-result").html(table);
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
    let input = $("#search-input").val();
    fetch('https://gobert.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: `{getSearchResult(query:"${input}"){category name courseID courseTitle score numRate}}`})
    })
      .then(r => r.json())
      .then(result => render(result.data['getSearchResult']) );
    return false;
  })

  $("#login").click(function() {
    login_url = "https://gobert.herokuapp.com/login"
    chrome.tabs.create({url : login_url});
  });

  $("#signup").click(function() {
    register_url = "https://gobert.herokuapp.com/register"
    chrome.tabs.create({url : register_url});
  });
});

$(document).on('click', '.'+addToShoppingCartClass, function () {
  var course_info = $(this).data('course');
  console.log(course_info);
  chrome.storage.local.get({"jwtToken":"not-logined"}, function(items) {
    let user = items["jwtToken"]["username"]
    let token = items["jwtToken"]["token"]
    console.log(token)
    fetch('https://gobert.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({query: `
    mutation {
      addToShoppingCart(
        username: "${user}",
        courseID:  "${course_info[0]}",
        courseTitle: "${course_info[1]}",
        priority: "required"
      ) {
          courseID
          courseTitle
          score
          numRate
          priority
        }
     }`})
    }).then(r => r.json())
      .then(response => {
        if (response["errors"]) {
          alert(response["errors"][0]["message"])
        } else {
          alert("Successfully added to shopping cart. Go to Gobert homepage for further operations.")
        }
      });
  })
});

$(document).on('click', '#username', function () {
  homepage_url = "https://gobert.herokuapp.com/graphql"
  chrome.tabs.create({url : homepage_url});
});
