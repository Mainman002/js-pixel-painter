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
pixCanvas.width = 512;
pixCanvas.height = 512;
pixCanvas.style.top = `${canvasPosition.top}px`;
pixCanvas.style.left = `${canvasPosition.left}px`;

const gridCanvas = document.getElementById("gridCanvas");
const gridCtx = gridCanvas.getContext('2d');
gridCanvas.width = 512;
gridCanvas.height = 512;
gridCanvas.style.top = `${canvasPosition.top}px`;
gridCanvas.style.left = `${canvasPosition.left}px`;

const uiCanvas = document.getElementById("uiCanvas");
const uiCtx = uiCanvas.getContext('2d');
uiCanvas.width = window.innerWidth;
uiCanvas.height = window.innerHeight;
uiCanvas.style.top = `${canvasPosition.top}px`;
uiCanvas.style.left = `${canvasPosition.left}px`;

// const notifyCanvas = document.getElementById("notifyCanvas");
// const notifyCtx = notifyCanvas.getContext('2d');
// notifyCanvas.width = window.innerWidth;
// notifyCanvas.height = window.innerHeight;
// notifyCanvas.style.top = `${canvasPosition.top}px`;
// notifyCanvas.style.left = `${canvasPosition.left}px`;

drawBorder(0, 128, 512, 364);

const mirror = document.getElementById('mirror');
mirror.addEventListener('contextmenu', function (e) {
    // let nCanvas = renderCanvas().canvas;
    let dataURL = pixCanvas.toDataURL('image/png');
    mirror.src = dataURL;
});

const button = document.getElementById('btn-download');
button.addEventListener('click', function (e) {
    // let nCanvas = renderCanvas().canvas;
    let dataURL = pixCanvas.toDataURL('image/png');
    button.href = dataURL;
});

// Canvas dymensions
let WIDTH = 900;
let HEIGHT = 600;
let CANVAS_WIDTH = 900;
let CANVAS_HEIGHT = 600;

const cheats = {
    godMode: false,
    slowMotion: false,
    insaneMode: false,
    infinitePower: false,
    highHP: false,
    speedShoot: false,
    powerShoot: false,
    fpsVisible:true,
    graphicSmoothing: false,
    preserveAspect: false,
    gameOver: false,
    instaWin: false,
}

// Graphic sharpness
ctx.mozImageSmoothingEnabled = cheats.graphicSmoothing;
ctx.msImageSmoothingEnabled = cheats.graphicSmoothing;
ctx.imageSmoothingEnabled = cheats.graphicSmoothing;
pixCtx.mozImageSmoothingEnabled = cheats.graphicSmoothing;
pixCtx.msImageSmoothingEnabled = cheats.graphicSmoothing;
pixCtx.imageSmoothingEnabled = cheats.graphicSmoothing;
gridCtx.mozImageSmoothingEnabled = cheats.graphicSmoothing;
gridCtx.msImageSmoothingEnabled = cheats.graphicSmoothing;
gridCtx.imageSmoothingEnabled = cheats.graphicSmoothing;
uiCtx.mozImageSmoothingEnabled = cheats.graphicSmoothing;
uiCtx.msImageSmoothingEnabled = cheats.graphicSmoothing;
uiCtx.imageSmoothingEnabled = cheats.graphicSmoothing;

const customFont = 'Orbitron'; // Verdana
ctx.font = `70px ${customFont}`;

// Global Variables
globalThis.times = [];
globalThis.fps = 0;

// Variables
const areaItems = [];
const areaSize = 128;
const areaGap = 3;
const cellSize = 8;
const cellGap = 3;

const areaGrid = [];
const gameGrid = [];
const pixels = [];
const buttons = [];

// const controlBar = {
//     width: canvas.width,
//     height:cellSize,
// }

// Mouse Variables
const mouse = {
    x: 10,
    y: 10,
    width: .03,
    height: .03,
    clicked: false,
}

const btnMouse = {
    x: 10,
    y: 10,
    width: .03,
    height: .03,
    clicked: false,
}

