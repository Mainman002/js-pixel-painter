// Context
const pixCtx = pixCanvas.getContext("2d");
const gridCtx = gridCanvas.getContext("2d");
const areaCtx = areaCanvas.getContext("2d");
const uiCtx = uiCanvas.getContext("2d");
const mouseCtx = mouseCanvas.getContext("2d");
const saveCtx = saveCanvas.getContext("2d");

// Variables
const canvasSize = {w:256, h:256};
const areaItems = [];
const areaSize = 128;
const areaGap = 3;
const cellSize = 8;
const cellGap = 3;

const areaGrid = [];
const pixels = [];
const buttons = [];

let activeColor = `rgb(255, 255, 255)`;
let activeOpacity = 1;

// Global Font Settings
const customFont = 'Orbitron'; // Verdana
// ctx.font = `70px ${customFont}`;

// Global Variables
globalThis.times = [];
globalThis.fps = 0;

const mouse = {
    x: 10,
    y: 10,
    width: .01,
    height: .01,
    clicked: false,
    lockDir: {x:false, y:false},
}

const settings = {
    fpsVisible: true,
    showAreas: true,
    showGrid: false,
    showBrush: true,
    showBrushHover: false,
    graphicSmoothing: false,
    preserveAspect: false,
}

pixCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
pixCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
pixCtx.imageSmoothingEnabled = settings.graphicSmoothing;

gridCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
gridCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
gridCtx.imageSmoothingEnabled = settings.graphicSmoothing;

areaCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
areaCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
areaCtx.imageSmoothingEnabled = settings.graphicSmoothing;

mouseCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
mouseCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
mouseCtx.imageSmoothingEnabled = settings.graphicSmoothing;

saveCtx.mozImageSmoothingEnabled = settings.graphicSmoothing;
saveCtx.msImageSmoothingEnabled = settings.graphicSmoothing;
saveCtx.imageSmoothingEnabled = settings.graphicSmoothing;

let windowBounds = areaCanvas.getBoundingClientRect();

// Set size on initialize
size_canvas(canvasSize);


// Adjusts canvas and zoom
function size_canvas(_size){
    pixCanvas.width = canvasSize.w;
    pixCanvas.height = canvasSize.h;
    gridCanvas.width = canvasSize.w;
    gridCanvas.height = canvasSize.h;
    areaCanvas.width = canvasSize.w;
    areaCanvas.height = canvasSize.h;
    saveCanvas.width = canvasSize.w;
    saveCanvas.height = canvasSize.h;

    document.documentElement.style.setProperty('zoom', `${window.innerHeight * .0039}`);

    windowBounds = areaCanvas.getBoundingClientRect();

    reOffset();
}


window.addEventListener('resize', (e) => {
    // pixCtx.clearRect(0,0,mouseCanvas.width, mouseCanvas.height)
    size_canvas(canvasSize);
});


// variables holding the current canvas offset position
//    relative to the window
var offsetX,offsetY;

// a function to recalculate the canvas offsets
function reOffset(){
    let BB = pixCanvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;        
}


