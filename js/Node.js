import { Canvas } from "./Canvas.js";
import { Link } from "./Link.js";
import { ctx, colors, shadeColor, download } from "./config.js";

export class Node {
    static allNodes = [];
    static lastNodeId = 0;

    /**
     * Constructor for a Node
     * @param {int} id ID of the node
     * @param {string} name name printed on the node
     * @param {Object} coords must be {x, y}
     * @param {int} coords.x
     * @param {int} coords.y
     */
    constructor(name, coords, color = colors.BLUE) {
        this.id = Node.lastNodeId;
        this.name = name;
        this.coords = coords;
        this.color = color;
        this.hovered = false;
        this.selected = false;
        this.concerned = false;

        Node.allNodes.push(this);
        Node.lastNodeId++;
    }

    static defaultNodePath(coords) {
        // Create circle
        // it needs to be scaled after the zoom factor
        // god please
        let circle = new Path2D();
        circle.arc(coords.x * (1 / Canvas.zoomFactor), coords.y * (1 / Canvas.zoomFactor), 50 * (1 / Canvas.zoomFactor), 0, 2 * Math.PI);

        return circle;
    }

    draw() {
        ctx.beginPath();
        ctx.setLineDash([0]);
        ctx.fillStyle = this.color;

        // Draw circle
        ctx.arc(this.coords.x, this.coords.y, 50, 0, 2 * Math.PI);
        ctx.fill();

        // Write text
        ctx.fillStyle = "white";
        ctx.font = "12px Verdana";
        let nameOffsetX = ctx.measureText(this.name).width / 2;
        ctx.fillText(this.name, this.coords.x - nameOffsetX, this.coords.y + 6);

        ctx.beginPath();
        ctx.strokeStyle = shadeColor(this.color, -30);

        // Make border
        if (this.selected || this.hovered || this.concerned) {
            // if hovered/selected, border is larger but inset
            ctx.lineWidth = 5;
            ctx.setLineDash([10]);
            ctx.arc(this.coords.x, this.coords.y, 50, 0, 2 * Math.PI);
        } else {
            ctx.lineWidth = 5;
            ctx.arc(this.coords.x, this.coords.y, 50, 0, 2 * Math.PI);
        }
        ctx.stroke();
    }

    static drawOutline(coords) {
        ctx.beginPath();
        ctx.fillStyle = colors.BLACK;
        ctx.strokeStyle = colors.BLACK;
        ctx.lineWidth = 5;
        ctx.setLineDash([10]);
        ctx.arc(coords.x, coords.y, 50, 0, 2 * Math.PI);
        ctx.stroke();
    }

    /**
     *
     * @param {int} id
     * @returns {Node} a node
     */
    static find(id) {
        let foundNode = null;
        this.allNodes.forEach((node) => {
            if (node.id == id) {
                foundNode = node;
            }
        });
        return foundNode;
    }

    /**
     * Moves a Node to said coordinates
     *
     * @param {*} coords
     */
    move(coords) {
        this.coords = {
            x: coords.x,
            y: coords.y,
        };
    }

    changeName(newName) {
        this.name = newName;
        Canvas.update();
    }

    changeColor(color) {
        this.color = color;
        Canvas.update();
    }

    delete() {
        Node.allNodes.splice(Node.allNodes.indexOf(this), 1);
        Node.allNodes.forEach((node) => {
            if (node.linkedNodes.includes(this.id)) {
                node.linkedNodes.splice(node.linkedNodes.indexOf(this.id), 1);
            }
        });

        delete this;
        Canvas.update();
    }

    static checkData() {
        let allIDs = [];
        Node.allNodes.forEach((node) => {
            /* Checks that every ID is unique */
            if (allIDs.includes(node.id)) {
                throw "ID is duplicate ! (" + node.id + ")";
            }
            allIDs.push(node.id);
        });
    }

    static drawAll() {
        this.allNodes.forEach((node) => {
            node.draw();
        });
    }

    static exportJSON() {
        download("nodes.json", JSON.stringify(this.allNodes));
    }
}
