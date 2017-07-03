const canvasCon = document.querySelector(".tracker");
const canvas = document.querySelector("canvas");
const tools = document.querySelectorAll(".tool-item");
var color = document.querySelector("input[type='color']");
var penSize = document.querySelector("input[type='range']");

//events for change color and size line or pen
color.addEventListener('input', strokeColor);
penSize.addEventListener('input', lineSize);

let arrEvents = [];
let hsl = 0;
let isDrawing = false;
let isDrawingFig = false;
let isDrawingPol = false;
let direction = true;
let ctx = canvas.getContext("2d");


canvas.width = canvasCon.offsetWidth;
canvas.height = canvasCon.offsetHeight;

ctx.strokeStyle = color.value;
ctx.lineWidth = penSize.value;

let lastX = 0;
let lastY = 0;

//setup line width

function lineSize() {
    ctx.lineWidth = penSize.value;
    document.querySelector("#lineSize").textContent = `Line size: ${penSize.value < 10 ? '0':''}${penSize.value}`;
}

// setup stroke color

function strokeColor() {
    ctx.strokeStyle = color.value;

}

//remove previous events 
function removeEvent(arrE, obj) {
    for (i = 0; i < arrE.length; i++) {
        obj.removeEventListener(arrE[i], arrE[i + 1]);
        arrE.shift();
        arrE.shift();
        console.log("no siema elo");
    }
    console.log("no siema", arrE);
}

function addEvent(arr, event, fn) {

    arr.push(event);
    arr.push(fn);

}

tools[0].addEventListener('click', drawLine);
tools[1].addEventListener('click', rectangle);
tools[2].addEventListener('click', drawRgbLine);
tools[3].addEventListener('click', square);
tools[4].addEventListener('click', circle);
tools[5].addEventListener('click', polyline);
tools[6].addEventListener('click', straightLine);
tools[7].addEventListener('click', changeColor);
tools[8].addEventListener('click', rgb);
tools[9].addEventListener('click', clear);
canvasCon.addEventListener('mousemove', showCoords);

//////show coordinates of mouse events\\\\\\
// when cursor is not on the canvas
//*******************************************************************\\
isOnOut();

function isOnOut(e) {
    isOn = false;
    x = 0;
    y = 0;
    coord = "X: " + x + ", Y: " + y
    document.getElementById("xy").innerHTML = coord;
}
//as a 
function showCoords(e) {

    let isOn = true;
    canvas.addEventListener('mouseout', isOnOut);
    let x = e.offsetX;
    let y = e.offsetY;
    let coord = "X: " + x + ", Y: " + y;

    document.getElementById("xy").innerHTML = coord;

}