let activeColor = `rgba(255, 255, 255, 1)`;
let clickTimer = 1;
let canClick = false;
let showGrid = false;


window.addEventListener('resize', function(){
    CANVAS_HEIGHT = window.innerHeight;
    CANVAS_WIDTH = window.innerWidth;

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
    // notifyCanvas.height = canvas.height;
    // notifyCanvas.width = canvas.width;

    canvas.style.height = `${CANVAS_HEIGHT}px`;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    pixCanvas.style.height = `${CANVAS_HEIGHT}px`;
    pixCanvas.style.width = `${CANVAS_WIDTH}px`;
    gridCanvas.style.height = `${CANVAS_HEIGHT}px`;
    gridCanvas.style.width = `${CANVAS_WIDTH}px`;
    uiCanvas.style.height = `${CANVAS_HEIGHT}px`;
    uiCanvas.style.width = `${CANVAS_WIDTH}px`;
    // notifyCanvas.style.height = `${CANVAS_HEIGHT}px`;
    // notifyCanvas.style.width = `${CANVAS_WIDTH}px`;

    canvasPosition = canvas.getBoundingClientRect();

    pixCanvas.style.top = `${canvasPosition.top}px`;
    pixCanvas.style.left = `${canvasPosition.left}px`;
    gridCanvas.style.top = `${canvasPosition.top}px`;
    gridCanvas.style.left = `${canvasPosition.left}px`;
    uiCanvas.style.top = `${canvasPosition.top}px`;
    uiCanvas.style.left = `${canvasPosition.left}px`;
    // notifyCanvas.style.top = `${canvasPosition.top}px`;
    // notifyCanvas.style.left = `${canvasPosition.left}px`;

    [...gameGrid].forEach(ob => ob.draw());
    toggleGrid();

});


// Mouse Move Event
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.pageX - canvasPosition.left - scrollX;
    mouse.y = e.pageY - canvasPosition.top - scrollY;

    mouse.x /= canvasPosition.width; 
    mouse.y /= canvasPosition.height; 

    mouse.x *= canvas.width;
    mouse.y *= canvas.height;

    btnMouse.y = mouse.y;
    btnMouse.x = mouse.x;

    mouse.y = mouse.y - mouse.height*.5;
    mouse.x = mouse.x - mouse.width*.5;

    // pixCtx.clearRect(mouse.x, mouse.y, mouse.height, mouse.width);
    // if (mouse.clicked) handleAreaGrid();
    // handleGameGrid();
});


// Mouse Leave Event
canvas.addEventListener('mouseleave', function(e){
    mouse.y = undefined;
    mouse.x = undefined;

    btnMouse.y = undefined;
    btnMouse.x = undefined;
    mouse.clicked = false;
});


// Mouse Down Event
canvas.addEventListener('mousedown', function(e){
    // activeColor = `rgba(${Math.random() * 25 + 50}, ${Math.random() * 25 + 50}, ${Math.random() * 25 + 50, 1})`;
    mouse.clicked = true;
});

canvas.addEventListener('mouseup', function(e){
    mouse.clicked = false;
    // pixCtx.clearRect(0, 0, pixCanvas.width, pixCanvas.height);
    // handleAreaGrid();
});

canvas.addEventListener('wheel', function(e){
    // mouse.width += e;
    // mouse.height += e;
    mouse.width += -e.deltaY*.01;
    mouse.height += -e.deltaY*.01;

    if (mouse.width <= 0.01){
        mouse.width = 0.01;
        mouse.height = 0.01;
    }

    console.log(mouse.height);
});


window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "g":
            showGrid = !showGrid;
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
            break;
        case "]":
            mouse.width += 0.5;
            mouse.height += 0.5;
            break;
    }
});


