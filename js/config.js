export var canvas = document.querySelector("canvas");
export var body = document.querySelector("body");
export let ctx = canvas.getContext("2d");
export let nodeMenu = document.querySelector("#node_config_menu");

/* Size canvas to window size */
canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;

/* Colors ig */
export const colors = {
    RED: "#cc4747",
    ORANGE: "#cc7347",
    YELLOW: "#ccc347",
    GREEN: "#7ccc47",
    TURQUOISE: "#47cc7e",
    CYAN: "#47ccc8",
    BLUE: "#477ecc",
    BLURPLE: "#5b47cc",
    VIOLET: "#8547cc",
    PURPLE: "#b647cc",
    PINK: "#cc47b1",
    SALMON: "#cc4771",
    LIGHTGRAY: "#cccccc",
    MIDGREY: "#999999",
    GREY: "#666666",
    BLACK: "#1a1a1a",
};

/* Makes the user download something */
export function download(filename, text) {
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
note : percentage can be negative
*/
export function shadeColor(color, percent) {
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
