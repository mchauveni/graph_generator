import { Node } from "./Node.js";
import { Canvas } from "./Canvas.js";
import { canvas } from "./config.js";
import { openMenu, closeMenu } from "./menu.js";
import { defaultModebtn, newNodebtn, newLinkbtn } from "./header.js";

let validModes = ["default", "newNode", "newLink"];

export class User {
    static selectedNode = -1;
    static hoveredNode = -1;
    static concernedNodes = [];
    static mousecoords = {
        x: 0,
        y: 0,
    };
    static mousedown = false;
    static mousedrag = false;
    static mode = "default";

    static moveHandler = {
        lastClickCoords: {
            x: 0,
            y: 0,
        },
        offsetCoords: {
            x: 0,
            y: 0,
        },
    };

    /**
     * Makes a Node selected.
     * Changes User.selectedNode & node.selected
     *
     * @param {int} id ID of the node we want to Select
     */
    static setSelectedNode(id) {
        if (id == User.selectedNode) {
            return;
        }

        // Unselect currently selected node, if selected
        if (Node.find(User.selectedNode)) {
            Node.find(User.selectedNode).selected = false;
        }
        this.selectedNode = id;

        // If explicitly said to unselect node, close menu
        if (id == -1) {
            closeMenu();
        }

        if (id != -1) {
            Node.find(id).selected = true;

            // When selecting a Node, calculate offset from center of the node to cursor location
            // Useful only for the node not to blink to cursor if not centered properly
            this.moveHandler.offsetCoords = {
                x: Node.find(id).coords.x - this.moveHandler.lastClickCoords.x,
                y: Node.find(id).coords.y - this.moveHandler.lastClickCoords.y,
            };

            // Puts the node at the end of the Node.allNodes array
            // So it overlap the other nodes (latest used is latest drawn)
            let nodeIndex = Node.allNodes.indexOf(Node.find(id));
            if (nodeIndex < Node.allNodes.length - 1) {
                Node.allNodes.push(Node.allNodes.splice(nodeIndex, 1)[0]);
            }
            openMenu(Node.find(id));
        }

        Canvas.update();
    }

    static setHoveredNode(id) {
        this.hoveredNode = id;
        Node.allNodes.forEach((node) => {
            node.hovered = false;
        });

        if (id != -1) {
            Node.find(id).hovered = true;
        }

        Canvas.update();
    }

    static addConcernedNode(id) {
        this.concernedNodes.push(id);
        Node.find(id).concerned = true;

        Canvas.update();
    }

    static removeConcernedNode(id) {
        let index = this.concernedNodes.indexOf(id);
        this.concernedNodes.splice(index, 1);
        Node.find(id).concerned = false;

        Canvas.update();
    }

    static registerCoords(coords) {
        this.moveHandler.lastClickCoords = {
            x: coords.x,
            y: coords.y,
        };
    }

    /**
     * Register the position of the mouse, with the canvas zoom factor.
     *
     * @param {mouseEvent} mouse a mouseEvent
     * @returns {Object} coords.x & coords.y
     */
    static mousePos(mouse) {
        var rect = canvas.getBoundingClientRect();
        let coords = {
            x: Math.round((mouse.clientX - rect.left) * (1 / Canvas.zoomFactor)),
            y: Math.round((mouse.clientY - rect.top) * (1 / Canvas.zoomFactor)),
        };
        return coords;
    }

    static changeMode(mode) {
        // Checks mode
        if (!validModes.includes(mode)) {
            throw "ERR : Mode not recognized";
        }

        // Puts an "active" class on the button corresponding to selected mode
        let allButtons = [defaultModebtn, newNodebtn, newLinkbtn];
        allButtons.forEach((button) => {
            button.classList.remove("active");
        });

        switch (mode) {
            case "default":
                defaultModebtn.classList.add("active");
                break;

            case "newNode":
                newNodebtn.classList.add("active");
                break;

            case "newLink":
                newLinkbtn.classList.add("active");
                break;
        }

        this.mode = mode;
    }
}