window.addEventListener('mousemove', (e) => {
    if (mouse.lockDir.x){
        mouse.x = undefined;
        // pixMouse.x = undefined;
    } else {
        let rect = pixCanvas.getBoundingClientRect(), root = document.documentElement;

        // mouse.x  = e.clientX - rect.top - root.scrollTop;
        // mouse.y  = e.clientY - rect.left - root.scrollLeft;

        // use offsetX & offsetY to get the correct mouse position

        reOffset()

        mouse.x = parseInt(e.clientX-offsetX-window.innerWidth*.25);
        mouse.y = parseInt(e.clientY-offsetY);

        // mouse.x = e.screenX;

        // Canvas Mouse
        // mouse.x = e.pageX - canvasPosition.left - scrollX;
        // mouse.x /= canvasPosition.width; 
        // mouse.x *= canvas.width;
        // mouse.x = mouse.x - mouse.width*.5;
        // pixMouse.x = e.pageX - pixCanvasPosition.left - scrollX;
        // pixMouse.x /= pixCanvasPosition.width; 
        // pixMouse.x *= pixCanvas.width;
        // pixMouse.x = pixMouse.x - pixMouse.width*.5;
    }
    
    
    if (mouse.lockDir.y){
        mouse.y = undefined;
        // pixMouse.y = undefined;
    } else {
        mouse.y = e.pageY - window.innerHeight * .0039;
        // mouse.y = e.pageY - canvasPosition.top - scrollY;
        // mouse.y /= canvasPosition.height; 
        // mouse.y *= canvas.height;
        // mouse.y = mouse.y - mouse.height*.5;
        // pixMouse.y = e.pageY - pixCanvasPosition.top - scrollY;
        // pixMouse.y /= pixCanvasPosition.height; 
        // pixMouse.y *= pixCanvas.height;
        // pixMouse.y = pixMouse.y - pixMouse.height*.5;
    }
    
    
    // btnMouse.x = e.pageX - canvasPosition.left - scrollX;
    // btnMouse.y = e.pageY - canvasPosition.top - scrollY;
    
    // pixMouse.x = e.pageX - pixCanvasPosition.left - scrollX;
    // pixMouse.y = e.pageY - pixCanvasPosition.top - scrollY;

    // pixMouse.y = pixMouse.y - pixMouse.height*.5;
    // pixMouse.x = pixMouse.x - pixMouse.width*.5;

    // Can hit performance hard when brush size is > 100
    if (settings.showBrushHover) handleAreaGridHover();

    console.log(`adjusted: ${mouse.x}`);
});


// Mouse Leave Event
window.addEventListener('mouseleave', function(e){
    mouse.y = undefined;
    mouse.x = undefined;
    mouse.lockDir.x = false;
    mouse.lockDir.y = false;

    // pixMouse.y = undefined;
    // pixMouse.x = undefined;
    // pixMouse.lockDir.x = false;
    // pixMouse.lockDir.y = false;

    // btnMouse.y = undefined;
    // btnMouse.x = undefined;
    mouse.clicked = false;


});


// Mouse Down Event
window.addEventListener('mousedown', function(e){
    mouse.clicked = true;
});

window.addEventListener('mouseup', function(e){
    mouse.clicked = false;
});

window.addEventListener('wheel', function(e){
    mouse.width += -e.deltaY*.01;
    mouse.height += -e.deltaY*.01;

    if (mouse.width <= 0.01){
        mouse.width = 0.01;
        mouse.height = 0.01;
    }

    // pixMouse.width = mouse.width;
    // pixMouse.height = mouse.height;
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
            [...pixels].forEach(ob => ob.clear());
            break;
        case "[":
            if (mouse.width <= 0.01){
                mouse.width = 0.01;
                mouse.height = 0.01;
            } else {
                mouse.width += -0.5;
                mouse.height += -0.5;
            }
            // pixMouse.width = mouse.width;
            // pixMouse.height = mouse.height;
            break;
        case "]":
            mouse.width += 0.5;
            mouse.height += 0.5;
            // pixMouse.width = mouse.width;
            // pixMouse.height = mouse.height;
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
            // pixMouse.width = 100;
            // pixMouse.height = 100;
            break;
        case "1":
            mouse.width = 0.01;
            mouse.height = 0.01;
            // pixMouse.width = 0.01;
            // pixMouse.height = 0.01;
            break;
        case "2":
            mouse.width = 200;
            mouse.height = 200;
            // pixMouse.width = 200;
            // pixMouse.height = 200;
            break;
        case "3":
            mouse.width = 300;
            mouse.height = 300;
            // pixMouse.width = 300;
            // pixMouse.height = 300;
            break;
        case "4":
            mouse.width = 400;
            mouse.height = 400;
            // pixMouse.width = 400;
            // pixMouse.height = 400;
            break;
        case "5":
            mouse.width = 500;
            mouse.height = 500;
            // pixMouse.width = 500;
            // pixMouse.height = 500;
            break;
        case "6":
            mouse.width = 600;
            mouse.height = 600;
            // pixMouse.width = 600;
            // pixMouse.height = 600;
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
        gridCtx.clearRect(this.x, this.y, this.height, this.width);
        gridCtx.globalAlpha = 1;
        gridCtx.lineWidth = 1;
        gridCtx.strokeStyle = 'Teal';
        gridCtx.strokeRect(this.x, this.y, this.width, this.height);
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
        pixCtx.globalAlpha = 1;

        // this.hover();

        // if (settings.showBrushHover && this.hovered) this.hover;
    }
}


