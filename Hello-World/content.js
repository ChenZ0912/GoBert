function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

function createSearchCourseDiv(courseInfo) {
    // Remove the previous display
    var blockID = "gobert_display";
    $("#" + blockID).remove();
    
    var displayDiv = $("<div>Test Div</div>");
    displayDiv.attr('id', blockID);
    displayDiv.css({
        "position":"fixed", 
        "top": "5%", 
        "right": "5%",
        "background": "grey",
        "width": "300px",
        "height": "300px",
        "z-index": "999"
    });

    $("body").append(displayDiv);
}


function doSomethingWithSelectedText() {
    var selectedText = getSelectedText();
    if (selectedText) {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/search",
            success: function (data) {
                createSearchCourseDiv(data);
            },
            error: function (err) {
                alert(err);
            }
        });
    }
}

document.onmouseup = doSomethingWithSelectedText;
document.onkeyup = doSomethingWithSelectedText;