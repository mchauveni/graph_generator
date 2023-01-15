import { canvas, ctx, colors, shadeColor, download } from "./config.js";
import { Canvas } from "./Canvas.js";
import { User } from "./User.js";
import { Node } from "./Node.js";

/**
 * TODO :
 * - Make the nodes a JSON file we can save/import
 * - Draw links ONCE
 * - Move canvas
 * - Custom menu to edit bolls (https://itnext.io/how-to-create-a-custom-right-click-menu-with-javascript-9c368bb58724)
 */

new Node("Reginald", { x: 500, y: 200 }, [1, 2, 3]);
new Node("Jean", { x: 300, y: 200 }, [0, 3], colors.BLURPLE);
new Node("Henry", { x: 400, y: 300 }, [0], colors.YELLOW);
new Node("Patrick", { x: 200, y: 300 }, [1, 0], colors.GREEN);

try {
    Node.checkData();
} catch (e) {
    console.error(e);
}

Canvas.update();

// Resize canvas when resizing the page
window.addEventListener("resize", () => {
    canvas.width = window.visualViewport.width;
    canvas.height = window.visualViewport.height;
    Canvas.update();
});

// MOUSEDOWN ============================================================================================================================
canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    User.registerCoords(User.mousePos(e));
    User.mousedown = true;

    switch (User.mode) {
        case "default":
            // If user clicks on the selected node or canvas, deselect the current node
            // else select the node they clicked
            if (User.hoveredNode != -1 && e.button == 0) {
                User.setSelectedNode(User.hoveredNode);
            } else {
                User.setSelectedNode(-1);
            }
            break;
        case "newNode":
            new Node("", User.mousePos(e), []);
            break;
        case "newLink":
            if (User.hoveredNode == -1) {
                return;
            }
            if (User.concernedNodes.length == 0) {
                User.addConcernedNode(User.hoveredNode);
            } else {
                User.addConcernedNode(User.hoveredNode);
                Node.link(User.concernedNodes[0], User.concernedNodes[1]);
                User.removeConcernedNode(User.concernedNodes[1]);
                User.removeConcernedNode(User.concernedNodes[0]);
            }
            break;
    }
});

// MOUSEUP ============================================================================================================================
canvas.addEventListener("mouseup", (e) => {
    // If user dragged, then auto deselect the node
    if (User.mousedrag) {
        User.setSelectedNode(-1);
    }

    User.mousedown = false;
    User.mousedrag = false;
    Canvas.update();
});

// MOUSEMOVE ============================================================================================================================
canvas.addEventListener("mousemove", (e) => {
    if (User.mousedown) {
        // If user is clicking & moving, then they are dragging duh
        User.mousedrag = true;
    }

    User.mousecoords = User.mousePos(e);

    // Reset hovered node
    User.setHoveredNode(-1);

    // Checks hover
    Node.allNodes.forEach((node) => {
        if (ctx.isPointInPath(Node.defaultNodePath(node.coords), User.mousecoords.x, User.mousecoords.y)) {
            User.setHoveredNode(node.id);
        }
    });

    // Moves the selected node
    if (User.selectedNode != -1 && User.mousedown) {
        let node = Node.find(User.selectedNode);

        node.move({
            x: User.mousecoords.x + User.moveHandler.offsetCoords.x,
            y: User.mousecoords.y + User.moveHandler.offsetCoords.y,
        });
    }

    Canvas.update();

    // DEBUG FOR CURSOR POSITION
    let rect = canvas.getBoundingClientRect();
    let coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
    let fakePointer = new Path2D();
    fakePointer.arc(coords.x, coords.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill(fakePointer);

    coords = User.mousePos(e);
    let fakePointerBis = new Path2D();
    fakePointerBis.arc(coords.x, coords.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill(fakePointerBis);
});

// WHEEL (SCROLL) ============================================================================================================================
canvas.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
        //zoom out
        Canvas.zoom(-0.1);
    }
    if (e.deltaY < 0) {
        //zoom in
        Canvas.zoom(0.1);
    }
});
