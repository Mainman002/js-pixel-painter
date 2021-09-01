import {initArray} from "../src/modules/array_tools.js";

const pixCanvasSize = {w:512, h:512};

// const init_array = new initArray;
// const push_array = new pushArray;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.style.top = `${canvas.height*.5}px`;
// canvas.style.left = `${canvas.width*.5}px`;
// canvas.style.top = `50%+100`;
let canvasPosition = canvas.getBoundingClientRect();

const pixCanvas = document.getElementById("pixCanvas");
const pixCtx = pixCanvas.getContext('2d');
pixCanvas.width = pixCanvasSize.w;
pixCanvas.height = pixCanvasSize.h;

let pixCanvasPosition = pixCanvas.getBoundingClientRect();

pixCanvas.style.top = `${pixCanvasPosition.top}px`;
pixCanvas.style.left = `${pixCanvasPosition.left}px`;

const gridCanvas = document.getElementById("gridCanvas");
const gridCtx = gridCanvas.getContext('2d');
gridCanvas.width = pixCanvasSize.w;
gridCanvas.height = pixCanvasSize.h;
gridCanvas.style.top = `${pixCanvasPosition.top}px`;
gridCanvas.style.left = `${pixCanvasPosition.left}px`;

const areaCanvas = document.getElementById("areaCanvas");
const areaCtx = areaCanvas.getContext('2d');
areaCanvas.width = pixCanvasSize.w;
areaCanvas.height = pixCanvasSize.h;
areaCanvas.style.top = `${pixCanvasPosition.top}px`;
areaCanvas.style.left = `${pixCanvasPosition.left}px`;

const uiCanvas = document.getElementById("uiCanvas");
const uiCtx = uiCanvas.getContext('2d');
uiCanvas.width = window.innerWidth;
uiCanvas.height = window.innerHeight;
uiCanvas.style.top = `${canvasPosition.top}px`;
uiCanvas.style.left = `${canvasPosition.left}px`;

const mouseCanvas = document.getElementById("mouseCanvas");
const mouseCtx = mouseCanvas.getContext('2d');
mouseCanvas.width = window.innerWidth;
mouseCanvas.height = window.innerHeight;
mouseCanvas.style.top = `${canvasPosition.top}px`;
mouseCanvas.style.left = `${canvasPosition.left}px`;

// Draw border rect around canvas
// drawBorder(0, 128, 512, 364);
// drawBorder(pixCanvas.style.left, pixCanvas.style.top, pixCanvas.width, pixCanvas.height);

// const mirror = document.getElementById('mirror');
// mirror.addEventListener('contextmenu', function (e) {
//     // let nCanvas = renderCanvas().canvas;
//     let dataURL = pixCanvas.toDataURL('image/png');
//     mirror.src = dataURL;
// });

// const button = document.getElementById('btn-download');
// button.addEventListener('click', function (e) {
//     // let nCanvas = renderCanvas().canvas;
//     let dataURL = pixCanvas.toDataURL('image/png');
//     button.href = dataURL;
// });

// Canvas dymensions
let WIDTH = 900;
let HEIGHT = 600;
let CANVAS_WIDTH = 900;
let CANVAS_HEIGHT = 600;
let PIX_CANVAS_WIDTH = pixCanvasSize.w;
let PIX_CANVAS_HEIGHT = pixCanvasSize.h;

const settings = {
    fpsVisible: true,
    showAreas: false,
    showGrid: false,
    showBrush: false,
    showBrushHover: false,
    graphicSmoothing: false,
    preserveAspect: false,
}

// Graphic sharpness
ctx.mozImageSmoothingEnabled = settings.graphicSmoothing;
ctx.msImageSmoothingEnabled = settings.graphicSmoothing;
ctx.imageSmoothingEnabled = settings.graphicSmoothing;
pixCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
pixCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
pixCtx.imageSmoothingEnabled = settings.graphicSmoothing;
gridCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
gridCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
gridCtx.imageSmoothingEnabled = settings.graphicSmoothing;
uiCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
uiCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
uiCtx.imageSmoothingEnabled = settings.graphicSmoothing;
mouseCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
mouseCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
mouseCtx.imageSmoothingEnabled = settings.graphicSmoothing;
areaCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
areaCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
areaCtx.imageSmoothingEnabled = settings.graphicSmoothing;

