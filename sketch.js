//images
let brownAntImage, redAntImage, whiteAntImage, antHillImage, appleImage;
var rock1Image, rock2Image;
var debug;

//sounds
let deathSound, fightSound, biteSound;

//render config settings
var SCENE_W = 400;
var SCENE_H = 300;
let frameCounter = 1;

//play settings
const standardFoodAmount = 50;
const foodForDead = 10;
const initialColonies = 2;
const initialFoodSupply = 10;
let defaultStrength = 1;
let starvationThreshold = 30;
let maxHealth = 100;
let startingRocks = 5;
let startingFood = 10;
let startingAnts = 2;
let foodEffectiveness = 5;
let gatheringEffectiveness = 10;
let defaultHealthCost = .05;
let learningRate = 0.05;

//sprite groups
var bg = [];
var ants = [];
var antSprites = [];
var harvestTrail = [];
var food = [];
let homes = [];
let redAnts = [];
let blackAnts = [];

//HTML elements
let title;

function preload(){
  redAntImage = loadImage('assets/Ant-48red.png');
  brownAntImage = loadImage('assets/Ant-48brown.png');
  whiteAntImage = loadImage('assets/Ant-48white.png');
  antHillImage = loadImage('assets/anthill.png');
  rock1Image = loadImage('assets/Rock.png');
  rock2Image = loadImage('assets/RockShadow.png');
  appleImage = loadImage('assets/redAppleSmall.png');
  deathSound = loadSound('assets/deathRetro.wav');
  fightSound = loadSound('assets/hitSound.wav');
  biteSound = loadSound('assets/crunchyBite.wav');
  title = createDiv('<h3 class=\'align=center\'>Behold! ScentyAnt Life</h3>');
}

