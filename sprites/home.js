function newHome(x, y){
  let newHome = createSprite(x, y)
  newHome.immovable = true;
  newHome.visible = true;
  newHome.depth = newHome.position.y + 10;
  newHome.addImage('anthill', antHillImage);
  newHome.scale = 0.1;
  newHome.setCollider("circle", 0, 0, 20);
  newHome.foodSupply = initialFoodSupply;
  return newHome;
}
