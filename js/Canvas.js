class Canvas {
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

        /* Draw links and nodes */
        Node.drawAll();
    }
}
