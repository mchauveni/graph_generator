import { Canvas } from "./Canvas.js";
import { Node } from "./Node.js";
import { User } from "./User.js";

export let downloadbtn = document.querySelector("#download_button");
export let savebtn = document.querySelector("#save_button");
export let defaultModebtn = document.querySelector("#tool_normal_cursor");
export let newNodebtn = document.querySelector("#tool_new_node");
export let newLinkbtn = document.querySelector("#tool_new_link");

// CLICK ON DOWNLOAD BUTTON ============================================================================================================================
downloadbtn.addEventListener("click", () => {
    Node.exportJSON();
});

defaultModebtn.addEventListener("click", () => {
    User.changeMode("default");
    console.log("User mode changed : " + User.mode);
    User.setSelectedNode(-1);
    Canvas.update();
});

newNodebtn.addEventListener("click", () => {
    User.changeMode("newNode");
    console.log("User mode changed : " + User.mode);
    User.setSelectedNode(-1);
    Canvas.update();
});

newLinkbtn.addEventListener("click", () => {
    User.changeMode("newLink");
    console.log("User mode changed : " + User.mode);
    User.setSelectedNode(-1);
    Canvas.update();
});
