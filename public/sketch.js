//trigger debug mode
let isDebugMode = true;

var socket;
var slider;
var sizecounter;

var controlsHEIGHT = 100;

//State Switcher

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
    'TREE2': 'tree2',
    'TREE3': 'tree3'
}

const treePrices = {
    "tree1": 3,
    "tree2": 3,
    "tree3": 3
}

let currentSelectState;
let currentPlacedState;
let currentTree;

let hovered_tree;
let isOnHover = false;

let tempTreeSprite;
let permanentTreeSprite;
let received_treeJSON;

let tree1Button;
let tree2Button;
let tree3Button;

let nameInput;
let urlInput;
let commentInput;



//Loading Images
let imageTree1;
let imageTree1Width = 50;
let imageTree1Height = 67;

let imageTree2;
let imageTree2Width = 50;
let imageTree2Height = 72;

let imageTree3;
let imageTree3Width = 50;
let imageTree3Height = 72;

function preload(){
    imageTree1 = loadImage('tree1.png');
    imageTree1_hover = loadImage('tree1_hover.png');
    imageTree1_temp = loadImage('tree1_temp.png');
    imageTree1_delete = loadImage('tree1_temp_del.png');

    imageTree2 = loadImage('tree2.png');
    imageTree2_hover = loadImage('tree2_hover.png');
    imageTree2_temp = loadImage('tree2_temp.png');
    imageTree2_delete = loadImage('tree2_temp_del.png');

    imageTree3 = loadImage('tree3_001.png');
    imageTree3_ani1 = loadImage('tree3_001.png');
    imageTree3_ani2 = loadImage('tree3_002.png');
    imageTree3_ani3 = loadImage('tree3_003.png');
    imageTree3_ani4 = loadImage('tree3_004.png');

    imageTree3_hover = loadImage('tree3_hover.png');
    imageTree3_temp = loadImage('tree3_temp.png');
    imageTree3_delete = loadImage('tree3_temp_del.png');
}


function setup() {
    currentSelectState = selectedState.NONE_SELECTED;
    currentPlacedState = placedState.NONE_PLACED;
    currentTree = treeType.NONE;
    tempTreeSprite = new Group();
    permanentTreeSprite = new Group();
    mouseSprite = createSprite(-50,-50);

    // PROBLEM: Two people trying to create a tree on the same spot.

    /////// GET INITIAL DATA //////
    fetchServerData()

    /////// DONATE BUTTON //////
    // let donate = createButton("donate");
    // donate.class("donate")
    // donate.parent("donateContainer")
    // donate.attribute("value","donate")
    // donate.mouseClicked(function(){

    //     let jsonData = sendTrees();
    //     currentPlacedState = placedState.NONE_PLACED;

    //     fetch("/addTrees", {
    //         method: 'POST', // or 'PUT'
    //         body: JSON.stringify(jsonData), // data can be `string` or {object}!
    //         headers:{
    //           'Content-Type': 'application/json'
    //         }
    //     })
    //     // .then(res => res.json())
    //     .then((response) => {
    //         console.log('Success:', JSON.stringify(response))
    //         fetchServerData()
    //     })
    //     .catch(error => console.error('Error:', error));
    // })

    /////// TREE BUTTONS //////
    //——Button : Tree1
    tree1Button = createButton("");
    tree1Button.class("myTree1")
    tree1Button.parent("tree1")
    tree1Button.attribute("value","tree1")
    tree1Button.mouseClicked(function(){

        if(currentTree === treeType.NONE ){
            //If not previously selected
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE1;
            tree1Button.addClass('Selected');
        }
        else if(currentTree === treeType.TREE1){
            //If already selected tree1
            currentSelectState = selectedState.NONE_SELECTED;
            currentTree = treeType.NONE;
            tree1Button.removeClass('Selected');
        }
        else if(currentTree !== treeType.TREE1){
            //If already selected tree that is NOT tree1
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE1;
            tree1Button.addClass('Selected');
            tree2Button.removeClass('Selected');
            tree3Button.removeClass('Selected');
        }
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite();
        mouseSprite.changeImage('tree1');
    })

    //——Button : Tree2
    tree2Button = createButton("");
    tree2Button.class("myTree2")
    tree2Button.parent("tree2")
    tree2Button.attribute("value","tree2")
    tree2Button.mouseClicked(function(){

        if(currentTree === treeType.NONE ){
            //If not previously selected
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE2;
            tree2Button.addClass('Selected');
        }
        else if(currentTree === treeType.TREE2){
            //If already selected tree2
            currentSelectState = selectedState.NONE_SELECTED;
            currentTree = treeType.NONE;
            tree2Button.removeClass('Selected');
        }
        else if(currentTree !== treeType.TREE2){
            //If already selected tree that is NOT tree2
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE2;
            tree2Button.addClass('Selected');
            tree1Button.removeClass('Selected');
            tree3Button.removeClass('Selected');
        }
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite();
        mouseSprite.changeImage('tree2');
    })

   //——Button : Tree3
    tree3Button = createButton("");
    tree3Button.class("myTree3")
    tree3Button.parent("tree3")
    tree3Button.attribute("value","tree3")
    tree3Button.mouseClicked(function(){

        if(currentTree === treeType.NONE ){
            //If not previously selected
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE3;
            tree3Button.addClass('Selected');
        }
        else if(currentTree === treeType.TREE3){
            //If already selected tree3
            currentSelectState = selectedState.NONE_SELECTED;
            currentTree = treeType.NONE;
            tree3Button.removeClass('Selected');
        }
        else if(currentTree !== treeType.TREE3){
            //If already selected tree that is NOT tree3
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE3;
            tree3Button.addClass('Selected');
            tree1Button.removeClass('Selected');
            tree2Button.removeClass('Selected');
        }
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite();
        mouseSprite.changeImage('tree3');
    })

    //////////// USER INPUT ////////
    nameInput = createInput("");
    nameInput.class("name")
    nameInput.parent("nameInput")
    nameInput.attribute("value","Name")

    urlInput = createInput("");
    urlInput.class("name")
    urlInput.parent("urlInput")
    urlInput.attribute("value","URL")


    commentInput = createInput("");
    commentInput.class("name")
    commentInput.parent("commentInput")
    commentInput.attribute("value","Comment")


    var canvas = createCanvas(windowWidth,windowHeight);
    canvas.class('canvas');
    canvas.parent('canvas-holder');
    //Activates the tree planting function
    canvas.mouseClicked(mouseHandle)
    background('#E5E5E5');
    ////////////

    //   socket = io.connect('http://localhost:3000');
}