// Global Font Settings
const customFont = 'Orbitron'; // Verdana
ctx.font = `70px ${customFont}`;

// Global Variables
globalThis.times = [];
globalThis.fps = 0;


// cellSize:8 && areaSize:512 == 64px image when scaled down in a photo editor after exporting

// Variables
const areaItems = [];
const areaSize = pixCanvasSize.w*.25;
const areaGap = 3;
const cellSize = 8;
const cellGap = 3;

const areaGrid = [];
const gameGrid = [];
const pixels = [];
const buttons = [];

// Mouse Variables
const mouse = {
    x: 10,
    y: 10,
    width: .01,
    height: .01,
    clicked: false,
    lockDir: {x:false, y:false},
}

const pixMouse = {
    x: 10,
    y: 10,
    width: .01,
    height: .01,
    clicked: false,
    lockDir: {x:false, y:false},
}

const btnMouse = {
    x: 10,
    y: 10,
    width: .01,
    height: .01,
    clicked: false,
    lockDir: {x:false, y:false},
}

let activeColor = `rgb(255, 255, 255)`;
let activeOpacity = 1;
let showGrid = false;


window.addEventListener('resize', function(){
    CANVAS_HEIGHT = window.innerHeight;
    CANVAS_WIDTH = window.innerWidth;
    PIX_CANVAS_HEIGHT = window.innerHeight;
    PIX_CANVAS_WIDTH = window.innerWidth;
    
    if (settings.preserveAspect){

        let ratio = 16 / 9;
        if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio){
            CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
        } else {
            CANVAS_HEIGHT = CANVAS_WIDTH / ratio;
        }

        let pixRatio = 1 / 1;
        if (PIX_CANVAS_HEIGHT < PIX_CANVAS_WIDTH / pixRatio){
            PIX_CANVAS_WIDTH = PIX_CANVAS_HEIGHT * pixRatio;
        } else {
            PIX_CANVAS_HEIGHT = PIX_CANVAS_WIDTH / pixRatio;
        }
        
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        // canvas.style.height = `${CANVAS_HEIGHT}px`;
        // canvas.style.width = `${CANVAS_WIDTH}px`;

        uiCanvas.height = canvas.height;
        uiCanvas.width = canvas.width;
        uiCanvas.style.height = `${CANVAS_HEIGHT}px`;
        uiCanvas.style.width = `${CANVAS_WIDTH}px`;
        uiCanvas.style.top = `${canvasPosition.top}px`;
        uiCanvas.style.left = `${canvasPosition.left}px`;

        mouseCanvas.height = canvas.height;
        mouseCanvas.width = canvas.width;
        mouseCanvas.style.height = `${CANVAS_HEIGHT}px`;
        mouseCanvas.style.width = `${CANVAS_WIDTH}px`;
        mouseCanvas.style.top = `${canvasPosition.top}px`;
        mouseCanvas.style.left = `${canvasPosition.left}px`;



        pixCanvas.height = pixCanvasSize.h;
        pixCanvas.width = pixCanvasSize.w;
        pixCanvas.style.height = `${PIX_CANVAS_HEIGHT}px`;
        pixCanvas.style.width = `${PIX_CANVAS_WIDTH}px`;
        gridCanvas.style.top = `${canvasPosition.top}px`;
        gridCanvas.style.left = `${canvasPosition.left}px`;

        gridCanvas.height = pixCanvas.height;
        gridCanvas.width = pixCanvas.width;
        gridCanvas.style.height = `${PIX_CANVAS_HEIGHT}px`;
        gridCanvas.style.width = `${PIX_CANVAS_WIDTH}px`;
        gridCanvas.style.top = `${pixCanvasPosition.top}px`;
        gridCanvas.style.left = `${pixCanvasPosition.left}px`;

        areaCanvas.height = pixCanvas.height;
        areaCanvas.width = pixCanvas.width;
        areaCanvas.style.height = `${PIX_CANVAS_HEIGHT}px`;
        areaCanvas.style.width = `${PIX_CANVAS_WIDTH}px`;
        areaCanvas.style.top = `${pixCanvasPosition.top}px`;
        areaCanvas.style.left = `${pixCanvasPosition.left}px`;

        canvasPosition = canvas.getBoundingClientRect();
        pixCanvasPosition = pixCanvas.getBoundingClientRect();

    } else {


        let ratio = 16 / 9;
        if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio){
            CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
        } else {
            CANVAS_HEIGHT = CANVAS_WIDTH / ratio;
        }

        canvas.height = HEIGHT;
        canvas.width = WIDTH;
        pixCanvas.height = canvas.height;
        pixCanvas.width = canvas.width;
        gridCanvas.height = canvas.height;
        gridCanvas.width = canvas.width;
        uiCanvas.height = canvas.height;
        uiCanvas.width = canvas.width;
        mouseCanvas.height = canvas.height;
        mouseCanvas.width = canvas.width;

        canvas.style.height = `${CANVAS_HEIGHT}px`;
        canvas.style.width = `${CANVAS_WIDTH}px`;
        pixCanvas.style.height = `${CANVAS_HEIGHT}px`;
        pixCanvas.style.width = `${CANVAS_WIDTH}px`;
        gridCanvas.style.height = `${CANVAS_HEIGHT}px`;
        gridCanvas.style.width = `${CANVAS_WIDTH}px`;
        uiCanvas.style.height = `${CANVAS_HEIGHT}px`;
        uiCanvas.style.width = `${CANVAS_WIDTH}px`;
        mouseCanvas.style.height = `${CANVAS_HEIGHT}px`;
        mouseCanvas.style.width = `${CANVAS_WIDTH}px`;

        canvasPosition = canvas.getBoundingClientRect();

        pixCanvas.style.top = `${canvasPosition.top}px`;
        pixCanvas.style.left = `${canvasPosition.left}px`;
        gridCanvas.style.top = `${canvasPosition.top}px`;
        gridCanvas.style.left = `${canvasPosition.left}px`;
        uiCanvas.style.top = `${canvasPosition.top}px`;
        uiCanvas.style.left = `${canvasPosition.left}px`;
        mouseCanvas.style.top = `${canvasPosition.top}px`;
        mouseCanvas.style.left = `${canvasPosition.left}px`;

        }

    [...gameGrid].forEach(ob => ob.draw());
    toggleGrid();

});


