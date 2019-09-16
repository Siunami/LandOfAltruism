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

let hovered_tree;
let isOnHover = false;

let tempTreeSprite;
let permanentTreeSprite;
let received_treeJSON;

let nameInput;
let urlInput;
let commentInput;

function preload(){
    imageTree1 = loadImage('tree1.png');
    imageTree1_hover = loadImage('tree1_hover.png');
    imageTree1_temp = loadImage('tree1_temp.png');
    imageTree1_delete = loadImage('tree1_temp_del.png');

    imageTree2 = loadImage('tree2.png');
    imageTree2_hover = loadImage('tree2_hover.png');
    imageTree2_temp = loadImage('tree2_temp.png');
    imageTree2_delete = loadImage('tree2_temp_del.png');
}

let mouseSprite;

// Helper function for setup
function createMouseSprite(){
    mouseSprite = createSprite(mouseX,mouseY)
    mouseSprite.addImage('tree1',imageTree1_temp);
    mouseSprite.addImage('tree2',imageTree2_temp);
    mouseSprite.setCollider('rectangle',0,0,25,25);
    // mouseSprite.setCollider('circle',0,0,10);
    mouseSprite.debug = true;
}


// Helper function for setup
function sendTrees(){
    //Convert current tree position into JSON files to send to the server

    let sendTreeList = [];
    for (var i = 0 ; i < tempTreeSprite.length ; i++){
        sendTreeList.push({
            "x":tempTreeSprite[i].position.x, 
            "y":tempTreeSprite[i].position.y,
            "treetype":tempTreeSprite[i].getAnimationLabel().split("_")[0],
            "meta": {
                "name":nameInput.value(),
                "date": new Date(),
                "url":urlInput.value(),
                "comment":commentInput.value(),
                "payment_data":50
            }
        })
    }

    return sendTreeList;
}



function renderInitialTrees(data){
    //Deletes current permanent tree sprite to refresh the screen
    let length_perm = permanentTreeSprite.length;
    for (var i = 0 ; i < length_perm ; i++){
        permanentTreeSprite[0].remove();
    }


    for (let i in data){
        if (data[i]["treetype"] == treeType.TREE1){
            let tree = createSprite(data[i]["x"],data[i]["y"],imageTree1Width,imageTree1Height)
            // TODO: New Animation for permanent tree here
            tree.addAnimation('tree1_permanent', imageTree1);
            tree.addAnimation('tree1_hover', imageTree1_hover);
            

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = true;

            tree.onMouseOver = function(){
                // Change to hover state animation
                tree.changeAnimation('tree1_hover');
                isOnHover = true;
                hovered_tree = data[i];
                console.log(hovered_tree);
                console.log(isOnHover);
              }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree1_permanent');
                isOnHover = false;
            }

            tree.changeAnimation('tree1_permanent');
            permanentTreeSprite.add(tree);

        } else if (data[i]["treetype"] == treeType.TREE2) {
            let tree = createSprite(data[i]["x"],data[i]["y"],imageTree2Width,imageTree2Height)
            // TODO: New Animation for permanent tree here
            tree.addAnimation('tree2_permanent', imageTree2);
            tree.addAnimation('tree2_hover', imageTree2_hover);


            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = true;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree2_hover');
                isOnHover = true;
                hovered_tree = data[i];
                console.log(hovered_tree);
                console.log(isOnHover);
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree2_permanent');
                isOnHover = false;
            }

            tree.changeAnimation('tree2_permanent');
            permanentTreeSprite.add(tree);
        }
    }
    console.log("permanent Tree Sprite is ↓")
    console.log(permanentTreeSprite)
}

function fetchServerData(){
    fetch('/getTrees')
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log("Tree data received from server↓")
        received_treeJSON = data;
        console.log(received_treeJSON);

        //Draw permanent trees
        renderInitialTrees(data);
        //Delete the temporary tree sprites
        let length = tempTreeSprite.length;
        for (var i = 0 ; i < length ; i++){
            tempTreeSprite[0].remove();
        }
    })
}