let mouseSprite;

// Helper function for setup
function createMouseSprite(){
    mouseSprite = createSprite(mouseX,mouseY)
    mouseSprite.addImage('tree1',imageTree1_temp);
    mouseSprite.addImage('tree2',imageTree2_temp);
    mouseSprite.addImage('tree3',imageTree3_temp);
    mouseSprite.setCollider('rectangle',0,0,25,25);
    cursor(CROSS);
    // mouseSprite.setCollider('circle',0,0,10);
    mouseSprite.debug = isDebugMode;
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
        //———————————T R E E 1 (PERMANENT) ————————————!
        if (data[i]["treetype"] == treeType.TREE1){
            let tree = createSprite(data[i]["x"],data[i]["y"],imageTree1Width,imageTree1Height)
            // TODO: New Animation for permanent tree here
            tree.addAnimation('tree1_permanent', imageTree1);
            tree.addAnimation('tree1_hover', imageTree1_hover);

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                // Change to hover state animation
                tree.changeAnimation('tree1_hover');
                isOnHover = true;
                hovered_tree = data[i];
                cursor('pointer');
              }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree1_permanent');
                isOnHover = false;
                cursor('default');

            }

            tree.onMousePressed = function(){
                window.open(data[i].meta.url);
            }

            tree.changeAnimation('tree1_permanent');
            permanentTreeSprite.add(tree);

        }  //———————————T R E E 2 (PERMANENT) ————————————!
        else if (data[i]["treetype"] == treeType.TREE2) {
            let tree = createSprite(data[i]["x"],data[i]["y"],imageTree2Width,imageTree2Height)

            tree.addAnimation('tree2_permanent', imageTree2);
            tree.addAnimation('tree2_hover', imageTree2_hover);

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree2_hover');
                isOnHover = true;
                hovered_tree = data[i];
                cursor('pointer');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree2_permanent');
                isOnHover = false;
                cursor('default');
            }

            tree.onMousePressed = function(){
                window.open(data[i].meta.url);
            }
            tree.changeAnimation('tree2_permanent');
            permanentTreeSprite.add(tree);

        } //———————————T R E E 3 (PERMANENT) ————————————!
        else if (data[i]["treetype"] == treeType.TREE3) {
            let tree = createSprite(data[i]["x"],data[i]["y"],imageTree3Width,imageTree3Height)
            tree.addAnimation('tree3_permanent', imageTree3_ani1,imageTree3_ani2,imageTree3_ani3);
            tree.addAnimation('tree3_hover', imageTree3_hover);

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree3_hover');
                isOnHover = true;
                hovered_tree = data[i];
                cursor('pointer');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree3_permanent');
                isOnHover = false;
                cursor('default');
            }

            tree.onMousePressed = function(){
                window.open(data[i].meta.url);
            }
            tree.changeAnimation('tree3_permanent');
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
        updateBuyButton()
    })
}


