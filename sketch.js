var vehicles = [];
var food = [];
var poison = [];
var ant_sprite_image, ant_sprite_sheet, ant_walk, ant_frames, ant_image, antHillImage, appleImage;
var debug;

let home;
var SCENE_W = 500;
var SCENE_H = 400;
let frameCounter = 1;
let standardFoodAmount = 60;
let foodForDead = 10;

var bg;
var ants =[];
var antSprites;
var harvestTrail = [];
let wanderTrail = [];
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
  createCanvas(500, 400);
  console.log('width', width,'height', height)
  // make Anthill 'home'
  home = createSprite(0, 0)
  home.immovable = true;
  home.visible = true;
  home.depth = home.position.y + 10
  home.addImage('anthill', antHillImage)
  home.scale = 0.1
  home.setCollider("circle", 0, 0, 20)
  let homeDrawTemp = home.draw
  home.draw = function(){
    homeDrawTemp()
  }
  home.foodSupply = 10;

  bg = new Group();

  //create some background rocks for visual reference
  for(let i = 0; i < 1; i++){
    var rock = createSprite(random(-width,width), random(-height,height));
    //cycles through rocks 0 1 2
    rock.addAnimation("normal", "assets/RockShadow.png");
    rock.depth = rock.position.y;
    rock.scale= random(.1,.2)+rock.position.y*.0001
    rock.immovable=true
    bg.add(rock);
  }
  harvestTrail = new Group()
  wanderTrail = new Group()

  //make FOOD
  food = new Group()
  for (let i = 0; i < 25; i++) {
    newFood(random(-width, width), random(-height, height), food, standardFoodAmount)
  }

  debug = createCheckbox();

  //make ANTS
  antSprites = new Group()
  for(var i = 0; i < 10; i++){
    var ant = new Ant(home.position.x + random(-10,10), home.position.y + random(-10,10), antSprites)
    ants.push(ant)
  }

}

// function mouseDragged() {
//   vehicles.push(new Vehicle(mouseX, mouseY));
// }

function turn(antSprite) {
  antSprite.setSpeed(0.2, random(360))
}


function draw() {
  frameCounter++;
  clear();
  background(50, 150, 50);

  antSprites.collide(bg, turn)

  //handle ant game-logic
  for(let index = 0;index < ants.length;index++){
    let antSprite = ants[index].sprite;
    let currentVelocity = antSprite.velocity
    if(!ants[index])continue;

    //kill dead ants
    if(ants[index].health < 1){
      let location = antSprite.position
      if(!antSprite.overlap(home)){
        newFood(location.x, location.y, food, foodForDead);
      }else{
        home.foodSupply += 10;
      }
      ants = ants.slice(0, index)
      ants = ants.concat(ants.slice(index + 1))
      antSprite.remove()
      antSprites.remove(antSprite)
      continue;
    }

    //this ant is moving slowly, speed him up
    if (currentVelocity.mag() < 1){
      currentVelocity.mult(1.05)
    } else

    if (currentVelocity.mag() === 0){
      currentVelocity.add(createVector(random(-.1,.1), random(-.1,.1)))
    }
    //this ant is starving. send him home to use the foodSupply
    if(ants[index].health < starvationThreshold){
      ants[index].headHome();
      ants[index].setActivity('feed');
    }
    //checks if the starving ant made it home lets him eat if he did
    if(ants[index].activity === 'feed' && antSprite.overlap(home, ants[index].eatHomeSupply.bind(ants[index])))

    //the ant hits the edge of the board, turn him around
    if (abs(antSprite.position.x) > width){
      antSprite.setVelocity(currentVelocity.x*-1, currentVelocity.y)
    } else
    if (abs(antSprite.position.y) > height){
      antSprite.setVelocity(currentVelocity.x, currentVelocity.y*-1)
    }

    //an ant with food should be on the way home. If it makes it home, it will drop it off in the overlap callback function and continue harvesting
    if (ants[index].hasFoodAmount && ants[index].hasFoodAmount > 0){
      if (!antSprite.overlap(home, ants[index].dropFood)){

        ants[index].headHome()
        continue;
      }
    } else
    //an ant is inside the food radius so grab food, go home
    if (antSprite.overlap(food, ants[index].toggleTackleFood)){
      if (ants[index].activity !== 'harvest'){
        ants[index].setActivity('harvest')
      }
    } else

    if (ants[index].activity !== 'harvest' && antSprite.overlap(harvestTrail, ants[index].followTrail)){
      ants[index].setActivity('harvest')
    } else

    if (ants[index].activity === 'wander'){
      //handle ants who haven't found the path or the food and are freely wandering
      currentVelocity.rotate(random(-PI/6, PI/6))
    }
  }

  //handle Trails
  if (frameCounter % 10 === 0){
    frameCounter = 1
    ants.forEach(ant => {
      if(ant.activity==='harvest'){
        let marker = ant.leaveTrail()
        ant.health -= .05;
        if (marker && marker.type === 'food'){
          harvestTrail.add(marker)
        }
      }
      // if (marker && marker.type === 'wander'){
      //   wanderTrail.add(marker)
      // }
    })
  }

  camera.position.x = home.position.x
  camera.position.y = home.position.y
  if(mouseIsPressed)
    camera.zoom = .50;
  else
    camera.zoom = 1;

  // if (random(1) < 0.1)
  //   var x = random(width);
  //   var y = random(height);
  //   food.push(createVector(x, y));
  // }

  drawSprites()
  camera.off();
}
