/**
 * TODO :
 * - Make the nodes a JSON file we can save/import
 * - Fix move broken by zoom
 * - Draw links ONCE
 * - Move canvas
 * - Custom menu to edit bolls (https://itnext.io/how-to-create-a-custom-right-click-menu-with-javascript-9c368bb58724)
 */

let node1 = new Node(1, "Reginald", { x: 500, y: 200 }, [2, 3, 4]);
let node2 = new Node(2, "Jean", { x: 300, y: 200 }, [1, 4], LIGHTBLUE);
let node3 = new Node(3, "Henry", { x: 400, y: 300 }, [1], YELLOW);
let node4 = new Node(4, "Patrick", { x: 200, y: 300 }, [2, 1], GREEN);

try {
    Node.checkData();
} catch (e) {
    console.error(e);
}

CanvasHandler.update();

// Resize canvas when resizing the page
window.addEventListener("resize", () => {
    canvas.width = window.visualViewport.width;
    canvas.height = window.visualViewport.height;
    CanvasHandler.update();
});

// MOUSEDOWN ============================================================================================================================
canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    User.registerCoords(User.mousePos(e));
    User.mousedown = true;

    // If user clicks on the selected node or canvas, deselect the current node
    // else select the node they clicked
    if (User.hoveredNode != -1 && e.button == 0) {
        User.setSelectedNode(User.hoveredNode);
    } else {
        User.setSelectedNode(-1);
    }

    CanvasHandler.update();
});

// MOUSEUP ============================================================================================================================
canvas.addEventListener("mouseup", (e) => {
    // If user dragged, then auto deselect the node
    if (User.mousedrag) {
        User.setSelectedNode(-1);
    }

    User.mousedown = false;
    User.mousedrag = false;
    CanvasHandler.update();
});

// MOUSEMOVE ============================================================================================================================
canvas.addEventListener("mousemove", (e) => {
    if (User.mousedown) {
        // If user is clicking & moving, then they are dragging duh
        User.mousedrag = true;
    }

    //Reset hovered node
    User.setHoveredNode(-1);
    let coords = User.mousePos(e);

    /* Checks hover */
    Node.drawAllLinks();
    Node.allNodes.forEach((node) => {
        node.draw();
        if (ctx.isPointInPath(coords.x, coords.y)) {
            User.setHoveredNode(node.id);
        }
    });

    /* Moves the selected node */
    if (User.selectedNode != -1 && User.mousedown) {
        let node = Node.find(User.selectedNode);

        node.move({
            x: coords.x * (1 / CanvasHandler.zoomFactor) + User.moveHandler.offsetCoords.x,
            y: coords.y * (1 / CanvasHandler.zoomFactor) + User.moveHandler.offsetCoords.y,
        });
    }

    CanvasHandler.update();
});

// WHEEL (SCROLL) ============================================================================================================================
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

// CLICK ON SAVE BUTTON ============================================================================================================================
savebtn.addEventListener("click", () => {
    Node.exportJSON();
});