function setup() {
    currentSelectState = selectedState.NONE_SELECTED;
    currentPlacedState = placedState.NONE_PLACED;
    currentTree = treeType.NONE;
    tempTreeSprite = new Group();
    permanentTreeSprite = new Group();
    mouseSprite = createSprite(-50,-50);

    // Generate 100 trees

    // for (var i = 0; i < 100; i++){
    //     let tree = createSprite(Math.floor(Math.random() * WIDTH) + 1, Math.floor(Math.random() * HEIGHT) + 1,imageTree1Width,imageTree1Height)
    //     tree.addAnimation('tree1_temp', imageTree1);
    //     tree.setCollider('rectangle',0,0,25,25);
    //     // tree.setCollider('circle',0,0,10);
    //     tree.debug = true;
    //     tempTreeSprite.add(tree);
    // }

    // PROBLEM: Two people trying to create a tree on the same spot.

    /////// GET INITIAL DATA //////
    fetchServerData()

    /////// DONATE BUTTON //////
    let donate = createButton("donate");
    donate.class("donate")
    donate.parent("donateContainer")
    donate.attribute("value","donate")
    donate.mouseClicked(function(){
        console.log("ASDFASDF")

        let jsonData = sendTrees();

        fetch("/addTrees", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(jsonData), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
        })
        // .then(res => res.json())
        .then((response) => {
            console.log('Success:', JSON.stringify(response))
            fetchServerData()
        })
        .catch(error => console.error('Error:', error));
    })

    /////// TREE BUTTONS //////
    let tree1 = createButton("Tree1");
    tree1.class("myTree1")
    tree1.parent("tree1")
    tree1.attribute("value","tree1")
    tree1.mouseClicked(function(){
        currentSelectState = selectedState.SELECTED;
        currentTree = treeType.TREE1;
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite();
        mouseSprite.changeImage('tree1');
    })
    let tree2 = createButton("Tree2");
    tree2.class("myTree2")
    tree2.parent("tree2")
    tree2.attribute("value","tree2")
    tree2.mouseClicked(function(){
        currentSelectState = selectedState.SELECTED;
        currentTree = treeType.TREE2;
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite();
        mouseSprite.changeImage('tree2');
    })
    let tree3 = createButton("Tree3");
    tree3.class("myTree3")
    tree3.parent("tree3")
    tree3.attribute("value","tree3")
    tree3.mouseClicked(function(){
        currentSelectState = selectedState.SELECTED;
        currentTree = treeType.TREE2;
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite()
        mouseSprite.changeImage('tree2')
    })
    //////////// USER INPUT ////////
    nameInput = createInput("");
    nameInput.class("name")
    nameInput.parent("nameInput")
    nameInput.attribute("value","CaptainSparkles")

    urlInput = createInput("");
    urlInput.class("name")
    urlInput.parent("urlInput")

    commentInput = createInput("");
    commentInput.class("name")
    commentInput.parent("commentInput")


    var canvas = createCanvas(windowWidth,(windowHeight)-controlsHEIGHT);
    canvas.class('canvas');
    canvas.parent('canvas-holder');
    //Activates the tree planting function
    canvas.mouseClicked(mouseHandle)
    background(51);
    ////////////

    //   socket = io.connect('http://localhost:3000');
}

function windowResized(){
    resizeCanvas(windowWidth,(windowHeight)-controlsHEIGHT);
}

function mouseHandle(){
    if (currentSelectState == selectedState.SELECTED){
        console.log([currentSelectState,currentTree])

        // TODO: Bounding box avoid too much tree overlap algorithm
        if (currentTree == treeType.TREE1){
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree1Width,imageTree1Height)
            tree.addAnimation('tree1_temp', imageTree1_temp);
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
            tree.addAnimation('tree2_temp', imageTree2_temp);
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
}


function draw(){
    background(51);
    // mouseSprite.x = mouseX;
    // mouseSprite.y = mouseY;

    if (currentSelectState == selectedState.SELECTED){
        mouseSprite.velocity.x = (mouseX-mouseSprite.position.x)/10;
        mouseSprite.velocity.y = (mouseY-mouseSprite.position.y)/10;
        mouseSprite.collide(tempTreeSprite)
        mouseSprite.collide(permanentTreeSprite)
    } else {
        mouseSprite.remove();
    }
    drawSprites();

        if(isOnHover){
            fill(255, 255, 255);

            //NAME
            textSize(13);
            text("$" + hovered_tree.meta.payment_data, hovered_tree.x + imageTree1Width/2, hovered_tree.y - 20, 150, 100); 

            //NAME
            textSize(18);
            text(hovered_tree.meta.name, hovered_tree.x + imageTree1Width/2, hovered_tree.y, 250, 100); 
            //Comment
            textSize(12);
            text(hovered_tree.meta.comment, hovered_tree.x + imageTree1Width/2, hovered_tree.y + 30, 250, 100);

        }

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