//clear entire canvas
function clear(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// draw Line items[0]
//*******************************************************************\\

function drawLine(e) {
    removeEvent(arrEvents, canvas);
    canvas.addEventListener('mousemove', draw);
    addEvent(arrEvents, 'mousemove', draw);
    canvas.addEventListener('mousedown', drawDown);
    canvas.addEventListener('mouseup', drawUp);
    canvas.addEventListener('mouseout', drawOut);
}


function draw(e) {

    ctx.strokeStyle = color.value;
    ctx.lineWidth = penSize.value;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (!isDrawing) return;

    ctx.beginPath();
    //start from
    ctx.moveTo(lastX, lastY);
    //go to
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawDown(e) {

    isDrawing = true;

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawUp(e) {
    isDrawing = false;
}

function drawOut(e) {
    isDrawing = false;
    isDrawingFig = false;
}

// draw RGB Line items[0]
//*******************************************************************\\


function drawRgbLine(e) {
    removeEvent(arrEvents, canvas);
    canvas.addEventListener('mousemove', drawRgb);
    addEvent(arrEvents, 'mousemove', drawRgb);
    canvas.addEventListener('mousedown', drawDown);
    canvas.addEventListener('mouseup', drawUp);
    canvas.addEventListener('mouseout', drawOut);
}

function drawRgb(e) {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = `hsl(${hsl},100%,50%)`;
    if (!isDrawing) return;

    ctx.beginPath();
    //start from
    ctx.moveTo(lastX, lastY);
    //go to
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];

    hsl++;
    if (hsl > 360) {
        hsl = 0;
    }

    if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
        direction = !direction;
    }

    if (direction) {
        ctx.lineWidth++;
    } else {
        ctx.lineWidth--;
    }
}

// RGB effect on the canvas
//*******************************************************************\\

function rgb(e) {
    removeEvent(arrEvents, canvas);
    canvas.addEventListener('mousemove', rgbWork)
    addEvent(arrEvents, 'mousemove', rgbWork);

}

function rgbWork(e) {
    
    hsl++;
    canvas.style.backgroundColor = 'hsl(' + hsl + ', 100%, 39%)';
}

// draw straightLine on canvas
//*******************************************************************\\


let counter = 0;
let arrLine = [0, 0, 0, 0];

function straightLine(e) {
    
    removeEvent(arrEvents, canvas);
    canvas.addEventListener('mousemove', straightLineDraw);
    addEvent(arrEvents, 'mousemove', straightLineDraw);
    canvas.addEventListener('mousedown', getPosition);
    addEvent(arrEvents, 'mousedown', getPosition);
    canvas.addEventListener('mouseout', drawOut);
}

function straightLineDraw() {
    ctx.strokeStyle = color.value;
    ctx.lineWidth = penSize.value;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'miter';
    if (!isDrawingFig) return;

    if (counter % 2 === 0) {
        ctx.beginPath();
        ctx.moveTo(arrLine[0], arrLine[1]);

        ctx.lineTo(arrLine[2], arrLine[3]);
        ctx.stroke();
    }

}

function getPosition(e) {
    counter++;
    isDrawingFig = true;
    if (counter % 2 === 1) {
        arrLine[0] = e.offsetX;
        arrLine[1] = e.offsetY;
    } else {
        arrLine[2] = e.offsetX;
        arrLine[3] = e.offsetY;
    }

}

// draw rectangle 
//*******************************************************************\\



function rectangle(e) {
    removeEvent(arrEvents, canvas);
    canvas.addEventListener('mousemove', rectangleDraw);
    addEvent(arrEvents, 'mousemove', rectangleDraw);
    canvas.addEventListener('mousedown', getPosition);
    addEvent(arrEvents, 'mousedown', getPosition);
    canvas.addEventListener('mouseout', drawOut);
}


function rectangleDraw() {
    ctx.strokeStyle = color.value;
    ctx.lineWidth = penSize.value;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'miter';
    if (!isDrawingFig) return;

    if (counter % 2 === 0) {
        ctx.beginPath();
        ctx.rect(arrLine[0], arrLine[1], arrLine[2] - arrLine[0], arrLine[3] - arrLine[1]);
        ctx.stroke();
    }

}

// draw circle 
//*******************************************************************\\

function circle(e) {
    removeEvent(arrEvents, canvas);
    canvas.addEventListener('mousemove', circleDraw);
    addEvent(arrEvents, 'mousemove', circleDraw);
    canvas.addEventListener('mousedown', getPosition);
    addEvent(arrEvents, 'mousedown', getPosition);
    canvas.addEventListener('mouseout', drawOut);
}
var pitagoras = function (a, b) {
    return Math.floor(Math.sqrt(a * a + b * b));
}

function circleDraw() {
    var a = arrLine[0] - arrLine[2];
    var b = arrLine[1] - arrLine[3];
    ctx.strokeStyle = color.value;
    ctx.lineWidth = penSize.value;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'miter';
    if (!isDrawingFig) return;

    if (counter % 2 === 0) {
        ctx.beginPath();
        ctx.ellipse(arrLine[0], arrLine[1], pitagoras(a, b), pitagoras(a, b), 45 * Math.PI, 0, 2 * Math.PI);
        ctx.stroke();
    }

}


//draw square
//*******************************************************************\\

function square(e) {
    removeEvent(arrEvents, canvas);
    canvas.addEventListener('mousemove', squareDraw);
    addEvent(arrEvents, 'mousemove', squareDraw);
    canvas.addEventListener('mousedown', getPosition);
    addEvent(arrEvents, 'mousedown', getPosition);
    canvas.addEventListener('mouseout', drawOut);
}

function squareDraw() {
    ctx.strokeStyle = color.value;
    ctx.lineWidth = penSize.value;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'miter';
    if (!isDrawingFig) return;

    if (counter % 2 === 0) {
        ctx.beginPath();
        ctx.rect(arrLine[0], arrLine[1], arrLine[3] - arrLine[1], arrLine[3] - arrLine[1]);
        ctx.stroke();
    }
}

// draw polyline
//*******************************************************************\\

function polyline(e) {
   
    removeEvent(arrEvents, canvas);
    
    canvas.addEventListener('mousedown', getPositionPol);
    addEvent(arrEvents, 'mousedown', getPositionPol);
    canvas.addEventListener('mousemove', polylineDraw);
    addEvent(arrEvents, 'mousemove', polylineDraw);
    canvas.addEventListener('mouseout', drawOutPol);
    document.addEventListener('keyup', escapee);
    var k = 1;
}

var arrPol = [];
var d = -2;
var coun = 0;

function polylineDraw(e) {
    ctx.strokeStyle = color.value;
    ctx.lineWidth = penSize.value;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (!isDrawingPol) return;

    if (coun >= 2) {

        ctx.beginPath();
        ctx.moveTo(arrPol[d - 2], arrPol[d - 1]);
        ctx.lineTo(arrPol[d], arrPol[d + 1]);
        ctx.stroke();

    }

}

function getPositionPol(e) {
    coun++;
    d += 2;
    isDrawingPol = true;

    arrPol.push(e.offsetX);
    arrPol.push(e.offsetY);
    console.log(arrPol, coun, d);

}

function escapee(e) {
    var x = event.keyCode;
    if (x === 27) {
        coun = 0;
    }
}
function drawOutPol(e) {
    isDrawingPol = false;
    coun = 0;
}
//change canvas color
//*******************************************************************\\
var arrColor = [];

function changeColor(e){
    arrColor.push(color.value);
    removeEvent(arrEvents, canvas);
    color.addEventListener('input', changeColorWork)
}



function changeColorWork(e) {
    
    canvas.style.backgroundColor = color.value;
    color.value = arrColor.pop();
    color.removeEventListener('input', changeColorWork);
}

























