class User {
    static selectedNode = -1;
    static hoveredNode = -1;
    static mousedown = false;
    static mousedrag = false;

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
        this.selectedNode = id;
        Node.allNodes.forEach((node) => {
            node.selected = false;
        });

        if (id != -1) {
            Node.find(id).selected = true;

            // When selecting a Node, calculate offset from center of the node to cursor location
            // Useful only for the node not to blink to cursor if not centered properly
            this.moveHandler.offsetCoords = {
                x: Node.find(id).coords.x * Canvas.zoomFactor - this.moveHandler.lastClickCoords.x,
                y: Node.find(id).coords.y * Canvas.zoomFactor - this.moveHandler.lastClickCoords.y,
            };

            // Puts the node at the end of the Compnode.allNodes array
            // So it overlap the other nodes (latest used is latest drawn)
            // (invert the current node and the last)
            let nodeIndex = Node.allNodes.indexOf(Node.find(id));
            if (nodeIndex < Node.allNodes.length - 1) {
                Node.allNodes.push(Node.allNodes.splice(nodeIndex, 1)[0]);
            }
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

    static registerCoords(coords) {
        this.moveHandler.lastClickCoords = {
            x: coords.x,
            y: coords.y,
        };
    }

    static mousePos(mouse) {
        var rect = canvas.getBoundingClientRect();
        let coords = {
            x: mouse.clientX - rect.left,
            y: mouse.clientY - rect.top,
        };
        return coords;
    }
}
