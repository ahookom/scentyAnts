
function Ant(x, y, group, dna=[]){
  this.setupSprite(x, y)
  group.add(this.sprite)
  this.dna = dna
}

Ant.prototype.setupSprite = function(x,y){
  this.sprite = createSprite(x, y, 30, 30);
  this.sprite.addImage('static', ant_image);
  this.sprite.scale = .3;
  this.sprite.rotateToDirection = true;
  this.sprite.restitution = .8;
  this.sprite.setVelocity(random(-1,1),random(-1,1))
    // ant.attractionPoint(1, home.newPosition.x, home.newPosition.y)
  this.sprite.debug = false
  this.sprite.limitSpeed(1)
  this.sprite.friction=random(.97,1)
}
