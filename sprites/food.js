
function newFood(x, y, group, amount, image){
  let newFood = createSprite(x, y);
  if(image){
    newFood.addImage(image);
    newFood.scale = .4;
  }else{
    newFood.addImage(appleImage)
    newFood.scale = .3;
  }
  newFood.amount = amount;
  newFood.setCollider('circle', 0, 0, 100);
  newFood.debug=false;
  group.add(newFood);
  return newFood;
}
