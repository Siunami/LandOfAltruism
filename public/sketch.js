var socket;
var slider;
var sizecounter;

let imageTree1;
let imageTree1Width = 50;
let imageTree1Height = 67;

let imageTree2;
let imageTree2Width = 50;
let imageTree2Height = 72;

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
    'NONE':'none',
    'TREE1': 'tree1',
    'TREE2': 'tree2'
}

let currentSelectState;
let currentPlacedState;
let currentTree;

let tempTreeList = [];
let tempTreeSprite = [];


function preload(){
    imageTree1 = loadImage('test_tree.png');
    imageTree2 = loadImage('test_tree2.png');
}

function setup() {
    currentSelectState = selectedState.NONE_SELECTED;
    currentPlacedState = placedState.NONE_PLACED;
    currentTree = treeType.NONE;

    tree1 = createButton("Tree1");
    tree1.class("myTree")
    tree1.parent("tree1")
    tree1.attribute("value","tree1")
    tree1.mouseClicked(function(){ 
        currentSelectState = selectedState.SELECTED;
        currentTree = treeType.TREE1;
    })
    tree2 = createButton("Tree2");
    tree2.class("myTree")
    tree2.parent("tree2")
    tree2.attribute("value","tree2")
    tree2.mouseClicked(function(){ 
        currentSelectState = selectedState.SELECTED;
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
    canvas.mouseClicked(mouseHandle)
    background(51);
    ////////////

    //   socket = io.connect('http://localhost:3000');
}


function mouseHandle(){
    if (currentSelectState == selectedState.SELECTED){
        console.log([currentSelectState,currentTree])
        
        // TODO: Bounding box avoid too much tree overlap algorithm
        if (currentTree == treeType.TREE1){
            let tree = createSprite(mouseX,mouseY,imageTree1Width,imageTree1Height)
            tree.addImage(imageTree1);
            tree.setCollider('rectangle',0,0,30,30);
            tree.debug = true;
            tempTreeSprite.push(tree);

        } else if (currentTree == treeType.TREE2) {
            let tree = createSprite(mouseX,mouseY,imageTree2Width,imageTree2Height)
            tree.addImage(imageTree2);
            tree.setCollider('rectangle',0,0,30,30);
            tree.debug = true;
            tempTreeSprite.push(tree);
        }

        console.log(tempTreeSprite);

        tempTreeList.push({
            "x": mouseX,
            "y": mouseY,
            "treetype": currentTree
        })

        currentSelectState = selectedState.NONE_SELECTED;
        currentPlacedState = placedState.TEMP_PLACED;
        currentTree = treeType.NONE;

    }

    //To delete the sprites
    if (currentSelectState == selectedState.NONE_SELECTED){
        
    }


}


function draw(){
    drawSprites();
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
