var socket;
var slider;
var sizecounter;

let img;
let imgWidth = 50;
let imgHeight = 73;

let WIDTH = 750;
let HEIGHT = 500

let selection = false;
let itemSelected = ""

function preload(){
    img = loadImage('toto.png');
}

function setup() {
    tree1 = createButton();
    tree1.class("myTree")
    tree1.parent("tree1")
    tree1.attribute("value","tree")
    tree1.mouseClicked(function(){
        selection = true;
        itemSelected = "tree1"
    })
    ////////////
    slider = createSlider(1,8, 5);
    slider.parent('slider');
    sizecounter = select(".sizecounter");
    sizecounter.html(slider.value());
    var canvas = createCanvas(WIDTH,HEIGHT);
    canvas.class('canvas');
    canvas.parent('canvas-holder');
    background(51);
    ////////////

    //   socket = io.connect('http://localhost:3000');
}

function mouseClicked(){
    image(img, mouseX - imgWidth/2, mouseY - imgHeight/2);
}






//-------- DVD Screenscaver ---------//

// let imageX = 40;
// let imageY = 0;

// let incrementorX = 2.5;
// let incrementorY = 2.5;

// function checkBoundsX(currPos){
//     if (currPos > WIDTH - 40 || currPos < -40){
//         return true;
//     }
//     return false;
// }

// function checkBoundsY(currPos){
//     if (currPos > HEIGHT - 40 || currPos < -40){
//         return true;
//     }
//     return false;
// }

// function draw() {
//     background(51);
//     if (checkBoundsX(imageX)){
//         incrementorX *= -1;
//     }
//     if (checkBoundsY(imageY)){
//         incrementorY *= -1;
//     }
//     imageX += incrementorX;
//     imageY += incrementorY;
//     image(img, imageX, imageY);
// }
