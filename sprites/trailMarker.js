
function foodTrailMarker(x, y){
  let newMarker = createSprite(x, y)
  newMarker.type = 'food'
  newMarker.draw = function(){
    stroke(240)
    ellipse(0, 0, 1)
  }
  newMarker.debug = false
  newMarker.life = 250
  newMarker.setCollider('circle', 0, 0, 20)
  return newMarker
}

function foodIsGoneMarker(x, y){
  let newMarker = createSprite(x, y)
  newMarker.type = 'foodGone'
  newMarker.draw = function(){
    stroke(70)
    ellipse(0, 0, 1)
  }
  newMarker.debug = false
  newMarker.life = 1000
  newMarker.setCollider('circle', 0, 0, 50)
  return newMarker
}

function fightTrailMarker(x, y){
  let newMarker = createSprite(x, y)
  newMarker.type = 'fight'
  newMarker.life = 500
  newMarker.setCollider('circle', 0, 0, 100)
  newMarker.draw = function(){
    noFill()
    stroke(255, 0, 0)
    ellipse(0, 0, 150)
  }
  newMarker.debug = false
  return newMarker
}

function wanderTrailMarker(x, y){
  let newMarker = createSprite(x, y)
  newMarker.type = 'wander'
  newMarker.life = 199
  newMarker.setCollider('circle', 0, 0, 25)
  newMarker.draw = function(){
    noFill()
    stroke(150, 150, 255)
    ellipse(0, 0, 25)
  }
  newMarker.debug = false
  return newMarker
}
