class User {
    static selectedNode = -1;
    static hoveredNode = -1;
    static clickedNode = -1;
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
                x: Node.find(id).coords.x * CanvasHandler.zoomFactor - this.moveHandler.lastClickCoords.x,
                y: Node.find(id).coords.y * CanvasHandler.zoomFactor - this.moveHandler.lastClickCoords.y,
            };

            // Puts the node at the end of the Compnode.allNodes array
            // So it overlap the other nodes (latest used is latest drawn)
            let nodeIndex = Node.allNodes.indexOf(Node.find(id));
            if (nodeIndex < Node.allNodes.length - 1) {
                let temp = Node.allNodes[Node.allNodes.length - 1];
                Node.allNodes[Node.allNodes.length - 1] = Node.allNodes[nodeIndex];
                Node.allNodes[nodeIndex] = temp;
            }
        }

        CanvasHandler.update();
    }

    static setHoveredNode(id) {
        this.hoveredNode = id;
        Node.allNodes.forEach((node) => {
            node.hovered = false;
        });

        if (id != -1) {
            Node.find(id).hovered = true;
        }

        CanvasHandler.update();
    }

    static registerCoords(coords) {
        this.moveHandler.lastClickCoords = {
            x: coords.x,
            y: coords.y,
        };
    }
}
