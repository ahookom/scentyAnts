
function Ant(x, y, group, dna=[]){
  this.perceptionRadius = 100;
  this.dna = dna;
  this.health = 100;
  this.acceleration = createVector(0, 0);
  this.activity = 'wander';
  this.setupSprite(x, y);
  group.add(this.sprite);
}

Ant.prototype.setupSprite = function(x,y){
  this.sprite = createSprite(x, y, 30, 30);
  this.sprite.addImage('static', ant_image);
  this.sprite.scale = .3;
  // this.sprite.setCollider('circle', 0, 0, 10)
  this.sprite.rotateToDirection = true;
  this.sprite.restitution = .8;
  this.sprite.setVelocity(random(-1, 1), random(-1, 1))
  this.sprite.debug = false
  this.sprite.limitSpeed(1)
  // this.sprite.friction=random(.99,1)
  let originalDraw = this.sprite.draw
  this.sprite.draw = this.draw(originalDraw)
}

Ant.prototype.draw = function(originalDraw){
  return function(){
    rotate(PI/2)
    originalDraw()
  }
}