// create grid cells
function createGrid(){
    for (let x = 0; x < pixCanvas.width; x += cellSize){
        for (let y = 0; y < pixCanvas.height; y += cellSize){
            pixels.push(new Pixel(x, y));
        }
    }
    // console.log("GameG: ", pixels.length);
    // saveImg();
}



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

    draw(){
        drawLineRect(areaCtx, `Orange`, this.x, this.y, this.w, this.h, 1)
    }

    // Check area for pixels
    query(arr){
        for (let i = 0; i < pixels.length; i++){
            if (pixels[i] && (pixels[i].x >= this.x && pixels[i].x <= this.x+this.width && pixels[i].y >= this.y && pixels[i].y <= this.y+this.height) ){
                this.pixels.push(pixels[i]);
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

        if (mouse && collision(this, mouse)){
            const someP = [];
            this.pixels = this.query(someP);
            // console.log(this.pixels.length);

            for (let i in this.pixels){
                if (collision(this.pixels[i], mouse) && mouse.clicked){
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
    for (let x = 0; x < pixCanvas.width; x += areaSize){
        for (let y = 0; y < pixCanvas.height; y += areaSize){
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
        uiCtx.globalAlpha = this.opacity;
        uiCtx.fillStyle = this.color;
        uiCtx.fillRect(this.x, this.y, this.width, this.height);

        uiCtx.globalAlpha = 1;
        uiCtx.strokeStyle = 'Black';
        uiCtx.lineWidth = 1;
        uiCtx.strokeRect(this.x, this.y, this.width, this.height);

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
        if (mouse.x && mouse.y && collision(this,mouse)){
            if (mouse.clicked) {
                activeOpacity = this.opacity;
                activeColor = this.color;
                uiCtx.clearRect(0,0,uiCanvas.width,uiCanvas.height); 
            }
        }
    }
}

// Create buttons
function createBtns(){
    const btnOffset = 40;

    // White
    buttons.push(new Button(uiCanvas.width-42,             20, 32, 32, {r:0, g:0, b:0}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20, 32, 32, {r:70, g:70, b:70}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20, 32, 32, {r:255, g:255, b:255}, 1 ));

    // Grey
    buttons.push(new Button(uiCanvas.width-42,             20+btnOffset*1, 32, 32, {r:32, g:32, b:32}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20+btnOffset*1, 32, 32, {r:100, g:100, b:100}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20+btnOffset*1, 32, 32, {r:140, g:140, b:140}, 1 ));

    // Red
    buttons.push(new Button(uiCanvas.width-42,             20+btnOffset*2, 32, 32, {r:55, g:0, b:0}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20+btnOffset*2, 32, 32, {r:127, g:0, b:0}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20+btnOffset*2, 32, 32, {r:255, g:0, b:0}, 1 ));

    // Orange
    buttons.push(new Button(uiCanvas.width-42,             20+btnOffset*3, 32, 32, {r:148, g:26, b:28}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20+btnOffset*3, 32, 32, {r:243, g:114, b:32}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20+btnOffset*3, 32, 32, {r:255, g:163, b:26}, 1 ));

    // Yellow
    buttons.push(new Button(uiCanvas.width-42,             20+btnOffset*4, 32, 32, {r:55, g:55, b:0}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20+btnOffset*4, 32, 32, {r:127, g:127, b:0}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20+btnOffset*4, 32, 32, {r:255, g:255, b:0}, 1 ));
    
    // Green
    buttons.push(new Button(uiCanvas.width-42,             20+btnOffset*5, 32, 32, {r:0, g:55, b:0}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20+btnOffset*5, 32, 32, {r:0, g:127, b:0}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20+btnOffset*5, 32, 32, {r:0, g:255, b:0}, 1 ));

    // Teal
    buttons.push(new Button(uiCanvas.width-42,             20+btnOffset*6, 32, 32, {r:0, g:55, b:55}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20+btnOffset*6, 32, 32, {r:0, g:127, b:127}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20+btnOffset*6, 32, 32, {r:0, g:255, b:255}, 1 ));

    // Blue
    buttons.push(new Button(uiCanvas.width-42,             20+btnOffset*7, 32, 32, {r:0, g:0, b:55}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20+btnOffset*7, 32, 32, {r:0, g:0, b:127}, 1 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20+btnOffset*7, 32, 32, {r:0, g:0, b:255}, 1 ));

    // Eraser
    // buttons.push(new Button(uiCanvas.width-42,             21+btnOffset*8, 32, 32, {r:0, g:0, b:0}, 0 ));
    // buttons.push(new Button(uiCanvas.width-42-btnOffset*1, 20+btnOffset*8, 32, 32, {r:0, g:0, b:0}, 0 ));
    buttons.push(new Button(uiCanvas.width-42-btnOffset*2, 20+btnOffset*8, 32, 32, {r:0, g:0, b:0}, 0 ));
}


// Draw buttons
function handleBtns() {
    [...buttons].forEach(ob => ob.draw());
    [...buttons].forEach(ob => ob.update());
}


function toggleGrid() {
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    if (settings.showGrid) {

        for (let x = 0; x < gridCanvas.width; x += cellSize){
            for (let y = 0; y < gridCanvas.height; y += cellSize){
                drawRect(gridCtx, x, y, cellSize, cellSize);
            }
        }
    }
}


function drawLineRect(_ctx, _color, x, y, w, h, lw){
    _ctx.globalAlpha = 1;

    // draw fill rectangle
    _ctx.fillStyle = `teal`;
    _ctx.fillRect(x,y,w,h);

    // Draw border stroke
    _ctx.strokeRect.style = _color;
    _ctx.lineWidth = lw;
    _ctx.strokeRect(x,y,w,h);
}


function drawRect(_ctx, x, y, w, h){
    _ctx.globalAlpha = 1;
    _ctx.lineWidth = 1;
    _ctx.strokeStyle = 'Black';
    _ctx.strokeRect(x, y, w, h);
}


function draw(){
    pixCtx.clearRect(0,0,mouseCanvas.width, mouseCanvas.height);

    // temp panel area visualizer
    // drawLineRect(uiCtx, `rgb(0, 55, 100)`, 0, 0, uiCanvas.width, uiCanvas.height, 3);

    // draw events for pixels
    [...pixels].forEach(ob => ob.draw());

    if (mouse.clicked) handleAreaGrid();

    handleBtns();

    // if (settings.showBrush) {
    //     mouseCtx.clearRect(0,0, mouseCanvas.width, mouseCanvas.height);
    //     mouseCtx.globalAlpha = 1;
    //     mouseCtx.lineWidth = 1;
    //     mouseCtx.strokeStyle = 'Teal';
    //     mouseCtx.strokeRect(mouse.x,mouse.y,mouse.w,mouse.h);
    // }

    areaCtx.clearRect(0,0, areaCanvas.width, areaCanvas.height);
    drawLineRect(areaCtx, `rgb(0, 55, 100)`, mouse.x, mouse.y, mouse.width, mouse.height, 1);

    update();
}


function update(){
    requestAnimationFrame(draw);
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


// Save Image Function
function saveImg(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'Pixels.png');

    saveCanvas.width = pixCanvas.width;
    saveCanvas.height = pixCanvas.height;

    saveCtx.drawImage(pixCanvas,0,0);

    let dataURL = saveCanvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}


// First run timer
setTimeout(e => {
    createArea();
    createGrid();
    createBtns();
    draw();
    // arrayTest();
    console.log("Timeout");
}, 1000);

