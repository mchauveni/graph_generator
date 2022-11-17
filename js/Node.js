class Node {
    static allNodes = [];
    static links = [];

    /**
     * Constructor for a Node
     * @param {int} id ID of the node
     * @param {string} name name printed on the node
     * @param {Object} coords must be {x, y}
     * @param {int} coords.x
     * @param {int} coords.y
     * @param {int[]} linkedNodes ID of all linked nodes
     */
    constructor(id, name, coords, linkedNodes) {
        this.id = id;
        this.name = name;
        this.coords = coords;
        this.hovered = false;
        this.selected = false;
        this.linkedNodes = linkedNodes;

        Node.allNodes.push(this);
    }

    draw() {
        ctx.beginPath();

        if (this.hovered || this.selected) {
            ctx.fillStyle = RED;
        } else {
            ctx.fillStyle = BLUE;
        }

        // Draw circle
        ctx.arc(this.coords.x, this.coords.y, 50, 0, 2 * Math.PI);
        ctx.fill();

        // Write text
        ctx.fillStyle = "white";
        ctx.font = "12px Verdana";
        let nameOffsetX = ctx.measureText(this.name).width / 2;
        ctx.fillText(this.name, this.coords.x - nameOffsetX, this.coords.y + 6);

        // Make border
        if (this.selected) {
            ctx.strokeStyle = YELLOW;
        } else {
            ctx.strokeStyle = GREY;
        }
        ctx.beginPath();
        ctx.arc(this.coords.x, this.coords.y, 50, 0, 2 * Math.PI);
        ctx.stroke();
    }

    /**
     * @deprecated
     * @param {*} coords
     */
    move(coords) {
        this.coords = {
            x: coords.x,
            y: coords.y,
        };
    }

    static find(id) {
        let foundNode = null;
        Node.allNodes.forEach((node) => {
            if (node.id == id) {
                foundNode = node;
            }
        });
        return foundNode;
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

                //MAKE A GRADIENT
                var gradient = ctx.createLinearGradient(node.coords.x, node.coords.y, linkedNode.coords.x, linkedNode.coords.y);
                gradient.addColorStop(0, YELLOW);
                gradient.addColorStop(1, GREY);

                // Draw the "outline" of the link
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#a3d08c33";
                ctx.beginPath();
                ctx.moveTo(node.coords.x, node.coords.y);
                ctx.lineTo(linkedNode.coords.x, linkedNode.coords.y);
                ctx.stroke();

                // Draw the "actual" link
                ctx.lineWidth = 5;
                if (node.selected) {
                    ctx.strokeStyle = gradient;
                }
                ctx.beginPath();
                ctx.moveTo(node.coords.x, node.coords.y);
                ctx.lineTo(linkedNode.coords.x, linkedNode.coords.y);
                ctx.stroke();
            });
        });
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
