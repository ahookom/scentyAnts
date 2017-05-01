//images
let brownAntImage, redAntImage, whiteAntImage, antHillImage, appleImage;
var rock1Image, rock2Image;
var debug;

//game config settings
var SCENE_W = 600;
var SCENE_H = 400;
let frameCounter = 1;
const standardFoodAmount = 40;
const foodForDead = 10;
const initialPopSize = 20;
const initialColonies = 2;
const currentHomeFocus = 0;
const initialFoodSupply = 10;

//sprite groups
var bg=[];
var ants =[];
var antSprites=[];
var harvestTrail = [];
let wanderTrail = [];
var food = [];
let homes = [];
let redAnts=[];
let blackAnts=[];

function preload(){
  redAntImage = loadImage('assets/Ant-48red.png');
  brownAntImage = loadImage('assets/Ant-48brown.png');
  whiteAntImage = loadImage('assets/Ant-48white.png');
  antHillImage = loadImage('assets/anthill.png');
  rock1Image = loadImage('assets/Rock.png');
  rock2Image = loadImage('assets/RockShadow.png');
  appleImage = loadImage('assets/red-apple.png');
}

function setup() {
  createCanvas(300, 200);
  //establish sprite groups
  homes = new Group();
  bg = new Group();
  harvestTrail = new Group();
  wanderTrail = new Group();
  food = new Group();
  antSprites = new Group();
  blackAnts = new Group();
  redAnts = new Group();
  ants = new Group();

  // make anthill 'homes'
  let widthChunkSize = width * 2 / initialColonies;
  let heightOffset = height / 2;
  let currentChunkBeginning = -width;
  for(let i = 0 ; i < initialColonies; i++){
    homes.add(newHome(currentChunkBeginning + widthChunkSize / 2, heightOffset));
    heightOffset*=-1;
    currentChunkBeginning+=widthChunkSize
  }

  //create some background rocks for visual reference
  for(let i = 0; i < 1; i++){
    var rock = createSprite(random(-width,width), random(-height,height));
    //cycles through rocks 0 1 2
    rock.addImage(rock2Image);
    rock.depth = rock.position.y;
    rock.scale= random(.1,.2)+rock.position.y*.0001
    rock.immovable=true
    bg.add(rock);
  }


  //make FOOD

  for (let i = 0; i < 10; i++) {
    newFood(random(-width, width), random(-height, height), food, standardFoodAmount)
  }

  debug = createCheckbox();

  //make ANTS

  for (let i = 0; i < homes.length; i++){
    let isRedAnt = !!(i % 2);
    for (let j = 0; j < initialPopSize; j++){
      let ant = newAnt(homes[i].position.x + random(-10, 10), homes[i].position.y + random(-10, 10), homes[i], isRedAnt);
      ants.push(ant);
      antSprites.add(ant);
      if(isRedAnt){
        redAnts.add(ant)
      }else{
        blackAnts.add(ant);
      }
    }
  }
}

// function mouseDragged() {
//   vehicles.push(new Vehicle(mouseX, mouseY));
// }

function turn(antSprite) {
  antSprite.setSpeed(0.5, random(360))
}

function addAntToFoodSupply(antSprite, homeSprite) {
  homeSprite.foodSupply += foodForDead;
}

function antFight(antSprite1, antSprite2){
  antSprite1.health -= antSprite2.strength * .5 + antSprite2.strength * antSprite2.health / 200
  antSprite2.health -= antSprite1.strength * .5 + antSprite1.strength * antSprite1.health / 200
  antSprite1.attractionPoint(.1, antSprite2.position.x, antSprite2.position.y)
  antSprite2.attractionPoint(.1, antSprite1.position.x, antSprite1.position.y)
  if(antSprite2.health > 0){
    antSprite1.activity = 'fight'
  }else{
    antSprite1.activity = 'wander'
  }
  if(antSprite1.health > 0){
    antSprite2.activity = 'fight'
  } else{
    antSprite2.activity = 'wander'
  }
}

function draw() {
  frameCounter++;
  clear();
  background(50, 150, 50);
  ants.collide(bg, turn);
  if(frameCounter%2){
    redAnts.displace(blackAnts, antFight);
  } else{
    blackAnts.displace(redAnts, antFight);
  }
  //handle ant game-logic
  for(let index = 0;index < ants.length;index++){
    let antSprite = ants[index];
    let currentVelocity = antSprite.velocity;
    antSprite.health -= 0.1
    if(!ants[index])continue;

    //kill dead ants
    if(ants[index].health < 1){
      let location = antSprite.position
      if(!antSprite.overlap(homes, addAntToFoodSupply)){
        newFood(location.x, location.y, food, foodForDead, whiteAntImage);
      }
      antSprite.remove()
      ants.remove(antSprite)
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
    if(ants[index].health < starvationThreshold && ants[index].activity !== 'feed'){
      ants[index].headHome();
      ants[index].setActivity('feed');
    } else
    //checks if the starving ant made it home lets him eat if he did (unless no food)
    if(ants[index].activity === 'feed' && antSprite.overlap(homes, ants[index].eatHomeSupply.bind(ants[index]))){
      continue;
    }

    //the ant hits the edge of the board, turn him around
    if (abs(antSprite.position.x) > width){
      antSprite.setVelocity(currentVelocity.x*-1, currentVelocity.y)
    }
    if (abs(antSprite.position.y) > height){
      antSprite.setVelocity(currentVelocity.x, currentVelocity.y*-1)
    }

    //an ant with food should be on the way home. If it makes it home, it will drop it off in the overlap callback function and continue harvesting
    if (ants[index].hasFoodAmount && ants[index].hasFoodAmount > 0){
      if (!antSprite.overlap(homes, ants[index].dropFood)){

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
      continue;
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

  camera.position.x = 0
  camera.position.y = 0
  if(mouseIsPressed)
    camera.zoom = 1;
  else
    camera.zoom = 0.5;

  // if (random(1) < 0.1)
  //   var x = random(width);
  //   var y = random(height);
  //   food.push(createVector(x, y));
  // }

  drawSprites()
  camera.off();
}