// grid Cell class
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.sprite = {'w':256, 'h':256};
        this.color = `rgba(0,0,0,0)`;
        // this.image = floorImage;
        // this.image.src = floorImage.src;
        this.maxFrame = 6;
        this.frame = Math.floor(Math.random() * this.maxFrame);
    }

    // Reset opacity to 0
    clear(){
        this.color = `rgba(0,0,0,0)`;
        pixCtx.clearRect(0,0,pixCanvas.width,pixCanvas.height);
    }

    // Cell draw function
    draw(){
        pixCtx.globalAlpha = this.color.a;
        pixCtx.fillStyle = this.color;
        pixCtx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.drawImage(this.image, this.frame*this.sprite.w, 0, this.sprite.w, this.sprite.h, this.x, this.y, this.width, this.height);

        // uiCtx.clearRect(0,0,canvas.width,canvas.height);
        // uiCtx.globalAlpha = 1;
        // uiCtx.lineWidth = 1;
        // uiCtx.strokeStyle = 'Teal';
        // uiCtx.strokeRect(this.x, this.y, this.width, this.height);

        if (mouse && collision(this,mouse)){
            // uiCtx.globalAlpha = 1;
            // uiCtx.lineWidth = 1;
            // uiCtx.strokeStyle = 'Teal';
            // uiCtx.strokeRect(this.x, this.y, this.width, this.height);

            // Draw pixels
            if (mouse.clicked) {
                this.color = activeColor;
            }
        }
    }
}


// create grid cells
function createGrid(){
    for (let y = cellSize; y < pixCanvas.height; y += cellSize){
        for (let x = 0; x < pixCanvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}


// Cycle through grid array
function handleGameGrid(){
    // pixCtx.clearRect(0, 0, pixCanvas.width, pixCanvas.height);
    [...gameGrid].forEach(ob => ob.draw());
    // for (let i = 0; i < gameGrid.length; i++){
    //     gameGrid[i].draw();
    // }
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
        // this.sprite = {'w':256, 'h':256};
        // this.color = `rgba(0,0,0,0)`;
        // this.image = floorImage;
        // this.image.src = floorImage.src;
        // this.maxFrame = 6;
        // this.frame = Math.floor(Math.random() * this.maxFrame);
    }

    // Cell draw function
    update(){
        // pixCtx.clearRect(this.x, this.y, this.height, this.width);
        // ctx.globalAlpha = 1;
        // ctx.strokeStyle = 'Black';
        // ctx.lineWidth = 1;
        // ctx.strokeRect(this.x, this.y, this.width, this.height);

        if (mouse && collision(this,mouse)){
            // areaItems.length = 0;

            // Show grid in this area
            // if (showGrid){
            //     gridCtx.clearRect(this.x, this.y, this.width, this.height);
            //     for (let x = 0; x < cellSize*2; x++){
            //         for (let y = 0; y < cellSize*2; y++){
            //             drawLine(this.x+cellSize*x, this.y+cellSize*y, cellSize, cellSize);
            //         }
            //     } 
            // }

            // Update pixels in this area
            for (let i = 0; i < gameGrid.length; i++){
                if (gameGrid[i] && (gameGrid[i].x >= this.x && gameGrid[i].x <= this.x+this.width && gameGrid[i].y >= this.y && gameGrid[i].y <= this.y+this.height) ){
                    // areaItems.push(gameGrid[i]);
                    // uiCtx.clearRect(0,0,canvas.width, canvas.height);
                    pixCtx.clearRect(gameGrid[i].x, gameGrid[i].y, gameGrid[i].height, gameGrid[i].width);
                    gameGrid[i].draw();
                }
            }

            // for (let i = 0; i < areaItems.length; i++){
            //     if (areaItems[i] && (areaItems[i].x >= this.x && areaItems[i].x <= this.x+this.width && areaItems[i].y >= this.y && areaItems[i].y <= this.y+this.height) ){
            //         pixCtx.clearRect(areaItems[i].x, areaItems[i].y, areaItems[i].height, areaItems[i].width);
            //         areaItems[i].draw();
            //     }
            // }
        }
    }
}


// create grid area
function createArea(){
    for (let y = areaSize; y < pixCanvas.height; y += areaSize){
        for (let x = 0; x < pixCanvas.width; x += areaSize){
            areaGrid.push(new Area(x, y, `Area_${y}`));
        }
    }
}


// Cycle through area array
function handleAreaGrid(){
    // pixCtx.clearRect(mouse.x, mouse.y, mouse.height, mouse.width);
    // pixCtx.clearRect(0, 0, pixCanvas.width, pixCanvas.height);
    [...areaGrid].forEach(ob => ob.update());
    // for (let i = 0; i < gameGrid.length; i++){
    //     gameGrid[i].draw();
    // }
}


// class ButtonSelected {
//     constructor(x, y, width, height, color){
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//         this.color = 'Teal';
//     }

//     // Buttons draw function
//     draw(){
//         ctx.globalAlpha = 1;
//         ctx.strokeStyle = 'Teal';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(this.x, this.y, this.width, this.height);
//     }
// }


class Button {
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        // this.activeSelection = false;
    }

    // Buttons draw function
    draw(){
        ctx.globalAlpha = this.color.a;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'Black';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        if (activeColor === this.color) {
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
                activeColor = this.color;
                uiCtx.clearRect(0,0,canvas.width,canvas.height);
                // [...buttons].forEach(btn => btn.activeSelection = false);
                // this.activeSelection = true;
            }
        }
    }
}

