var socket;
var slider;
var sizecounter;

let imageTree1;
let imageTree1Width = 50;
let imageTree1Height = 67;

let WIDTH = 750;
let HEIGHT = 500

const selectedState = {
    'NONE_SELECTED': 'none_selected',
    'SELECTED': 'selected'
}

const placedState = {
    "NONE_PLACED":"none_placed",
    "TEMP_PLACED":"temp_placed"
}

const treeType = {
    'TREE1': 'tree1',
    'TREE2': 'tree2'
}

let currentState;
let currentTree;

function preload(){
    imageTree1 = loadImage('test_tree.png');
}

function setup() {
    currentState = selectedState.NONE_SELECTED;

    tree1 = createButton("Tree1");
    tree1.class("myTree")
    tree1.parent("tree1")
    tree1.attribute("value","tree1")
    tree1.mouseClicked(function(){ 
        currentState = selectedState.SELECTED;
        currentTree = treeType.TREE1;
    })
    tree2 = createButton("Tree2");
    tree2.class("myTree")
    tree2.parent("tree1")
    tree2.attribute("value","tree2")
    tree2.mouseClicked(function(){ 
        currentState = selectedState.SELECTED;
        currentTree = treeType.TREE2;
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
    if (currentState == selectedState.SELECTED){
        // TODO: Bounding box avoid too much tree overlap algorithm
        image(imageTree1, mouseX - imageTree1Width/2, mouseY - imageTree1Height/2)

    }
    // for (let i = 0; i < 100; i++){

    //     image(img, Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
    // }
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
