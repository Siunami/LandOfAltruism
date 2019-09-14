var socket;
var r;
var g;
var b;
var slider;
var sizecounter;

console.log(window)

let img;
let imgWidth = 50;
let imgHeight = 73;

function preload(){
    img = loadImage('toto.png');
    console.log(img)
}

function setup() {
  ////////////
  slider = createSlider(1,8, 5);
  slider.parent('slider');
  sizecounter = select(".sizecounter");
  sizecounter.html(slider.value());
  var canvas = createCanvas(750,500);
  canvas.class('canvas');
  canvas.parent('canvas-holder');
  background(51);
  ////////////

  r = random(155,255)
  g = random(155,255)
  b = random(155,255)

//   socket = io.connect('http://localhost:3000');
}

// function mouseDragged() {
//   sizecounter.html(slider.value());
//   strokeWeight(slider.value())
//   stroke(r,g,b);
//   line(pmouseX,pmouseY, mouseX,mouseY);
// }

function mouseClicked(){
    image(img, mouseX - imgWidth/2, mouseY - imgHeight/2);
    // sizecounter.html(slider.value());
    // strokeWeight(slider.value())
    // stroke(r,g,b);
    // ellipse(mouseX,mouseY,5)
}

function draw() {
}
