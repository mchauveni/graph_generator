/**
 * TODO :
 * - Make the nodes a JSON file we can save/import
 * - Fix move broken by zoom
 * - Draw links ONCE
 * - Move canvas
 */

let node1 = new Node(1, "Reginald", { x: 500, y: 200 }, [2, 3, 4]);
let node2 = new Node(2, "Jean", { x: 300, y: 200 }, [1, 4]);
let node3 = new Node(3, "Henry", { x: 400, y: 300 }, [1]);
let node4 = new Node(4, "Patrick", { x: 200, y: 300 }, [2, 1]);

try {
    Node.checkData();
} catch (e) {
    console.error(e);
}

CanvasHandler.update();

/* canvas shit */
window.addEventListener("resize", () => {
    canvas.width = window.visualViewport.width;
    canvas.height = window.visualViewport.height;
    CanvasHandler.update();
});

canvas.addEventListener("mousemove", (e) => {
    User.setHoveredNode(-1);
    let coords = mousePos(e);

    /* Checks hover only (i think) */
    Node.drawAllLinks();
    Node.allNodes.forEach((node) => {
        node.draw();
        if (ctx.isPointInPath(coords.x, coords.y)) {
            User.setHoveredNode(node.id);
        }
    });

    /* Moves the selected node */
    if (User.selectedNode != -1) {
        let node = Node.find(User.selectedNode);

        node.move({
            x: coords.x * (1 / CanvasHandler.zoomFactor) + User.moveHandler.offsetCoords.x,
            y: coords.y * (1 / CanvasHandler.zoomFactor) + User.moveHandler.offsetCoords.y,
        });
    }

    CanvasHandler.update();
});

canvas.addEventListener("mousedown", (e) => {
    User.registerCoords(mousePos(e));

    Node.allNodes.forEach((node) => {
        node.draw();
        if (ctx.isPointInPath(User.moveHandler.lastClickCoords.x, User.moveHandler.lastClickCoords.y)) {
            User.setSelectedNode(node.id);
        }
    });
    CanvasHandler.update();
});

canvas.addEventListener("mouseup", (e) => {
    User.setSelectedNode(-1);
    CanvasHandler.update();
});

canvas.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
        //zoom out
        CanvasHandler.zoom(-0.1);
    }
    if (e.deltaY < 0) {
        //zoom in
        CanvasHandler.zoom(0.1);
    }
});

savebtn.addEventListener("click", () => {
    Node.exportJSON();
});

function mousePos(mouse) {
    var rect = canvas.getBoundingClientRect();
    let coords = {
        x: mouse.clientX - rect.left,
        y: mouse.clientY - rect.top,
    };
    return coords;
}