// Mouse Move Event
canvas.addEventListener('mousemove', function(e){
    
    if (mouse.lockDir.x){
        mouse.x = undefined;
        pixMouse.x = undefined;
    } else {
        // Canvas Mouse
        mouse.x = e.pageX - canvasPosition.left - scrollX;
        mouse.x /= canvasPosition.width; 
        mouse.x *= canvas.width;
        mouse.x = mouse.x - mouse.width*.5;
        pixMouse.x = e.pageX - pixCanvasPosition.left - scrollX;
        pixMouse.x /= pixCanvasPosition.width; 
        pixMouse.x *= pixCanvas.width;
        pixMouse.x = pixMouse.x - pixMouse.width*.5;
    }
    
    
    if (mouse.lockDir.y){
        mouse.y = undefined;
        pixMouse.y = undefined;
    } else {
        mouse.y = e.pageY - canvasPosition.top - scrollY;
        mouse.y /= canvasPosition.height; 
        mouse.y *= canvas.height;
        mouse.y = mouse.y - mouse.height*.5;
        pixMouse.y = e.pageY - pixCanvasPosition.top - scrollY;
        pixMouse.y /= pixCanvasPosition.height; 
        pixMouse.y *= pixCanvas.height;
        pixMouse.y = pixMouse.y - pixMouse.height*.5;
    }
    
    
    btnMouse.x = e.pageX - canvasPosition.left - scrollX;
    btnMouse.y = e.pageY - canvasPosition.top - scrollY;
    
    // pixMouse.x = e.pageX - pixCanvasPosition.left - scrollX;
    // pixMouse.y = e.pageY - pixCanvasPosition.top - scrollY;

    // pixMouse.y = pixMouse.y - pixMouse.height*.5;
    // pixMouse.x = pixMouse.x - pixMouse.width*.5;

    // Can hit performance hard when brush size is > 100
    if (settings.showBrushHover) handleAreaGridHover();
});


