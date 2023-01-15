import { Canvas } from "./Canvas.js";
import { ctx, colors, shadeColor, download } from "./config.js";

export class Node {
    static allNodes = [];
    static links = [];
    static lastNodeId = 0;

    /**
     * Constructor for a Node
     * @param {int} id ID of the node
     * @param {string} name name printed on the node
     * @param {Object} coords must be {x, y}
     * @param {int} coords.x
     * @param {int} coords.y
     * @param {int[]} linkedNodes ID of all linked nodes
     */
    constructor(name, coords, linkedNodes, color = colors.BLUE) {
        this.id = Node.lastNodeId;
        this.name = name;
        this.coords = coords;
        this.color = color;
        this.hovered = false;
        this.selected = false;
        this.concerned = false;
        this.linkedNodes = linkedNodes;

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

    /**
     *
     * @param {int} id
     * @returns {Node} a node
     */
    static find(id) {
        let foundNode = null;
        Node.allNodes.forEach((node) => {
            if (node.id == id) {
                foundNode = node;
            }
        });
        return foundNode;
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

            /* Checks that every link is valid AND two-way */
            node.linkedNodes.forEach((nodeID) => {
                let linkedNode = this.find(nodeID); //retrieve object from ID
                if (linkedNode === null) {
                    throw `Invalid linked node ID ! (${node.name} (${node.id}) has invalid link (${nodeID}))`;
                } else {
                    if (!linkedNode.linkedNodes.includes(node.id)) {
                        throw `Link is not two-way ! (${node.name} (${node.id}) is linked to ${linkedNode.name} (${linkedNode.id}) but it is not linked back)`;
                    }
                }
            });
        });
    }

    static drawAllLinks() {
        //PROBLEM : EVERY LINKS DRAW TWICE
        this.allNodes.forEach((node) => {
            node.linkedNodes.forEach((linkedNode) => {
                linkedNode = this.find(linkedNode);
                Node.drawLink(node.coords, linkedNode.coords);
            });
        });
    }

    /**
     *
     * @param {Object} from Where the link starts from
     * @param {int} from.x
     * @param {int} from.y
     * @param {Object} to Where the link goes
     * @param {int} to.x
     * @param {int} to.y
     * @param {boolean} partial Is the link dashed
     */
    static drawLink(from, to, partial = false) {
        if (partial) {
            ctx.setLineDash([10]);
        } else {
            ctx.setLineDash([0]);
        }

        ctx.lineWidth = 5;
        ctx.strokeStyle = colors.LIGHTGRAY;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    static link(node1, node2) {
        node1 = Node.find(node1);
        node2 = Node.find(node2);

        // IF LINK EXISTS, DELETE IT
        if (node1.linkedNodes.includes(node2.id) || node2.linkedNodes.includes(node1.id)) {
            node1.linkedNodes.splice(node1.linkedNodes.indexOf(node2.id), 1);
            node2.linkedNodes.splice(node2.linkedNodes.indexOf(node1.id), 1);
        } else {
            // ELSE, CREATE IT
            node1.linkedNodes.push(node2.id);
            node2.linkedNodes.push(node1.id);
        }
    }

    static drawAll() {
        this.drawAllLinks();
        this.allNodes.forEach((node) => {
            node.draw();
        });
    }

    static exportJSON() {
        download("nodes.json", JSON.stringify(this.allNodes));
    }
}
