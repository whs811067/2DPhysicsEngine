/**********************************************************************
 * Description, Credits, and Resources
 * Zooming and panning by resetting context transform each time displayed.
 * Viewing parameters are:
 *   xleftView: x coordinate of left side of view
 *   ytopView:  y coordinate of top side of view
 *   widthView:  width of view
 *   heightView: height of view
 * Used as follows before drawing:
 *   ctx.setTransform(1,0,0,1,0,0);
 *   ctx.scale(widthCanvas/widthView, heightCanvas/heightView);
 *   ctx.translate(-xleftView,-ytopView);
 * Chuck Anderson, 2012, with lots of help from examples by others on the net.
 *
 * Licensed under a Creative Commons Attribution-NonCommercial 4.0 International License.
 * See http://creativecommons.org/licenses/by-nc/4.0/
 * **********************************************************************/

var canvas, ctx, widthCanvas, heightCanvas;

// Zooming
var xleftView = 0;
var ytopView = 0;
var widthViewOriginal = 1.0;
var heightViewOriginal = 1.0;
var widthView = widthViewOriginal;
var heightView = heightViewOriginal;
var mouseDown = false;
var lastX = 0;
var lastY = 0;

window.addEventListener("load", init);


function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    widthCanvas = canvas.width;
    heightCanvas = canvas.height;

    canvas.addEventListener("dblclick", handleDblClick, false);
    canvas.addEventListener("mousedown", handleMouseDown, false);
    canvas.addEventListener("mousemove", handleMouseMove, false);
    canvas.addEventListener("mouseup", handleMouseUp, false);
    canvas.addEventListener("mousewheel", handleMouseWheel, false);
    canvas.addEventListener("DOMMouseScroll", handleMouseWheel, false);
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(widthCanvas / widthView, heightCanvas / heightView);
    ctx.translate(-xleftView, -ytopView);
    ctx.fillStyle = "blue";
    ctx.fillRect(0.1, 0.5, 0.1, 0.1);
    ctx.fillStyle = "red";
    ctx.fillRect(0.3, 0.2, 0.4, 0.2);
    ctx.fillStyle = "green";
    ctx.fill();
    requestAnimationFrame(draw);
}

function handleDblClick(event) {
    var X = event.clientX - this.offsetLeft - this.clientLeft + this.scrollLeft;
    var Y = event.clientY - this.offsetTop - this.clientTop + this.scrollTop;
    var x = (X / widthCanvas) * widthView + xleftView;
    var y = (Y / heightCanvas) * heightView + ytopView;

    var scale = event.shiftKey == 1 ? 1.5 : 0.5;
    widthView *= scale;
    heightView *= scale;

    xleftView = x - widthView / 2;
    ytopView = y - heightView / 2;
}

function handleMouseDown(event) {
    mouseDown = true;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
    var X = event.clientX - this.offsetLeft - this.clientLeft + this.scrollLeft;
    var Y = event.clientY - this.offsetTop - this.clientTop + this.scrollTop;

    if (mouseDown) {
        var dx = ((X - lastX) / widthCanvas) * widthView;
        var dy = ((Y - lastY) / heightCanvas) * heightView;
        xleftView -= dx;
        ytopView -= dy;
    }
    lastX = X;
    lastY = Y;
}

function handleMouseWheel(event) {
    var x = widthView / 2 + xleftView;
    var y = heightView / 2 + ytopView;

    var scale = event.wheelDelta < 0 || event.detail > 0 ? 1.1 : 0.9;
    widthView *= scale;
    heightView *= scale;

    xleftView = x - widthView / 2;
    ytopView = y - heightView / 2;
}


window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});