// Mouse Leave Event
canvas.addEventListener('mouseleave', function(e){
    mouse.y = undefined;
    mouse.x = undefined;
    mouse.lockDir.x = false;
    mouse.lockDir.y = false;

    pixMouse.y = undefined;
    pixMouse.x = undefined;
    pixMouse.lockDir.x = false;
    pixMouse.lockDir.y = false;

    btnMouse.y = undefined;
    btnMouse.x = undefined;
    mouse.clicked = false;


});


// Mouse Down Event
canvas.addEventListener('mousedown', function(e){
    mouse.clicked = true;
});

canvas.addEventListener('mouseup', function(e){
    mouse.clicked = false;
});

canvas.addEventListener('wheel', function(e){
    mouse.width += -e.deltaY*.01;
    mouse.height += -e.deltaY*.01;

    if (mouse.width <= 0.01){
        mouse.width = 0.01;
        mouse.height = 0.01;
    }

    pixMouse.width = mouse.width;
    pixMouse.height = mouse.height;
});


window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "g":
            // showGrid = !showGrid;
            settings.showGrid = !settings.showGrid;
            toggleGrid();
            break;
        case "Enter":
            // pixCanvas.attributes("src", $)
            break;
        case "e":
            [...gameGrid].forEach(ob => ob.clear());
            break;
        case "[":
            if (mouse.width <= 0.01){
                mouse.width = 0.01;
                mouse.height = 0.01;
            } else {
                mouse.width += -0.5;
                mouse.height += -0.5;
            }
            pixMouse.width = mouse.width;
            pixMouse.height = mouse.height;
            break;
        case "]":
            mouse.width += 0.5;
            mouse.height += 0.5;
            pixMouse.width = mouse.width;
            pixMouse.height = mouse.height;
            break;
        case "m":
            settings.showBrush = !settings.showBrush;
            mouseCtx.clearRect(0, 0, mouseCanvas.width, mouseCanvas.height);
            break;
        case "s":
            saveImg();
            break;
        case "0":
            mouse.width = 100;
            mouse.height = 100;
            pixMouse.width = 100;
            pixMouse.height = 100;
            break;
        case "1":
            mouse.width = 0.01;
            mouse.height = 0.01;
            pixMouse.width = 0.01;
            pixMouse.height = 0.01;
            break;
        case "2":
            mouse.width = 200;
            mouse.height = 200;
            pixMouse.width = 200;
            pixMouse.height = 200;
            break;
        case "3":
            mouse.width = 300;
            mouse.height = 300;
            pixMouse.width = 300;
            pixMouse.height = 300;
            break;
        case "4":
            mouse.width = 400;
            mouse.height = 400;
            pixMouse.width = 400;
            pixMouse.height = 400;
            break;
        case "5":
            mouse.width = 500;
            mouse.height = 500;
            pixMouse.width = 500;
            pixMouse.height = 500;
            break;
        case "6":
            mouse.width = 600;
            mouse.height = 600;
            pixMouse.width = 600;
            pixMouse.height = 600;
            break;
        case "x":
            mouse.lockDir.x = true;
            break;
        case "y":
            mouse.lockDir.y = true;
            break;

    }
});

addEventListener('keyup', (e) => {
    switch (e.key){
        case "x":
            mouse.lockDir.x = false;
            break;
        case "y":
            mouse.lockDir.y = false;
            break;
    }
});


// grid Cell class
class Pixel {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.color = `rgb(0,0,0)`;
        this.opacity = 0;
        this.hovered = false;
    }

    // Reset opacity to 0
    clear(){
        this.opacity = 0;
        this.color = `rgb(0,0,0)`;
        pixCtx.clearRect(0,0,pixCanvas.width,pixCanvas.height);
    }

    // Pixel hover function
    hover() {
        uiCtx.clearRect(this.x, this.y, this.height, this.width);
        uiCtx.globalAlpha = 1;
        uiCtx.lineWidth = 1;
        uiCtx.strokeStyle = 'Teal';
        uiCtx.strokeRect(this.x, this.y, this.width, this.height);
    }

    paint(c, a){
        this.opacity = a;
        this.color = c;
    }

    erase(){
        pixCtx.clearRect(this.x, this.y, this.height, this.width)
        this.opacity = 0;
    }

    // Cell draw function
    draw(){
        pixCtx.globalAlpha = this.opacity;
        pixCtx.fillStyle = this.color;
        pixCtx.fillRect(this.x, this.y, this.width, this.height);

        if (settings.showBrushHover && this.hovered) this.hover;
    }
}