function windowResized(){
    resizeCanvas(windowWidth,(windowHeight)-controlsHEIGHT);
}

function updateBuyButton(){
    let total = document.getElementById("total");
    let cardTotal = document.getElementById("card-total");
    let payAmount = document.getElementById("pay-amount");

    let amount = 0;
    for (let i = 0; i < tempTreeSprite.length;i++){
        let treeType = tempTreeSprite[i].getAnimationLabel().split("_")[0]
        amount += treePrices[treeType];
    }
    payAmount.innerHTML = "Pay $" + amount + ".00";
    cardTotal.innerHTML = "$" + amount + ".00";
    total.innerHTML = amount;
}

function mouseHandle(){
    if (currentSelectState == selectedState.SELECTED){
        console.log([currentSelectState,currentTree])

        //———————————T R E E 1 (TEMPORARY) ————————————!
        if (currentTree == treeType.TREE1){
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree1Width,imageTree1Height)
            tree.addAnimation('tree1_temp', imageTree1_temp);
            tree.addAnimation('tree1_temp_delete', imageTree1_delete);

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree1_temp_delete');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree1_temp');
            }

            tree.onMousePressed = function(){
                if (currentSelectState == selectedState.NONE_SELECTED){
                    tree.remove()
                    updateBuyButton()
                    if(tempTreeSprite.length==0){
                        currentPlacedState = placedState.NONE_PLACED;
                    }
                }
            }

            tree.changeAnimation('tree1_temp');
            tempTreeSprite.add(tree);

        } //———————————T R E E 2 (TEMPORARY) ————————————!
        else if (currentTree == treeType.TREE2) {
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree2Width,imageTree2Height)
            tree.addAnimation('tree2_temp', imageTree2_temp);
            tree.addAnimation('tree2_temp_delete', imageTree2_delete);

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree2_temp_delete');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree2_temp');
            }

            tree.onMousePressed = function(){
                if (currentSelectState == selectedState.NONE_SELECTED){
                    tree.remove()
                    updateBuyButton()
                    if(tempTreeSprite.length==0){
                        currentPlacedState = placedState.NONE_PLACED;
                    }
                }
            }
            tree.changeAnimation('tree2_temp');
            tempTreeSprite.add(tree);

        } //———————————T R E E 3 (TEMPORARY) ————————————!
        else if (currentTree == treeType.TREE3) {
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree3Width,imageTree3Height)
            tree.addAnimation('tree3_temp', imageTree3_temp);
            tree.addAnimation('tree3_temp_delete', imageTree3_delete);

            tree.setCollider('rectangle',0,0,25,25);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree3_temp_delete');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree3_temp');
            }

            tree.onMousePressed = function(){
                if (currentSelectState == selectedState.NONE_SELECTED){
                    tree.remove()
                    updateBuyButton()
                    if(tempTreeSprite.length==0){
                        currentPlacedState = placedState.NONE_PLACED;
                    }
                }
            }
            tree.changeAnimation('tree3_temp');
            tempTreeSprite.add(tree);
        }

        //--------UPDATE BUY BUTTON---------//

        updateBuyButton();

        //———————————AFTER EACH CLICK EVENT ON CANVAS ————————————!
        cursor('default');

        tree1Button.removeClass('Selected');
        tree2Button.removeClass('Selected');
        tree3Button.removeClass('Selected');

        currentSelectState = selectedState.NONE_SELECTED;
        currentTree = treeType.NONE;
        currentPlacedState = placedState.TEMP_PLACED;
    }
}


function draw(){
    background('#E5E5E5');

    if (currentSelectState == selectedState.SELECTED){
        mouseSprite.velocity.x = (mouseX-mouseSprite.position.x)/10;
        mouseSprite.velocity.y = (mouseY-mouseSprite.position.y)/10;
        mouseSprite.collide(tempTreeSprite)
        mouseSprite.collide(permanentTreeSprite)
    } else {
        mouseSprite.remove();
    }
    drawSprites();


    fill(255, 255, 255);
    textSize(13);

    if(isDebugMode){
    text("Select State: " + currentSelectState, 20 , 20, 200, 100);
    text("Placed State: " +currentPlacedState, 20 , 40, 200, 100);
    text("Tree State: " +currentTree, 20 , 60, 200, 100);
    text("Toggle Debug with CONTROL key ", 20 , 80, 200, 100);
    }

    if(isOnHover){

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

function keyPressed() {
    if (keyCode === CONTROL) {
    isDebugMode = !isDebugMode;
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
