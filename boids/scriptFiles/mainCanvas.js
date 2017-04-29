define(["Ant", "Star", "sketch", "../libraries/p5", "./p5.dom", '../libraries/p5.play'],
	function(Ant, Star, sketch, p5, dom, play) {
		"use strict";

		new p5(function(p) {
			var ants = [];
			var food = [];
			var poison = [];
			var bestAnt = -1;
			var oldestAnt = -1;
			var foodCol, poisonCol;
			var margin = sketch.margin;
			var ant_sprite_image, ant_sprite_sheet, ant_walk, ant_frames;
			console.log(p)
			p.preload = function(){
				ant_frames = p.loadJSON('../assets/ant_sprite_frames.json');
				ant_sprite_sheet = p.loadSpriteSheet('../assets/antSpriteSheet.png', ant_frames);
				ant_walk = loadAnimation(ant_sprite_sheet)
				ant_stand = loadAnimation(new SpriteSheet('../assets/antSpriteSheet.png', ant_frames[0]))
			}

			p.setup = function() {
				var p = sketch.p;

				var canvas = p.createCanvas(window.innerWidth - 360, 600);
				canvas.position(325, 110);

				for (var i = 0; i < 10; ++i) {
					ants[i] = new Ant(p.random(p.width), p.random(p.height));
				}

				for (var i = 0; i < 20; ++i) {
					var x = p.random(margin, p.width - margin);
					var y = p.random(margin, p.height - margin);
					food.push(p.createVector(x, y));
				}

				for (var i = 0; i < 10; ++i) {
					x = p.random(margin, p.width - margin);
					y = p.random(margin, p.height - margin);
					poison.push(new Star(x, y, 1.5, 9, 3));
				}

				foodCol = p.color(0, 255, 0);
				poisonCol = p.color(250, 65, 65);
			};

			p.draw = function() {
				var p = sketch.p;

				p.background(70);
				p.fill(255);
				p.noStroke();

				if (p.random(1) < 0.1) {
					x = p.random(margin, p.width - margin);
					y = p.random(margin, p.height - margin);
					food.push(p.createVector(x, y));
				}

				if (p.random(1) < 0.01) {
					var x = p.random(margin, p.width - margin);
					var y = p.random(margin, p.height - margin);
					poison.push(new Star(x, y, 1.5, 9, 3));
				}

				for (var i = 0; i < food.length; ++i) {
					p.fill(foodCol);
					p.noStroke();
					p.ellipse(food[i].x, food[i].y, 5, 5);
				}

				for (var i = 0; i < poison.length; ++i) {
					p.fill(poisonCol);
					p.noStroke();
					poison[i].show();
				}

				// Call the appropriate steering behaviours for our agents
				for (var i = ants.length-1; i >= 0; --i) {
					ants[i].boundaries();
					ants[i].behaviours(food, poison);
					ants[i].update();
					if (bestAnt === i) {
						ants[i].display(true);
					} else {
						ants[i].display(false);
					}

					var newAnt = ants[i].clone();
					if (newAnt !== null) {
						ants.push(newAnt);
					}

					if (ants[i].dead()) {
						food.push(p.createVector(ants[i].position.x, ants[i].position.y));
						ants.splice(i, 1);
					}
				}

				var bestHealth = 0;
				for (var i = 0; i < ants.length; ++i) {
					if (ants[i].health > bestHealth) {
						bestHealth = ants[i].health;
						bestAnt = i;
					}
				}

				var longestMills = 0;
				var currentMillis = (new Date).getTime();
				for (var i = 0; i < ants.length; ++i) {
					var millis = currentMillis - ants[i].millis;
					if (millis > longestMills) {
						longestMills = millis;
						oldestAnt = i;
					}
				}

				sketch.healthValue = bestHealth.toFixed(3);
				sketch.numFood = food.length;
				sketch.numPoison = poison.length;
				sketch.numAnts = ants.length;

				if (sketch.numAnts === 0) {
					p.background(70);
					p.textFont("Courier");
					p.textSize(25);
					p.fill(255, 200);
					p.text("Game over!", p.width/2.43, p.height * 0.5 - 10);
					sketch.gameOver = true;
					p.noLoop();
				}
			};

			p.mousePressed = function() {
				// Need to transpose the mouseX value to sit correctly relative to the screen
				food.push(p.createVector(p.mouseX - 280, p.mouseY));
			};

			p.keyReleased = function() {
				if (p.keyCode === p.ENTER) {
					sketch.debug = !sketch.debug;
				}
			};

		}, null);

	});
