let trailOffset = 0;
let foodEffectiveness = 5;
let starvationThreshold = 50;
let maxHealth = 100;
let gatheringEffectiveness = 5;
let leaveFrequency = 8;
let defaultStrength = 10;

function newAnt(x, y, home, isRedAnt){
  let newSprite = createSprite(x, y, 30, 30);
  newSprite.isRedAnt = isRedAnt;
  newSprite = setupAntSprite(newSprite);
  newSprite.homePosition = home.position;
  newSprite.hasFoodAmount = 0;
  newSprite.health = maxHealth;
  newSprite.strength = defaultStrength;
  newSprite.minHealth = 80;
  newSprite.activity = 'wander';
  newSprite.leaveFrequency = leaveFrequency;
  newSprite.leaveTrailCounter = trailOffset++ % newSprite.leaveFrequency;
  assignAntMethods(newSprite)
  return newSprite;
}

function Ant(){
  return {};
}

function assignAntMethods(antSprite){
  for (let method in Ant.prototype){
    antSprite[method] = Ant.prototype[method]
  }
}

function setupAntSprite(antSprite){
  antSprite.addImage('static', antSprite.isRedAnt ? redAntImage : brownAntImage);
  antSprite.scale = .3;
  antSprite.setCollider('circle', 0, 0, 10);
  antSprite.rotateToDirection = true;
  antSprite.restitution = .8;
  antSprite.setSpeed(1, random(360));
  antSprite.limitSpeed(1);
  let originalDraw = antSprite.draw;
  antSprite.draw = function(){
    rotate(PI/2)
    originalDraw()
  }
  return antSprite;
}

Ant.prototype.setActivity = function(activity){
  this.activity = activity
}

Ant.prototype.eatHomeSupply = function(antSprite, homeSprite){
  while(this.health < maxHealth && homeSprite.foodSupply > 0){
    homeSprite.foodSupply -= 1;
    this.health += foodEffectiveness;
  }
  this.activity = 'wander';
  if(homeSprite.foodSupply < 1)this.activity = 'frenzy';
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

  if (antSprite.position.dist(foodSprite.position) < 3){

    if (foodSprite.amount < 3){
      this.setActivity('wander')

      if(foodSprite.amount){
        if(this.health < this.minHealth){
          this.health += 5 * foodSprite.amount;
        } else {
        this.hasFoodAmount = foodSprite.amount;
        }
      }
      foodIsGoneMarker(foodSprite.position.x, foodSprite.position.y)
      foodSprite.remove()
      food.remove(foodSprite)

    }else{

      if(this.health < this.minHealth){
        let totalTaken = gatheringEffectiveness + Math.floor((100 - this.health) / foodEffectiveness)
        foodSprite.amount -= totalTaken;
        this.health += foodEffectiveness * totalTaken - 5;
        this.hasFoodAmount = 5;
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

Ant.prototype.leaveTrail = function(){
  if (++this.leaveTrailCounter === this.leaveFrequency){
    if (this.activity === 'harvest'){
      this.leaveTrailCounter = 0
      return foodTrailMarker(this.position.x, this.position.y)
    }
    if (this.activity === 'wander'){
      this.leaveTrailCounter = 0
      return wanderTrailMarker(this.position.x, this.position.y)
    }
  }
  return undefined
}