function setup(){
  createCanvas(200, 150).parent('canvas-holder');
  title.parent('title');
  deathSound.setVolume(0.02);
  fightSound.setVolume(0.005);
  biteSound.setVolume(0.005);
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

  blackAnts.learn = (antSprite) => learn(antSprite, blackAntDNA);
  redAnts.learn = (antSprite) => learn(antSprite, redAntDNA);

  // make anthill 'homes'
  let widthChunkSize = width * 2 / initialColonies;
  let heightOffset = height / 2;
  let currentChunkBeginning = -width;
  for(let i = 0 ; i < initialColonies; i++){
    homes.add(newHome(currentChunkBeginning + widthChunkSize / 2, heightOffset));
    heightOffset *= -1;
    currentChunkBeginning += widthChunkSize
  }

  //create some background rocks for visual reference
  for(let i = 0; i < startingRocks; i++){
    var rock = createSprite(random(-width,width), random(-height,height));
    //cycles through rocks 0 1 2
    rock.addImage(rock2Image);
    rock.depth = rock.position.y;
    rock.scale= random(.05,.15) + rock.position.y * .0001
    if(rock.overlap(homes)){
      i--;
      rock.remove();
    }else{
      rock.immovable=true
      bg.add(rock);
    }
  }


  //make FOOD
  for (let i = 0; i < startingFood; i++) {
    newFood(random(-width, width), random(-height, height), food, standardFoodAmount)
  }

  //make ANTS
  for (let i = 0; i < homes.length; i++){
    let isRedAnt = !!(i % 2);
    for (let j = 0; j < startingAnts; j++){
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

function turn(antSprite, rock) {
  if(!antSprite.stuckCounter){
    antSprite.stuckCounter = 0
  }
  if(antSprite.stuckCounter < 3){
    antSprite.stuckCounter++;
    let currentVelocity = antSprite.velocity;
    antSprite.setVelocity(currentVelocity.x * .5, currentVelocity.y * .5)
  }else if(antSprite.stuckCounter > 3){
    antSprite.stuckCounter = undefined
    antSprite.activity = 'wander'
    let newVelocity = createVector(antSprite.position.x - rock.position.x, antSprite.position.y - rock.position.y)
    newVelocity.normalize()
    antSprite.setVelocity(newVelocity.x, newVelocity.y)
  }
}

function addAntToFoodSupply(antSprite, homeSprite) {
  homeSprite.foodSupply += foodForDead;
}

function antFight(antSprite1, antSprite2){
  fightSound.setVolume(.01)
  fightSound.play();
  antSprite1.health -= (antSprite2.strength * 5) + (antSprite2.strength * (antSprite2.health / 200))
  antSprite2.health -= (antSprite1.strength * 5) + (antSprite1.strength * (antSprite1.health / 200))
  antSprite1.setVelocity(0,0)
  antSprite2.setVelocity(0,0)
  antSprite1.attractionPoint(.01, antSprite2.position.x, antSprite2.position.y)
  antSprite2.attractionPoint(.01, antSprite1.position.x, antSprite1.position.y)
  // antSprite1.setVelocity(0,0);
  if(antSprite2.health > 0){
    antSprite1.activity = 'fight'
  }else{
    turn(antSprite1)
    antSprite1.activity = 'wander'
  }
  if(antSprite1.health > 0){
    antSprite2.activity = 'fight'
  } else{
    turn(antSprite2)
    antSprite2.activity = 'wander'
  }
}

function reseedAnts(){
  console.log('reds', redAntDNA, 'blacks', blackAntDNA)
  homes[0].foodSupply < homes[1].foodSupply ? homes[0].foodSupply = homes[1].foodSupply : homes[1].foodSupply = homes[0].foodSupply;
  let maxPop = redAnts.length > blackAnts.length ? redAnts.length : blackAnts.length;
  let isRed = redAnts.length < 2;
  let index = isRed ? 1 : 0;
  if(isRed){
    redAntDNA = Object.assign({}, blackAntDNA);
  }else{
    blackAntDNA = Object.assign({}, redAntDNA);
  }
  mutateDNAs();
  for (let j = 1; j < maxPop; j++){
    let ant = newAnt(homes[index].position.x + random(-10, 10), homes[index].position.y + random(-10, 10), homes[index], isRed);
    ants.push(ant);
    antSprites.add(ant);
    if(isRed){
      redAnts.add(ant)
    }else{
      blackAnts.add(ant);
    }
  }
}

function mutateDNAs(){
  for(let gene in redAntDNA){
    redAntDNA[gene] = redAntDNA[gene]*(1 + (random(-1, 1)*learningRate));
  }
  for(let gene in blackAntDNA){
    blackAntDNA[gene] = blackAntDNA[gene]*(1 + (random(-1, 1)*learningRate));
  }
}

function draw() {
  frameCounter++;
  clear();
  background(50, 150, 50);
  ants.bounce(bg, turn);
  bg.displace(food);
  if(frameCounter%2){
    redAnts.collide(blackAnts, antFight);
  } else{
    blackAnts.collide(redAnts, antFight);
  }
  if(redAnts.length < 2 || blackAnts.length < 2) reseedAnts();
  //handle ant game-logic
  for(let index = 0;index < ants.length;index++){
    let antSprite = ants[index];
    let currentVelocity = antSprite.velocity;

    //lower health and incur penalty against faster, stronger, higher health individuals
    antSprite.health -= antSprite.healthCost;

    if(!ants[index])continue;

    //kill dead ants
    if(ants[index].health <= 0){
      deathSound.play();
      let location = antSprite.position;
      if(!antSprite.overlap(homes, addAntToFoodSupply)){
        newFood(location.x, location.y, food, foodForDead, whiteAntImage);
      }
      if(antSprite.isRedAnt){
        redAnts.learn(antSprite);
        redAnts.remove(antSprite);
      }else{
        blackAnts.learn(antSprite);
        blackAnts.remove(antSprite);
      }
      antSprite.remove()
      ants.remove(antSprite)
      continue;
    }

    //this ant is moving slowly, speed him up
    if (currentVelocity.mag() < ants[index].maxSpeed){
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
      //check if the ant made it to one of the antHills
      if (!antSprite.overlap(homes, ants[index].dropFood)){
        ants[index].headHome()
        continue;
      }
    } else
    //an ant is inside the food radius so grab food, go home
    if (antSprite.overlap(food, ants[index].toggleTackleFood)){
      continue;
    } else
    //steer ants that intersect a food trail onto the food trail
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
        let marker = ant.leaveTrail(ant)
        ant.health -= .02;
        if (marker && marker.type === 'food'){
          harvestTrail.add(marker)
        }
      }
      // if (marker && marker.type === 'wander'){
      //   wanderTrail.add(marker)
      // }
    })
  }
  homes.forEach((home, index) => {
    let isRed = !!index;
    let DNA = isRed ? redAntDNA : blackAntDNA;

    if(home.foodSupply > DNA.breedThreshold){
      home.foodSupply -= DNA.breedThreshold;
      let ant = newAnt(home.position.x, home.position.y, home, !!index, DNA.breedThreshold);
      ants.push(ant);
      antSprites.add(ant);
      if(isRed){
        redAnts.add(ant);
      }else{
        blackAnts.add(ant);
      }
    }
  })
  //add new stuff to board
  if (random(1) < 0.005){
    newFood(random(-width, width), random(-height, height), food, standardFoodAmount)
  }

  camera.position.x = 0
  camera.position.y = 0

  if(mouseIsPressed){
    camera.zoom = 1;
    camera.position.x += .7*camera.mouseX;
    camera.position.y += .7*camera.mouseY;
  } else{
    camera.zoom = 0.5;
  }


  drawSprites()

  camera.off();
}
