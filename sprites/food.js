
function newFood(x, y, group, amount, image = appleImage){
  let newFood = createSprite(x, y);
  newFood.addAnimation("apple", image);
  newFood.scale = .1;
  newFood.amount = amount;
  newFood.setCollider('circle', 0, 0, 300);
  newFood.debug=false;
  group.add(newFood);
  return newFood;
}
