var canvas;
var context;
var graph;
var mousedownVertex;
var mouseupVertex;
var vertexWidth = 12;
var vertexHeight = 12;
var makingEdge = false;

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
	can.setAttribute("id", "canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

function addListeners() {
	canvas.addEventListener('mouseup', onMouseUp);
	canvas.addEventListener('mousedown', onMouseDown);
}

function onLoad() {
	graph = new Graph();
	canvas = createHiDPICanvas(500, 500);
	document.body.appendChild(canvas);
	context = document.getElementById("canvas").getContext("2d");
	addListeners();
}

function onMouseDown(event) {
	if (isVertexClicked(event)) {
		makingEdge = true;
	}
}

function onMouseUp(event) {
	if(!isVertexClicked(event)) {
		var pos = getMousePos(event);
		graph.addVertex(new Vertex({x: pos.x, y: pos.y}));
	} else if (isVertexClicked(event) && makingEdge) {
		makingEdge = false;
		graph.addEdge(new Edge({vertex1: mousedownVertex, vertex2: mouseupVertex}));
	}
	graph.draw(canvas, context);
}

function isVertexClicked(event) {
	var pos = getMousePos(event);
	var inVertex = false;
	for (x in graph.vertices) {
		inVertex = pos.x <= graph.vertices[x].pos.x + 2*vertexWidth &&
				   pos.x >= graph.vertices[x].pos.x - vertexWidth &&
				   pos.y <= graph.vertices[x].pos.y + 2*vertexHeight &&
				   pos.y >= graph.vertices[x].pos.y - vertexHeight;
		if (inVertex) {
			if (event.type == "mousedown") {
					mousedownVertex = graph.vertices[x];
				}
			if (event.type == "mouseup") {
				mouseupVertex = graph.vertices[x];
			}
			break;
		}
	}
	return inVertex;
}

function getMousePos(event) {
	var rect = canvas.getBoundingClientRect();
	var x = (event.clientX - rect.left)/(rect.right - rect.left)*canvas.width;
	var y = (event.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height;
	return { x: x, y: y}
}

window.onload = onLoad;