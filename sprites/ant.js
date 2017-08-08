let trailOffset = 0;

let blackAntDNA = {
  leaveFrequency: 8,
  starvationThreshold: 30,
  maxHealth: 100,
  maxSpeed: 1,
  strength: 1,
  minHealth: 80,
  breedThreshold: 50,
  turnFactor: 3.1415926 / 6
}

let redAntDNA = Object.assign({}, blackAntDNA)

function learn(antSprite, DNA){
  for(let gene in DNA){
    if(gene!=='breedThreshold')DNA[gene] = DNA[gene] - (DNA[gene] - antSprite[gene]) * learningRate;
  }
}

function newAnt(x, y, home, isRedAnt, newHealth){
  let newSprite = createSprite(x, y, 30, 30);
  newSprite.isRedAnt = isRedAnt;
  newSprite.homePosition = home.position;
  newSprite.hasFoodAmount = 0;
  newSprite.activity = 'wander';
  newSprite.starvationThreshold = isRedAnt ? redAntDNA.starvationThreshold : blackAntDNA.starvationThreshold;
  newSprite.turnFactor = isRedAnt ? redAntDNA.turnFactor : blackAntDNA.turnFactor;
  newSprite.maxHealth = isRedAnt ? redAntDNA.maxHealth : blackAntDNA.maxHealth;
  newSprite.health = newHealth || newSprite.maxHealth;

  newSprite.strength = isRedAnt ? redAntDNA.strength : blackAntDNA.strength;
  newSprite.minHealth = isRedAnt ? redAntDNA.minHealth : blackAntDNA.minHealth;
  newSprite.maxSpeed = isRedAnt ? redAntDNA.maxSpeed : blackAntDNA.maxSpeed;
  newSprite.leaveFrequency = isRedAnt ? redAntDNA.leaveFrequency : blackAntDNA.leaveFrequency;
  newSprite.leaveTrailCounter = trailOffset++ % newSprite.leaveFrequency;
  mutate(newSprite)
  setupAntSprite(newSprite);
  assignAntMethods(newSprite)
  return newSprite;
}

function Ant(){
  return {};
}

function mutate(newSprite){
  newSprite.starvationThreshold *= random(.9, 1.1)
  newSprite.health *= random(.9, 1.1)
  newSprite.turnFactor *= random(.9, 1.1)
  newSprite.strength *= random(.9, 1.1)
  newSprite.minHealth *= random(.9, 1.1)
  newSprite.maxHealth *= random(.9, 1.1)
  newSprite.maxSpeed *= random(.9, 1.1)
  newSprite.leaveFrequency *= random(.9, 1.1);
  newSprite.healthCost = defaultHealthCost +
     .02 * newSprite.strength +
     .02 * newSprite.maxSpeed +
     .01 * (newSprite.maxHealth / 100);
}

function assignAntMethods(antSprite){
  for (let method in Ant.prototype){
    antSprite[method] = Ant.prototype[method]
  }
}

function setupAntSprite(antSprite){
  antSprite.addImage('static', antSprite.isRedAnt ? redAntImage : brownAntImage);
  antSprite.scale = .35 * antSprite.strength;
  antSprite.setCollider('circle', 0, 0, 10);
  antSprite.rotateToDirection = true;
  antSprite.restitution = .7;
  antSprite.setSpeed(1, random(360));
  antSprite.limitSpeed(antSprite.isRedAnt ? redAntDNA.maxSpeed : blackAntDNA.maxSpeed);
  let originalDraw = antSprite.draw;
  antSprite.draw = function(){
    rotate(PI/2)
    originalDraw()
  }
}

Ant.prototype.setActivity = function(activity){
  this.activity = activity
}

Ant.prototype.eatHomeSupply = function(antSprite, homeSprite){
  while(this.health < this.maxHealth && homeSprite.foodSupply > 0){
    homeSprite.foodSupply -= 1;
    this.health += foodEffectiveness;
  }
  this.activity = 'wander';
  if(homeSprite.foodSupply < 1){
    this.activity = 'frenzy';
    let otherHome;
    if(this.homePosition.x === homes[1].position.x){
      otherHome = homes[0].position
    }else{
      otherHome = homes[1].position
    }
    let newVector = createVector(otherHome.x - this.homePosition.x, otherHome.y - this.homePosition.y)
    newVector.normalize()
    newVector.mult(2)
    this.setVelocity(newVector.x, newVector.y)
  }
}

Ant.prototype.headHome = function(){
  let homePath = p5.Vector.sub(this.homePosition, this.position)
  homePath.normalize()
  this.setVelocity(homePath.x, homePath.y)
}

Ant.prototype.headAwayFromHome = function(){
  this.setVelocity(-this.velocity.x, -this.velocity.y)
}

Ant.prototype.followTrail = function(antSprite, trailSprite){
  let homeCenter = this.homePosition;
  let trailCenter = trailSprite.position;
  let newVelocity = trailCenter.sub(homeCenter.x, homeCenter.y)
  newVelocity.normalize()
  antSprite.setVelocity(newVelocity.x, newVelocity.y)
  this.setActivity('harvest')
}

Ant.prototype.dropFood = function(antSprite, homeSprite){
  homeSprite.foodSupply += this.hasFoodAmount
  this.hasFoodAmount = false;
  this.headAwayFromHome()
}

Ant.prototype.toggleTackleFood = function(antSprite, foodSprite){
  if(foodSprite.type==='foodGone'){
    antSprite.setActivity('wander');
    return
  }
  if (antSprite.activity !== 'harvest'){
    antSprite.setActivity('harvest')
  }
  if (antSprite.position.dist(foodSprite.position) < 3){
    if (foodSprite.amount < 3){
      this.setActivity('wander')
      if(foodSprite.amount){
        if(this.health < this.minHealth){
          this.health += 5 * foodSprite.amount;
          biteSound.play()
        } else {
        this.hasFoodAmount = foodSprite.amount;
        }
      }
      food.add(foodIsGoneMarker(foodSprite.position.x, foodSprite.position.y))
      foodSprite.remove()
      food.remove(foodSprite)

    }else{

      if(this.health < this.minHealth){
        let totalTaken = gatheringEffectiveness*this.strength + Math.floor((100 - this.health) / foodEffectiveness)
        foodSprite.amount -= totalTaken;
        this.health += foodEffectiveness * (totalTaken - gatheringEffectiveness * this.strength);
        this.hasFoodAmount = gatheringEffectiveness * this.strength;
      } else {
        foodSprite.amount -= gatheringEffectiveness;
        this.hasFoodAmount = gatheringEffectiveness;
      }
    }
  } else if(!this.hasFoodAmount){

    let vector = createVector(foodSprite.position.x - antSprite.position.x, foodSprite.position.y - antSprite.position.y);
    vector.normalize();
    vector.mult(.5)
    antSprite.setVelocity(vector.x, vector.y)
  }
}

Ant.prototype.leaveTrail = function(ant){
  if (++ant.leaveTrailCounter >= ant.leaveFrequency){
    if (ant.activity === 'harvest'){
      ant.leaveTrailCounter = 0
      return foodTrailMarker(ant.position.x, ant.position.y)
    }
  }
  return undefined
}