// Create buttons
function createBtns(){
    const btnOffset = 40;

    // White
    buttons.push(new Button(canvas.width-42,             20, 32, 32, {r:0, g:0, b:0, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20, 32, 32, {r:127, g:127, b:127, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20, 32, 32, {r:255, g:255, b:255, a:1} ));

    // Red
    buttons.push(new Button(canvas.width-42,             20+btnOffset*1, 32, 32, {r:55, g:0, b:0, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*1, 32, 32, {r:127, g:0, b:0, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*1, 32, 32, {r:255, g:0, b:0, a:1} ));

    // Yellow
    buttons.push(new Button(canvas.width-42,             20+btnOffset*2, 32, 32, {r:55, g:55, b:0, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*2, 32, 32, {r:127, g:127, b:0, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*2, 32, 32, {r:255, g:255, b:0, a:1} ));
    
    // Green
    buttons.push(new Button(canvas.width-42,             20+btnOffset*3, 32, 32, {r:0, g:55, b:0, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*3, 32, 32, {r:0, g:127, b:0, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*3, 32, 32, {r:0, g:255, b:0, a:1} ));

    // Teal
    buttons.push(new Button(canvas.width-42,             20+btnOffset*4, 32, 32, {r:0, g:55, b:55, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*4, 32, 32, {r:0, g:127, b:127, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*4, 32, 32, {r:0, g:255, b:255, a:1} ));

    // Blue
    buttons.push(new Button(canvas.width-42,             20+btnOffset*5, 32, 32, {r:0, g:0, b:55, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*5, 32, 32, {r:0, g:0, b:127, a:1} ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*5, 32, 32, {r:0, g:0, b:255, a:1} ));

    // Eraser
    buttons.push(new Button(canvas.width-42,             21+btnOffset*6, 32, 32, {r:0, g:0, b:0, a:0} ));
    buttons.push(new Button(canvas.width-42-btnOffset*1, 20+btnOffset*6, 32, 32, {r:0, g:0, b:0, a:0} ));
    buttons.push(new Button(canvas.width-42-btnOffset*2, 20+btnOffset*6, 32, 32, {r:0, g:0, b:0, a:0} ));
}


// const btnSelector = new ButtonSelected(64,64,32,32,'Teal');


// Draw buttons
function handleBtns() {
    [...buttons].forEach(ob => ob.draw());
    [...buttons].forEach(ob => ob.update());
}


function drawLine(sx, sy, ex, ey){
    gridCtx.globalAlpha = 1;
    gridCtx.strokeStyle = 'Black';
    gridCtx.lineWidth = 1;

    gridCtx.beginPath();
    gridCtx.moveTo(sx, sy);
    gridCtx.lineTo(ex, ey);
    gridCtx.stroke();
}

function drawRect(x, y, w, h){
    gridCtx.globalAlpha = 1;
    gridCtx.strokeStyle = 'Black';
    gridCtx.strokeRect(x, y, w, h);
}

function drawBorder(x, y, w, h){
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'Black';
    ctx.strokeRect(x, y, w, h);
}



function toggleGrid() {
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    if (showGrid) {

        // draw boxes
        for (let x = 0; x < cellSize*2*4; x++){
            for (let y = 0; y < cellSize*2*3; y++){
                drawRect(0+cellSize*x, 128+cellSize*y, cellSize, cellSize);
            }
        }

        // Draw Lines
        // for (let x = 0; x < cellSize*2; x++){
        //     drawLine(this.x+cellSize*x, this.y, this.x+cellSize*x, this.y+this.height);
        // }
        // for (let y = 0; y < cellSize*2; y++){
        //     drawLine(this.x, this.y+cellSize*y, this.x+this.width, this.y+cellSize*y);
        // }
    }
}


function renderCanvas() {
    let one = document.getElementById("saveCanvas").getContext("bitmaprenderer");

    let offscreen = new OffscreenCanvas(256, 256);
    let gl = offscreen.getContext('webgl');

    // Commit rendering to the first canvas
    let bitmapOne = offscreen.transferToImageBitmap();
    one.transferFromImageBitmap(bitmapOne);
    return one;
}


// Update game loop
function update(){
    // uiCtx.clearRect(0,0,uiCanvas.width,uiCanvas.height);
    // let lineHeight = ctx.measureText(`Code: ${keylog}`).width;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBorder(0, 128, 512, 384);
    // notifyCtx.clearRect(0,0,canvas.width,canvas.height);

    // Border Grid
    // drawGrid(0, 0+cellSize, 512, 512-cellSize);

    // for (let x = 0; x < 512*.122; x++) drawGrid(0+cellSize+cellSize*x, 0+cellSize, 0, 512-cellSize);
    // for (let y = 0; y < 512*.122; y++) drawGrid(0, 0+cellSize+cellSize+cellSize*y, 512, 0);

    // for (let i = 0; i < cards.length; i++){
    //     if (collision(mouse, cards[`${i}`]) && mouse.clicked){
    //         choosenTower = cards[`${i}`].type;
    //         chooseTower();
    //     }
    // }

    // ctx.fillStyle = 'black';
    // ctx.fillRect(0,0,controlBar.width,controlBar.height);
    // handleAreaGrid();
    if (mouse.clicked) handleAreaGrid();
    handleBtns();

    const labelOffset = 32;
    drawLabel(`Brush Size:${Math.floor(mouse.width)}`, 'right', 'Teal', canvas.width-42-30*3, 0+labelOffset*1, 18);
    drawLabel(`Change Brush Size`, 'right', 'Teal',                     canvas.width-42-30*3, 0+labelOffset*2, 18);
    drawLabel(`[ ] or Mouse Wheel`, 'right', 'Teal',                    canvas.width-42-30*3, 0+labelOffset*3, 18);
    drawLabel(`Toggle Grid: g`, 'right', 'Teal',                        canvas.width-42-30*3, 0+labelOffset*4, 18);
    drawLabel(`Clear Canvas: e`, 'right', 'Teal',                       canvas.width-42-30*3, 0+labelOffset*5, 18);

    // Show fps if cheats fpsVisible is true
    if (cheats?.fpsVisible){
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
    // ctx.fillText(`Brush Size:${Math.floor(mouse.width)}`, canvas.width-42-30*3, 40);
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
function areaCollision(p, c){
    const children = [];
    children.push(c);
    // if (collision(p,children)){
    //     for (let i = 0; i < children.length; i++){
    //         c.draw();
    //     }
    // }
    return children;
};


createArea();
createGrid();
createBtns()
update();

