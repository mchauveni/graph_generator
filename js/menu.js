import { colors, shadeColor, nodeMenu } from "./config.js";
import { User } from "./User.js";
import { Node } from "./Node.js";
import { Canvas } from "./Canvas.js";

export const colorWrapper = document.querySelector("#color_wrapper");
export const nodeNameViz = document.querySelector("#node_name");

export function colorItem(colorName) {
    let div = document.createElement("div");

    div.classList.add("color_picker");
    div.style.backgroundColor = colors[colorName];
    div.style.borderColor = shadeColor(colors[colorName], -30);
    div.dataset.color = colorName;

    div.addEventListener("click", () => {
        Node.find(User.selectedNode).changeColor(colors[div.dataset.color]);
        Canvas.update();
    });

    return div;
}

// Create a color-click element in the menu for each existing color in the color array
for (const color in colors) {
    colorWrapper.appendChild(colorItem(color));
}

export function openMenu(nodeName) {
    nodeMenu.classList.add("nodeClicked");
    nodeNameViz.value = nodeName;
}

export function closeMenu() {
    nodeMenu.classList.remove("nodeClicked");
}

nodeNameViz.addEventListener("input", () => {
    Node.find(User.selectedNode).changeName(nodeNameViz.value);
});
