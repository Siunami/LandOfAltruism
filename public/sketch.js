var socket;
var r;
var g;
var b;
var slider;
var sizecounter;

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

  socket = io.connect('http://b9241f17.ngrok.io');
}

function mouseDragged() {
  sizecounter.html(slider.value());
  strokeWeight(slider.value())
  stroke(r,g,b);
  line(pmouseX,pmouseY, mouseX,mouseY);
}

function draw() {
}