// create grid cells
function createGrid(){

    // for (let x = canvas.style.left; x < cellSize*2*4; x++){
    //     for (let y = canvas.style.top; y < cellSize*2*3; y++){
    //         drawRect(0+cellSize*x, 128+cellSize*y, cellSize, cellSize);

    for (let x = 0; x < pixCanvasPosition.width; x += cellSize){
        for (let y = 0; y < pixCanvasPosition.height; y += cellSize){
            gameGrid.push(new Pixel(x, y));
        }
    }
    // console.log("GameG: ", gameGrid.length);
}


// Cycle through grid array
// function handleGameGrid(){
//     [...gameGrid].forEach(ob => ob.draw());
// }


// Area class
class Area {
    constructor(x, y, name){
        this.x = x;
        this.y = y;
        this.width = areaSize;
        this.height = areaSize;
        this.name = name;
        this.pixels = [];
    }

    // Check area for pixels
    query(arr){
        for (let i = 0; i < gameGrid.length; i++){
            if (gameGrid[i] && (gameGrid[i].x >= this.x && gameGrid[i].x <= this.x+this.width && gameGrid[i].y >= this.y && gameGrid[i].y <= this.y+this.height) ){
                this.pixels.push(gameGrid[i]);
            }
        }
        return this.pixels;
    }

    hover(){
        if (mouse && collision(this, mouse)){
            const someP = [];
            this.pixels = this.query(someP);

            // uiCtx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i in this.pixels){
                if (collision(mouse, this.pixels[i])){
                    // uiCtx.clearRect(0, 0, canvas.width, canvas.height);
                    this.pixels[i].hover();
                }
            }
            this.pixels.length = 0;
        }
    }

    // Cell draw function
    update(){
        if (settings.showAreas) {
            areaCtx.globalAlpha = 1;
            areaCtx.strokeStyle = 'Black';
            areaCtx.lineWidth = 1;
            areaCtx.strokeRect(this.x, this.y, this.width, this.height);
        }

        if (mouse && pixMouse && collision(this, pixMouse)){
            const someP = [];
            this.pixels = this.query(someP);
            // console.log(this.pixels.length);

            for (let i in this.pixels){
                if (collision(this.pixels[i], pixMouse) && mouse.clicked){
                    if (activeOpacity === 0) {
                        this.pixels[i].erase();
                    } else {
                        this.pixels[i].paint(activeColor, activeOpacity);
                        this.pixels[i].draw();
                    }
                }
            }
            this.pixels.length = 0;
        }
    }
}


// create grid area
function createArea(){
    for (let x = 0; x < pixCanvasPosition.width; x += areaSize){
        for (let y = 0; y < pixCanvasPosition.height; y += areaSize){
            areaGrid.push(new Area(x, y, `Area_${y}`));
        }
    }
}


// Cycle through area array
function handleAreaGrid(){
    [...areaGrid].forEach(ob => ob.update());
}

// Cycle through area array
function handleAreaGridHover(){
    areaCtx.clearRect(0, 0, areaCanvas.width, areaCanvas.height);
    [...areaGrid].forEach(ob => ob.hover());
}


class Button {
    constructor(x, y, width, height, color, opacity){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this.opacity = opacity;
    }

