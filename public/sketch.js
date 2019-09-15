var socket;
var slider;
var sizecounter;

let imageTree1;
let imageTree1Width = 50;
let imageTree1Height = 67;

let imageTree2;
let imageTree2Width = 50;
let imageTree2Height = 72;

let = controlsHEIGHT = 120;

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

let sendTreeList = [];
let tempTreeSprite;


function preload(){
    imageTree1 = loadImage('test_tree.png');
    imageTree1_delete = loadImage('test_tree_del.png');

    imageTree2 = loadImage('test_tree2.png');
    imageTree2_delete = loadImage('test_tree2_del.png');
}

let mouseSprite;

// Helper function for setup
function createMouseSprite(){
    mouseSprite = createSprite(mouseX,mouseY)
    mouseSprite.addImage('tree1',imageTree1);
    mouseSprite.addImage('tree2',imageTree2);
    mouseSprite.setCollider('rectangle',0,0,25,25);
    // mouseSprite.setCollider('circle',0,0,10);
    mouseSprite.debug = true;
}


// Helper function for setup
function sendTrees(){
    sendTreeList = [];
    for (var i = 0 ; i < tempTreeSprite.length ; i++){
        sendTreeList.push({
            "x":tempTreeSprite[i].position.x, 
            "y":tempTreeSprite[i].position.y,
            "treetype":tempTreeSprite[i].getAnimationLabel().split("_")[0]
        })
    }
}


function setup() {
    currentSelectState = selectedState.NONE_SELECTED;
    currentPlacedState = placedState.NONE_PLACED;
    currentTree = treeType.NONE;
    tempTreeSprite = new Group();
    mouseSprite = createSprite(-50,-50);

    // Generate 100 trees

    // for (var i = 0; i < 100; i++){
    //     let tree = createSprite(Math.floor(Math.random() * WIDTH) + 1, Math.floor(Math.random() * HEIGHT) + 1,imageTree1Width,imageTree1Height)
    //     tree.addImage(imageTree1);
    //     tree.setCollider('rectangle',0,0,25,25);
    //     // tree.setCollider('circle',0,0,10);
    //     tree.debug = true;
    //     tempTreeSprite.add(tree);
    // }

    // PROBLEM: Two people trying to create a tree on the same spot.

    /////// GET INITIAL DATA //////
    fetch('getTrees')
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data)
    })

    /////// DONATE BUTTON //////
    let donate = createButton("donate");
    donate.class("donate")
    donate.parent("donateContainer")
    donate.attribute("value","donate")
    donate.mouseClicked(function(){
        console.log("ASDFASDF")
        fetch("/addTrees", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({
                "x":60,
                "y":34
            }), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
        })
        // .then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
    })

    /////// TREE BUTTONS //////
    let tree1 = createButton("Tree1");
    tree1.class("myTree")
    tree1.parent("tree1")
    tree1.attribute("value","tree1")
    tree1.mouseClicked(function(){
        currentSelectState = selectedState.SELECTED;
        currentTree = treeType.TREE1;
        createMouseSprite()
        mouseSprite.changeImage('tree1')
    })
    let tree2 = createButton("Tree2");
    tree2.class("myTree")
    tree2.parent("tree2")
    tree2.attribute("value","tree2")
    tree2.mouseClicked(function(){
        currentSelectState = selectedState.SELECTED;
        currentTree = treeType.TREE2;
        createMouseSprite()
        mouseSprite.changeImage('tree2')
    })
    let tree3 = createButton("Tree3");
    tree3.class("myTree")
    tree3.parent("tree3")
    tree3.attribute("value","tree3")
    tree3.mouseClicked(function(){
        currentSelectState = selectedState.SELECTED;
        currentTree = treeType.TREE2;
        createMouseSprite()
        mouseSprite.changeImage('tree2')
    })
    ////////////

    var canvas = createCanvas(windowWidth,(windowHeight)-controlsHEIGHT);
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
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree1Width,imageTree1Height)
            tree.addAnimation('tree1_temp', imageTree1);
            tree.addAnimation('tree1_temp_delete', imageTree1_delete);

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = true;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree1_temp_delete');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree1_temp');
            }

            tree.onMousePressed = function(){
                if (currentSelectState == selectedState.NONE_SELECTED){
                    tree.remove()
                    console.log(tempTreeSprite);
                }
            }

            tree.changeAnimation('tree1_temp');
            tempTreeSprite.add(tree);

        } else if (currentTree == treeType.TREE2) {
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree2Width,imageTree2Height)
            tree.addAnimation('tree2_temp', imageTree2);
            tree.addAnimation('tree2_temp_delete', imageTree2_delete);

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = true;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree2_temp_delete');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree2_temp');
            }

            tree.onMousePressed = function(){
                if (currentSelectState == selectedState.NONE_SELECTED){
                    tree.remove()
                    console.log(tempTreeSprite);
                }
            }

            tree.changeAnimation('tree2_temp');
            tempTreeSprite.add(tree);

        }

        console.log(tempTreeSprite);


        currentSelectState = selectedState.NONE_SELECTED;
        currentPlacedState = placedState.TEMP_PLACED;
        currentTree = treeType.NONE;

    }

    // //To delete the sprites
    // if (currentSelectState == selectedState.NONE_SELECTED){
        
    // }


}


function draw(){
    background(51);
    // mouseSprite.x = mouseX;
    // mouseSprite.y = mouseY;
    if (currentSelectState == selectedState.SELECTED){
        mouseSprite.velocity.x = (mouseX-mouseSprite.position.x)/10;
        mouseSprite.velocity.y = (mouseY-mouseSprite.position.y)/10;
        mouseSprite.collide(tempTreeSprite)
    } else {
        mouseSprite.remove();
    }
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
