var canvas = document.querySelector("canvas");
var body = document.querySelector("body");
let ctx = canvas.getContext("2d");
let savebtn = document.querySelector("#saveButton");

/* Size canvas to window size */
canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;

/* Colors ig */
const YELLOW = "#c2aa76";
const RED = "#d84545";
const BLUE = "#656fc9";
const GREEN = "#a3d08c";
const LIGHTBLUE = "#5de6f5";
const GREY = "#666666";

/* Makes the user download something */
function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
