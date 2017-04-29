var vehicles = [];
var food = [];
var poison = [];
var ant_sprite_image, ant_sprite_sheet, ant_walk, ant_frames, ant_image;
var debug;
let ant;
let home;

function preload(){
  ant_frames = [
    {"name":"ant_walk01", "frame":{"x":5, "y": 3, "width": 54, "height": 60}},
    {"name":"ant_walk02", "frame":{"x":5, "y": 2, "width": 47, "height": 62}},
    {"name":"ant_walk03", "frame":{"x":5, "y": 3, "width": 54, "height": 60}},
    {"name":"ant_walk04", "frame":{"x":5, "y": 2, "width": 47, "height": 62}},
]
  ant_sprite_sheet = loadSpriteSheet('assets/antSpriteSheet.png', 55,60, 16);
  console.log(ant_sprite_sheet)
  ant_walk = loadAnimation(ant_sprite_sheet)
  ant_stand = loadAnimation(new SpriteSheet('assets/antSpriteSheet.png', ant_frames[0]))
  ant_image = loadImage('assets/Ant-48color.png')
}

function setup() {
  createCanvas(900, 500);
  ant = createSprite(width / 2, 100, 30, 30);
  ant.addImage('static', ant_image);
  ant.scale = .3;
  ant.rotateToDirection = true;
  home = createSprite(random(width), random(height), 30, 30)
  home.immovable = true
  home.visible = false
  ant.restitution = 1;

  // for (var i = 0; i < 1; i++) {
  //   var x = random(width);
  //   var y = random(height);
  //   let a = createSprite(x, y, 10, 10)
  //   a.addAnimation('walk', ant_walk)
  //   vehicles[i] = new Vehicle(x, y, undefined, a);
  // }

  // for (var i = 0; i < 40; i++) {
  //   var x = random(width);
  //   var y = random(height);
  //   food.push(createVector(x, y));
  // }

  // for (var i = 0; i < 20; i++) {
  //   var x = random(width);
  //   var y = random(height);
  //   poison.push(createVector(x, y));
  // }

  debug = createCheckbox();


  console.log(ant)
  console.log(home)
  ant.attractionPoint(1, home.newPosition.x, home.newPosition.y)
}

function mouseDragged() {
  vehicles.push(new Vehicle(mouseX, mouseY));
}

function draw() {
  clear();
  background(51);
  ant.bounce(home)
  fill(0, 255, 0);
  noStroke();
  ellipse(home.position.x, home.position.y, 4, 4);

  // if (random(1) < 0.1)
  //   var x = random(width);
  //   var y = random(height);
  //   food.push(createVector(x, y));
  // }

  // if (random(1) < 0.01) {
  //   var x = random(width);
  //   var y = random(height);
  //   poison.push(createVector(x, y));
  // }


  // for (var i = 0; i < food.length; i++) {
  //   fill(0, 255, 0);
  //   noStroke();
  //   ellipse(food[i].x, food[i].y, 4, 4);
  // }

  // for (var i = 0; i < poison.length; i++) {
  //   fill(255, 0, 0);
  //   noStroke();
  //   ellipse(poison[i].x, poison[i].y, 4, 4);
  // }

  // for (var i = vehicles.length - 1; i >= 0; i--) {
  //   vehicles[i].boundaries();
  //   vehicles[i].behaviors(food, poison);
  //   vehicles[i].update();
  //   vehicles[i].display();

  //   var newVehicle = vehicles[i].clone();
  //   if (newVehicle != null) {
  //     vehicles.push(newVehicle);
  //   }

  //   if (vehicles[i].dead()) {
  //     var x = vehicles[i].position.x;
  //     var y = vehicles[i].position.y;
  //     food.push(createVector(x, y));
  //     vehicles.splice(i, 1);
  //   }
  // }

  drawSprites()
}
