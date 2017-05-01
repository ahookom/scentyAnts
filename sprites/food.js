
function newFood(x, y, group, amount, image = appleImage){
  let newFood = createSprite(x, y);
  newFood.addImage(image);
  newFood.scale = .3;
  newFood.amount = amount;
  newFood.setCollider('circle', 0, 0, 300);
  newFood.debug=false;
  group.add(newFood);
  return newFood;
}
