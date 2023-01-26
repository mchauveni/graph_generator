import { ctx, colors } from "./config.js";
import { Node } from "./Node.js";
import { Link } from "./Link.js";
import { User } from "./User.js";

export class Canvas {
    static zoomFactor = 1;

    static zoom(zoom) {
        // IF TOO ZOOMED IN, CANCEL
        if (this.zoomFactor >= 2 && zoom >= 0) {
            return console.log("CANT ZOOM IN ANY FURTHER");
        } else if (this.zoomFactor <= 0.3 && zoom <= 0) {
            return console.log("CANT ZOOM OUT ANY FURTHER");
        }

        //Change zoom factor + round it to 2 int
        this.zoomFactor += zoom;
        this.zoomFactor = Math.round(this.zoomFactor * 100) / 100;

        ctx.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, 0, 0);
        console.log(this.zoomFactor);
        this.update();
    }

    static update() {
        /* Clear canvas */
        ctx.clearRect(0, 0, window.visualViewport.width * (1 / this.zoomFactor), window.visualViewport.height * (1 / this.zoomFactor));

        ctx.beginPath();
        ctx.fillStyle = "#eeeeee";
        ctx.rect(0, 0, window.visualViewport.width * (1 / this.zoomFactor), window.visualViewport.height * (1 / this.zoomFactor));
        ctx.fill();

        switch (User.mode) {
            case "default":
                Link.drawAll();
                Node.drawAll();
                break;
            case "newNode":
                Link.drawAll();
                Node.drawAll();
                Node.drawOutline(User.mousecoords);
                break;
            case "newLink":
                Link.drawAll();

                // Draw partial link from node1 to node2 if a node is selected and another hovered.
                // Draw partial link from node1 to cursor otherwise
                if (User.concernedNodes[0] != undefined && User.hoveredNode != -1) {
                    let color = colors.LIGHTGRAY;
                    let partial = true;

                    if (Node.find(User.hoveredNode).hasLink()) {
                        partial = false;
                        color = colors.RED;
                    }

                    Link.draw(Node.find(User.concernedNodes[0]).coords, Node.find(User.hoveredNode).coords, partial, color);

                } else if (User.concernedNodes[0] != undefined) {
                    Link.draw(Node.find(User.concernedNodes[0]).coords, User.mousecoords, true);
                }

                Node.drawAll();
                break;
        }
    }
}
