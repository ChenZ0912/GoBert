function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

function doSomethingWithSelectedText() {
    var selectedText = getSelectedText();
    if (selectedText) {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/search",
            success: function (data) {
                alert(selectedText + " " + JSON.stringify(data));
            },
            error: function (err) {
                alert(err);
            }
        });
    }
}

document.onmouseup = doSomethingWithSelectedText;
document.onkeyup = doSomethingWithSelectedText;