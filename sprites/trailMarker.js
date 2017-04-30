
function foodTrailMarker(x, y){
  let newMarker = createSprite(x, y)
  newMarker.type = 'food'
  newMarker.draw = function(){
    noFill()
    stroke(255)
    ellipse(0, 0, 2)
  }
  newMarker.debug = false
  newMarker.life = 250
  newMarker.setCollider('circle', 0, 0, 25)
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
