import { Canvas } from "./Canvas.js";
import { ctx, colors, shadeColor, download } from "./config.js";

export class Link {
    static allLinks = [];
    static lastLinkId = 0;

    /**
     *
     * @param {Node[]} nodes The 2 Nodes objects
     * @param {*} color
     * @param {*} width
     */
    constructor(nodes, color = colors.LIGHTGRAY, width = 5) {
        this.id = Link.lastLinkId;
        this.nodes = nodes;
        this.color = color;
        this.width = width;
        this.hovered = false;
        this.selected = false;

        Link.allLinks.push(this);
        Link.lastLinkId++;
    }

    static link(node1, node2) {
        if (this.findByNodes(node1, node2)) {
            this.findByNodes(node1, node2).delete();
        }
        new Link([node1, node2]);
    }

    /**
     * Search if a link between two nodes exists, or search every link of this node
     *
     * @param {int} node1 id of a node
     * @param {int} node2 id of a second node
     * @returns a link or array of links
     */
    static findByNodes(node1, node2 = null) {
        let foundLink;

        if (node2 != null) {
            foundLink = null;
        } else {
            foundLink = [];
        }

        this.allLinks.forEach((link) => {
            if (link.nodes.includes(node1) && node2 == null) {
                foundLink.push(link);
            } else if (link.nodes.includes(node1) && link.nodes.includes(node2)) {
                foundLink = link;
            }
        });

        return foundLink;
    }

    static findById(id) {
        let foundLink = null;
        this.allLinks.forEach((link) => {
            if ((link.id = id)) {
                foundLink = link;
            }
        });

        return foundLink;
    }

    delete() {
        Link.allLinks.splice(Link.allLinks.indexOf(this), 1);
        for (const property in this) {
            delete this[property];
        }
        Canvas.update();
    }

    /**
     * Draws every links registered
     */
    static drawAll() {
        //PROBLEM : EVERY LINKS DRAW TWICE
        this.allLinks.forEach((link) => {
            this.draw(link.nodes[0].coords, link.nodes[1].coords);
        });
    }

    /**
     * Draws one link between 2 coords
     *
     * @param {Object} from Where the link starts from
     * @param {int} from.x
     * @param {int} from.y
     * @param {Object} to Where the link goes
     * @param {int} to.x
     * @param {int} to.y
     * @param {boolean} partial Is the link dashed
     */
    static draw(from, to, partial = false) {
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
}