    // Buttons draw function
    draw(){
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'Black';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        if (activeColor === this.color && activeOpacity === this.opacity) {
            uiCtx.globalAlpha = 1;
            uiCtx.lineWidth = 3;
            uiCtx.strokeStyle = 'Teal';
            uiCtx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    // Buttons update function
    update(){
        // Select color buttons
        if (btnMouse.x && btnMouse.y && collision(this,btnMouse)){
            if (mouse.clicked) {
                activeOpacity = this.opacity;
                activeColor = this.color;
                uiCtx.clearRect(0,0,canvas.width,canvas.height); 
            }
        }
    }
}

// Create buttons
function createBtns(){
    const btnOffset = 40;

    // White
    buttons.push(new Button(canvas.width-42,             20, 32, 32, {r:0, g:0, b:0}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20, 32, 32, {r:70, g:70, b:70}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20, 32, 32, {r:255, g:255, b:255}, 1 ));

    // Grey
    buttons.push(new Button(canvas.width-42,             20+btnOffset*1, 32, 32, {r:32, g:32, b:32}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*1, 32, 32, {r:100, g:100, b:100}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*1, 32, 32, {r:140, g:140, b:140}, 1 ));

    // Red
    buttons.push(new Button(canvas.width-42,             20+btnOffset*2, 32, 32, {r:55, g:0, b:0}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*2, 32, 32, {r:127, g:0, b:0}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*2, 32, 32, {r:255, g:0, b:0}, 1 ));

    // Orange
    buttons.push(new Button(canvas.width-42,             20+btnOffset*3, 32, 32, {r:148, g:26, b:28}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*3, 32, 32, {r:243, g:114, b:32}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*3, 32, 32, {r:255, g:163, b:26}, 1 ));

    // Yellow
    buttons.push(new Button(canvas.width-42,             20+btnOffset*4, 32, 32, {r:55, g:55, b:0}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*4, 32, 32, {r:127, g:127, b:0}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*4, 32, 32, {r:255, g:255, b:0}, 1 ));
    
    // Green
    buttons.push(new Button(canvas.width-42,             20+btnOffset*5, 32, 32, {r:0, g:55, b:0}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*5, 32, 32, {r:0, g:127, b:0}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*5, 32, 32, {r:0, g:255, b:0}, 1 ));

    // Teal
    buttons.push(new Button(canvas.width-42,             20+btnOffset*6, 32, 32, {r:0, g:55, b:55}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*6, 32, 32, {r:0, g:127, b:127}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*6, 32, 32, {r:0, g:255, b:255}, 1 ));

    // Blue
    buttons.push(new Button(canvas.width-42,             20+btnOffset*7, 32, 32, {r:0, g:0, b:55}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*7, 32, 32, {r:0, g:0, b:127}, 1 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*7, 32, 32, {r:0, g:0, b:255}, 1 ));

    // Eraser
    // buttons.push(new Button(canvas.width-42,             21+btnOffset*8, 32, 32, {r:0, g:0, b:0}, 0 ));
    // buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*8, 32, 32, {r:0, g:0, b:0}, 0 ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*8, 32, 32, {r:0, g:0, b:0}, 0 ));
}


// Draw buttons
function handleBtns() {
    [...buttons].forEach(ob => ob.draw());
    [...buttons].forEach(ob => ob.update());
}


function drawRect(x, y, w, h){
    gridCtx.globalAlpha = 1;
    ctx.lineWidth = 1;
    gridCtx.strokeStyle = 'Black';
    gridCtx.strokeRect(x, y, w, h);
}


function drawBorder(x, y, w, h){
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'Black';
    ctx.strokeRect(x, y, w, h);
}


function toggleGrid() {
    gridCtx.clearRect(0, 0, canvas.width, canvas.height);
    if (settings.showGrid) {

        // for (let x = cellSize; x < gridCanvas.height; x += cellSize){
        //     for (let y = 0; y < gridCanvas.width; y += cellSize){
        //         gameGrid.push(new Pixel(x, y));
        //     }

        for (let x = 0; x < pixCanvasPosition.width; x += cellSize){
            for (let y = 0; y < pixCanvasPosition.height; y += cellSize){
                // gameGrid.push(new Pixel(x, y));
                drawRect(x, y, cellSize, cellSize);
            }
        }

        // draw boxes
        // for (let x = canvas.style.left; x < cellSize*2*4; x++){
        //     for (let y = canvas.style.top; y < cellSize*2*3; y++){
        //         drawRect(0+cellSize*x, 128+cellSize*y, cellSize, cellSize);
        //     }
        // }
    }
}


// function renderCanvas() {
//     let one = document.getElementById("saveCanvas").getContext("bitmaprenderer");

//     let offscreen = new OffscreenCanvas(256, 256);
//     let gl = offscreen.getContext('webgl');

//     // Commit rendering to the first canvas
//     let bitmapOne = offscreen.transferToImageBitmap();
//     one.transferFromImageBitmap(bitmapOne);
//     return one;
// }


// Update game loop
function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // drawBorder(0, 128, 512, 384);
    drawBorder(0, 0, pixCanvasPosition.width, pixCanvasPosition.height);

    if (mouse.clicked) handleAreaGrid();
    handleBtns();

    const labelOffset = 32;
    drawLabel(`Brush Size:${Math.floor(mouse.width)}`, 'right', 'Teal', canvas.width-42-30*3, 0+labelOffset*1, 18);
    drawLabel(`Change Brush Size`, 'right', 'Teal',                     canvas.width-42-30*3, 0+labelOffset*2, 18);
    drawLabel(`[ ] or Mouse Wheel`, 'right', 'Teal',                    canvas.width-42-30*3, 0+labelOffset*3, 18);
    drawLabel(`Toggle Grid: G`, 'right', 'Teal',                        canvas.width-42-30*3, 0+labelOffset*4, 18);
    drawLabel(`Clear Canvas: E`, 'right', 'Teal',                       canvas.width-42-30*3, 0+labelOffset*5, 18);
    drawLabel(`Show Brush: M`, 'right', 'Teal',                         canvas.width-42-30*3, 0+labelOffset*6, 18);
    drawLabel(`Gradient Line: X or Y`, 'right', 'Teal',                 canvas.width-42-30*3, 0+labelOffset*7, 18);
    drawLabel(`Save Image: S`, 'right', 'Teal',                         canvas.width-42-30*3, 0+labelOffset*8, 18);

    // Show fps if settings fpsVisible is true
    if (settings?.fpsVisible){
        // FPS Background
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'Black';
        ctx.fillRect(25, canvas.height-80, 120, 70);

        // FPS Draw Text
        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'Gold';
        ctx.font = `25px ${customFont}`;
        ctx.fillText(`FPS:${fps}`, 32,canvas.height-35);

        ctx.globalAlpha = 1;
    }

    // Draw brush size
    // drawCStroke(mouse.x, mouse.y, mouse.width, mouse.height, 'teal');

    if (settings.showBrush) {
        mouseCtx.clearRect(0,0, mouseCanvas.width, mouseCanvas.height);
        mouseCtx.globalAlpha = 1;
        mouseCtx.lineWidth = 1;
        mouseCtx.strokeStyle = 'Teal';
        mouseCtx.strokeRect(mouse.x,mouse.y,pixMouse.width,pixMouse.height);
    }

     // FPS Calculation Debug
     window.requestAnimationFrame(() => {
        const now = performance.now();
        while (globalThis.times.length > 0 && globalThis.times[0] <= now - 1000) {
            globalThis.times.shift();
        }
        globalThis.times.push(now);
        globalThis.fps = globalThis.times.length;
    });
    
    requestAnimationFrame(update);
}


// Draw text label function
function drawLabel(text, align, color, x, y, size){
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.font = `${size}px ${customFont}`;
    ctx.fillText(`${text}`, x, y);
}


// Grid collision
function collision(first,second){
    if (!(
        first.x > second.x + second.width  ||
        first.x + first.width < second.x   ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y
    )) {
        return true;
    };
};


// Area grid
// function areaCollision(p, c){
//     const children = [];
//     children.push(c);
//     return children;
// };


// function arrayTest() {
//     const sampleArr = [];
//     const sampleLoc = {x:0, y:0};

//     // Initializes the initArray function
//     initArray(Pixel, {x:sampleLoc.x, y:sampleLoc.y}, {x:16, y:16}, sampleArr);

//     // Log sample array objects
//     console.log(sampleArr);

//     // Get colors of array objects
//     [...sampleArr].forEach(ob => {
//         console.log(ob.color);
//     });
// }


// Save Image Function
function saveImg(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'Pixels.png');
    let pixCanvas = document.getElementById('pixCanvas');
    let dataURL = pixCanvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}


// First run timer
setTimeout(e => {
    createArea();
    createGrid();
    createBtns()
    update();
    // arrayTest();
    console.log("Timeout");
}, 1000);


