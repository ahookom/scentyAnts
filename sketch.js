var vehicles = [];
var food = [];
var poison = [];
var ant_sprite_image, ant_sprite_sheet, ant_walk, ant_frames, ant_image, antHillImage, appleImage;
var debug;

let home;
var SCENE_W = 600;
var SCENE_H = 400;
var frame;

var bg;
var ants =[];
var antSprites;
var foodTrail = [];
var food = [];

var rock1, rock2;

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
  antHillImage = loadImage('assets/anthill.png')
  rock1 = loadImage('assets/Rock.png')
  rock2 = loadImage('assets/RockShadow.png')
  appleImage = loadImage('assets/red-apple.png')
}

function setup() {
  createCanvas(600, 400);

  // ant.rotationSpeed = 1;
  home = createSprite(random(width), random(height), 30, 30)
  home.immovable = true;
  home.visible = true;
  home.depth = home.position.y+10
  home.addImage('anthill', antHillImage)
  home.scale = 0.1
  home.setCollider("circle",0,0,15)
  let homeDrawTemp = home.draw
  home.draw = function(){
    homeDrawTemp()
  }


  bg = new Group();

  //create some background for visual reference
  for(let i=0; i<80; i++)
  {
  //create a sprite and add the 3 animations
  var rock = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height));
  //cycles through rocks 0 1 2
  rock.addAnimation("normal", "assets/RockShadow.png");
  rock.depth = rock.position.y;
  rock.scale= random(.1,.2)+rock.position.y*.0001
  rock.immovable=true
  bg.add(rock);
}

  food = new Group()
  for (let i = 0; i < 10; i++) {
    let newFood = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height))
    newFood.addAnimation("apple", appleImage)
    newFood.scale = .1
    newFood.setCollider('circle',0,0,300)
    newFood.debug=true
    food.add(newFood);
  }

  // for (var i = 0; i < 20; i++) {
  //   var x = random(width);
  //   var y = random(height);
  //   poison.push(createVector(x, y));
  // }

  debug = createCheckbox();
  antSprites = new Group()
  for(var i=0; i<10; i++){
    var ant = new Ant(home.position.x, home.position.y, antSprites)
    ants.push(ant)
  }

}

function mouseDragged() {
  vehicles.push(new Vehicle(mouseX, mouseY));
}

function draw() {
  clear();
  background(50,150,50);

  antSprites.collide(bg)
  antSprites.collide(food)
  if(antSprites.overlap(food)){
    ant.visible=false;
    ant.setSpeed(0,0);
  }

  camera.position.x = home.position.x
  camera.position.y = home.position.y
  if(mouseIsPressed)
    camera.zoom = .5;
  else
    camera.zoom = 1;
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
  camera.off();
}
