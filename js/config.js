var canvas = document.querySelector("canvas");
var body = document.querySelector("body");
let ctx = canvas.getContext("2d");
let savebtn = document.querySelector("#saveButton");

/* Size canvas to window size */
canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;

/* Colors ig */
const YELLOW = "#CCCC66";
const RED = "#d84545";
const BLUE = "#656fc9";
const GREEN = "#a3d08c";
const LIGHTBLUE = "#5de6f5";
const LIGHTGRAY = "#cccccc";
const GREY = "#666666";
const BLACK = "#222222";

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

/*  stolen from :
    https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    percentage can be negative
*/
function shadeColor(color, percent) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    R = Math.round(R / 10) * 10;
    G = Math.round(G / 10) * 10;
    B = Math.round(B / 10) * 10;

    var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
    var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
    var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

    return "#" + RR + GG + BB;
}
