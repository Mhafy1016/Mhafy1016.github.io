///////////////////////////////////////////////////////////////////////////////////////////////////////


/////// G L O B A L - V A R I A B L E S /////////

var pClip = {};

var enemy = [];
var eClip = {};

var boss = {};

var carried = {};
var smoke = {};
var debris = {};

var showHitBoxes = false;

var shooting = false;

var spawnTick = 0, maxSpawnTick = 75;

var points = 0, bestPoints = 0;

var itemTime = 0, nextItem = 1000;
var second = 60;
var pause = false, resumeCountdown = 3, resume = false;

var play = false;


var bossUnvulnerable = true, bossIntro = false, bossOutro = false, bossSpawned = false, spawnBoss = false, retreat = false;


var updates = function(){
	if(localStorage.bp == undefined){
		bestPoints = 0;
	}else{
		bestPoints = localStorage.bp;
	}
	
	
	if(!play){
		gui.draw("menu");
		
		for(var btn in buttons){
			if(mouse.mx - 440 >= buttons[btn].x && mouse.mx - 440 <= buttons[btn].x + buttons[btn].width && mouse.my - 7 >= buttons[btn].y && mouse.my - 7 <= buttons[btn].y + buttons[btn].height){
				buttons[btn].color = "gray";
				if(mouse.click){
					if(buttons[btn].txt == lang.eng.play){
						playSound('sound/pop.wav', 1, Math.random());
						play = true;
						delete buttons[btn];
					}
					
					if(buttons[btn].txt == lang.eng.reset){
						localStorage.clear();
						buttons[btn].color = "gray";
					}
				}
			}else{
				buttons[btn].color = "white";
			}
			buttons[btn].draw();

		
		}
		
	}else{
	
		stage.start(AREA.GURK);

		backImage.draw("gurk");
	
		setTimeout(function(){
			if(!spawnBoss){
				if(stage.enemySpawn < stage.maxEnemyCount){
					for(var i = 0; i < Math.floor(Math.random()*stage.maxEnemyCount)+1; i++)
						createEnemy(Math.random(), (Math.random()*(W - 64)), -64, 100, "random");
					stage.enemySpawn += i;
				}
			}
			
		}, maxSpawnTick);
	
	
		if(!spawnBoss){
			if(stage.time >= stage.bossTime){
				spawnBoss = true;
				bossSpawned = true;
			}
		}
	
	
	
	
	
		updateEntities();
	
		if(shooting){
			player.shoot();
		}
	
	
	
	
		if(pause){
		
			if(!resume){
				createText(lang.eng.paused, 240, 240, 98, "white", "center");
			}
		
			else if(resume){
				if(resumeCountdown != 0){
					createText(resumeCountdown, 240, 240, 48, "white", "left");
				
				}else{
					second = 60;
					resumeCountdown = 3;
					resume = false;
					pause = false;
				}
				
				second--;
				if(second <= 0){
					second = 60;
					resumeCountdown--;
				}
			}
		}
		
		if(!pause){
			if(player.alive){
				points += 3;
				stage.time += 1;
			}
		}
		
		
		
		
		//document.getElementById("xy").innerHTML = points;
		createText(points, 5, 45, 40, "white", "left");
	}
	
	if(!play || pause){
		mouse.draw();
	}
	
	if(!player.alive){
		if(points >= bestPoints){
			bestPoints = points;
			
			localStorage.setItem("bp", points);
		}
	}else{
		if(play){
			itemTime--;
			if(itemTime <= 0){
				itemTime = nextItem;
				carrier((Math.random()*(W - 64)), -64, Math.floor(Math.random()*3)+1);
			}
		}
	}
	resetAll();
	
		createText(stage.enemySpawn+"["+itemTime+"]  "+stage.round+"["+stage.time+", "+stage.bossTime+"]", 10, H - 10, 10, "white", "left");
}






var AREA = {
	GURK : "gurk",
	EX1MG : "ex1mg"
	
}




var stage = {
	round : 1,
	clear : false,
	
	time : 0,
	bossTime : 0,
	enemySpawn : 0, 
	maxEnemyCount : 0,
	load : true,
	start : function(place){
		if(place == AREA.GURK){
			if(this.load){
				enemy = {};
				this.time = 0;
				this.bossTime += 100000;
				this.enemySpawn = 0;
				this.maxEnemyCount = 5;
				
				this.load = false;
				
				bossUnvulnerable = true, 
				bossIntro = false, 
				bossOutro = false, 
				bossSpawned = false, 
				spawnBoss = false, 
				retreat = false;
			}
		}
		
	
	}
	
	
}





























///////////// B A C K - G R O U N D ////////////

var backImage = {
	image : new Image(),
	y1 : 0,
	y2 : 0,
	draw : function(area){
		this.image.src = "sprites/background/"+area+".png";
		
		if(!pause){
			this.y1 += 0.5;
			this.y2 += 05;
			
			if(this.y1 >= H){
				this.y1 = 0;
			}	
			if(this.y2 >= H){
				this.y2 = 0;
			}
		}
		
		ctx_back.drawImage(this.image, 0, this.y1);
		ctx_back.drawImage(this.image, 0, this.y1 - this.image.height);
	}
}






////////// P L A Y E R ///////////

var player = {
	alive : true,
	canShoot : true,
	canMove : true,
	status : 100,
	
	x : 192,
	y : 566,
	toX : 0,
	toY : 0,
	dir : 0,
	speed : 10,
	
	shield : false,
	shieldStatus : 3,
	
	hitSize : 0,
	
	blasterCount : 1,
	
	image : new Image(),
	animate : true,
	animTick : 0,
	maxAnimTick : 10,
	animation : 0,
	frame : 0,
	maxFrame : 6,
	
	frameWidth : 96,
	frameHeight : 64,
	
	shootCoolDown : 0,
	maxShootCoolDown : 10,
	
	explosion : true,
	explosionCount : 10,
	
	draw : function(){
		this.image.src = "sprites/sprite.png";
		ctx_mid.drawImage(this.image, this.animation * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
		
		this.hitSize = (this.frameWidth + this.frameHeight) / 5;

		if(showHitBoxes){
			ctx_mid.fillStyle = "rgba(200, 0, 0, 0.5)";
			ctx_mid.fillRect(this.x + 32, this.y + 10, this.hitSize, this.hitSize);
		}
			
		if(this.animate){
			this.animTick--;
			if(this.animTick <= 0){
				this.animTick = this.maxAnimTick;
				this.animation = ++this.frame % this.maxFrame;
			}
		}
		
		if(this.status <= 0){
			this.status = 0;
			this.alive = false;
		}
		
		if(this.shield){
			ctx_mid.beginPath();
			if(this.shieldStatus == 3){
				ctx_mid.fillStyle = "rgba(0, 250, 0, 0.5)";
			}
			if(this.shieldStatus == 2){
				ctx_mid.fillStyle = "rgba(250, 150, 0, 0.5)";
			}
			if(this.shieldStatus == 1){
				ctx_mid.fillStyle = "rgba(250, 50, 0, 0.5)";
			}
			ctx_mid.arc(this.x + (this.frameWidth/2), this.y + (this.frameHeight/2), 64, 0, Math.PI * 2)
			ctx_mid.fill();
			ctx_mid.closePath();
			
			if(this.shieldStatus <= 0){
				this.shield = false;
			}
			
		}
		
		
		
		//this.dir = Math.atan2(this.y - this.toY, this.x - this.toX);
		//this.x -= this.speed * Math.cos(this.dir);
		//this.y -= this.speed * Math.sin(this.dir);
		
		
		
		
	},
	
	shoot : function(){
		if(!pause){
			if(this.canShoot){
					this.shootCoolDown--;
					if(this.shootCoolDown < 0){
						this.shootCoolDown = this.maxShootCoolDown;
						playSound('sound/shoot(player).wav', 0.2, Math.random());
						for(var i = 0; i < this.blasterCount; i++)
							createPBullet((this.x + (this.frameWidth / 2)) - (10 * (this.blasterCount - 1)) + (20 * i), this.y, 20, 50, "skyblue", this.blasterCount, Math.random());
					}
			}
		}
		
	},
	
	explode : function(){
		
		if(this.explosion){
			this.explosionCount--;
			for(var i = 0; i < (Math.random()*10)+5; i++){
					createDebris(player.x + (player.frameWidth / 2), player.y + (player.frameHeight / 2), (Math.random()*10)+3, "skyblue", "none", (Math.random()*5)+1, 360, Math.random());
					createDebris(player.x + (player.frameWidth / 2), player.y + (player.frameHeight / 2), (Math.random()*5)+3, "rgb(192, 192, 192)", "none", (Math.random()*5)+1, 360, Math.random());
			}
		}
		
		if(this.explosionCount <= 0){
			this.explosion = false;
			this.explosionCount = 0;
		}
	}
};











///////// E N E M Y //////////

var createEnemy = function(ID, X, Y, STATUS, FORMATION){
	var e = {
		x : X,
		y : Y,
		speed : (Math.random()*2)+2,
		maxY : (Math.random()*200) + 20,
		color : "red",
		status : STATUS,
		formation : FORMATION,
		alive : true,
		canShoot : true,
		
		angle : 0,
		rndm : (Math.floor(Math.random()*120)+30),
		
		image : new Image(),
		animTick : 0,
		maxAnimTick : 10,
		animation : 0,
		col : 0,
		frame : 0,
		maxFrame : 8,
		
		shooting : false,
		
		frameWidth : 64,
		frameHeight : 64,
		
		shootCoolDown : 0,
		maxShootCoolDown : 75,
		
		id : ID,
		draw : function(){
			
			if(showHitBoxes){
				ctx_mid.fillStyle = "rgba(200, 200, 0, 0.5)";
				ctx_mid.fillRect(this.x, this.y, this.frameWidth, this.frameHeight);
			}
			
			this.image.src = "sprites/enemies/gurk-sprite.png";
			ctx_mid.drawImage(this.image, this.animation * this.frameWidth, this.col * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
			
			
			
			this.animTick--;
			if(this.animTick <= 0){
				this.animTick = this.maxAnimTick;
				this.animation = ++this.frame % this.maxFrame;
				
				if(this.shooting && this.animation >= 4){
					this.shooting = false;
				}
			}
			
			if(!pause){
				if(this.formation == "random"){
				
					this.y += this.speed;
					
					setTimeout(function(){
						e.maxY = H + 96;
						e.speed = 7;
						e.canShoot = false;
					}, 5000);
				}
			
				if(this.formation == "scatter"){
					this.maxY = 200;
					this.angle = this.rndm * (Math.PI / 180);
					this.y += this.speed;
					this.x += (this.speed * 2) * Math.cos(this.angle);
				}
			}
			
		},
		
		shoot : function(){
			if(!pause){
				if(this.canShoot){
					this.shootCoolDown--;
					if(this.shootCoolDown <= 0){
						this.shootCoolDown = this.maxShootCoolDown;
						playSound('sound/shoot(enemy).wav', 1, Math.random());
						this.animation = 0;
						this.shooting = true;
						createEBullet(this.x + (this.frameWidth / 2), this.y + this.frameHeight - 10, Math.floor(Math.random()*5)+3, Math.floor(Math.random()*10)+30, "lime", Math.random(), player.x, player.y, this.x, this.y, "direct");
					}
				}
				
			}
			
			if(this.shooting){
				this.col = 1;
				this.maxFrame = 4;
			}
			if(!this.shooting){
				this.col = 0;
				this.maxFrame = 8;
			}
		},
		
		explode : function(){
			for(var i = 0; i < (Math.random()*10)+5; i++){
				createDebris(this.x + (this.frameWidth / 2), this.y + (this.frameHeight / 2), (Math.random()*10)+3, "none", this.image, 5, 360, Math.random());
				createDebris(this.x + (this.frameWidth / 2), this.y + (this.frameHeight / 2), (Math.random()*10)+3, "lime", "none", (Math.random()*5)+1, 360, Math.random());
			}
		}
	}
	enemy[e.id] = e;
}








var bossType = {
	GURK : "gurk"
}




var createBoss = function(ID, X, Y, TYPE){
	var b = {
		image : new Image(),
		src : "",
		id : ID,
		x : X,
		y : Y,
		moveX : 0,
		moveY : 0,
		status : 100000000000000000000,
		load : true,
		type : TYPE,
		
		explodeTick : 0,
		maxExplodeTick : 25,
		
		canShoot : true,
		shootCoolDown : 0,
		maxShootCoolDown : 70,
		
		bulletFired : 0,
		maxBulletFired : 0,
		
		animate : false,
		animationName : "idle",
		animTick : 0,
		maxAnimTick : 10,
		animation : 0,
		frame : 0,
		maxFrame : 10,
		
		hurt : false,
		
		draw : function(){
			this.image.src = this.src;
			ctx_mid.drawImage(this.image, this.x, this.y, 300, 158);
			if(this.type == bossType.GURK){
				this.src = "sprites/enemies/bosses/GURK/"+this.animationName+"_"+this.animation+".png";
				
				if(showHitBoxes){
					ctx_mid.fillStyle = "rgba(0, 200, 0, 0.5)";
					ctx_mid.fillRect(this.x, this.y, 300, 158);
				}
				
				if(!bossUnvulnerable){
					if(this.x > player.x - 100){
						this.x -= 0.5;
					}
					if(this.x < player.x - 100){
						this.x += 0.5;
					}
				}
				
				if(this.animate){
					this.animTick--;
					if(this.animTick <= 0){
						this.animTick = this.maxAnimTick;
						this.animation = ++this.frame % this.maxFrame;
				
					}
				}else{
					this.animTick = 0;
					this.animation = 0;
				}
				
				if(this.status < 1500){
					if(!this.hurt){
						this.animate = true;
						this.animationName = "move";
						
						setTimeout(function(){
							b.animate = false;
							b.hurt = true;
						}, 10000);
					}
				}
				
				
				if(this.load){
					this.load = false;
					this.status = 5000;
				}
			}
		},
		
		shoot : function(){
			if(!pause){
				if(this.type == bossType.GURK){
					if(this.canShoot){
						this.shootCoolDown--;
						if(this.shootCoolDown <= 0){
							this.shootCoolDown = this.maxShootCoolDown;
						
							
							if(this.status > 1500){
								this.bulletFired = 0;
								this.maxBulletFired = 20;
								this.maxShootCoolDown = 100;
							}else{
								this.bulletFired = 0;
								this.maxBulletFired = Math.floor(Math.random()*5)+5;
								this.maxShootCoolDown = 400;
								
								
							}
						}	
					}
				
					if(this.bulletFired != this.maxBulletFired){
						this.bulletFired++;
						if(this.status > 1500){
							createEBullet(this.x + 150, this.y + 158, Math.floor(Math.random()*3)+3, Math.floor(Math.random()*10)+30, "lime", Math.random(), player.x, player.y, this.x, this.y, "random");
						}else{
							createEnemy(Math.random(), this.x + 150, this.y + 79, 100, "scatter");
						}
					}
				}
			}
			
		},
		
		explode : function(){
			this.explodeTick--;
			if(this.explodeTick <= 0){
				this.explodeTick = this.maxExplodeTick;
				for(var i = 0; i < (Math.random()*10)+5; i++){
					createDebris(this.x + (Math.random()*290), this.y + (Math.random()*140), (Math.random()*10)+3, "none", this.image, 5, 360, Math.random());
					createDebris(this.x + (Math.random()*290), this.y + (Math.random()*140), (Math.random()*10)+3, "none", this.image, 5, 360, Math.random());
					createDebris(this.x + (Math.random()*290), this.y + (Math.random()*140), (Math.random()*10)+3, "none", this.image, 5, 360, Math.random());
					createDebris(this.x + (Math.random()*290), this.y + (Math.random()*140), (Math.random()*10)+3, "lime", "none", (Math.random()*5)+1, 360, Math.random());
					createDebris(this.x + (Math.random()*290), this.y + (Math.random()*140), (Math.random()*10)+3, "lime", "none", (Math.random()*5)+1, 360, Math.random());
					createDebris(this.x + (Math.random()*290), this.y + (Math.random()*140), (Math.random()*10)+3, "lime", "none", (Math.random()*5)+1, 360, Math.random());
				}
			}
		}
	}
	
	boss[b.id] = b;
}














var buttons = {};
var createBtn = function(X, Y, WIDTH, HEIGHT, COLOR, TEXT, TEXTSIZE, ID){
	var btn = {
		x : X,
		y : Y,
		width : WIDTH,
		height : HEIGHT,
		color : COLOR,
		txt : TEXT,
		txtSize : TEXTSIZE,
		id : ID,
		
		draw : function(){
			ctx_front.strokeStyle = this.color;
			createText(this.txt, this.x + (this.width / 2), this.y + (this.height / 2) + (this.txtSize / 3), this.txtSize, this.color, "center");
			ctx_front.strokeRect(this.x, this.y, this.width, this.height);
			
		}
	}
	buttons[btn.id] = btn;
}














var sound = {};
var playSound = function(SRC, VOLUME, ID){
	var s = {
		sound : new Audio(SRC),
		volume : VOLUME,
		id : ID,
		play : function(){
			this.sound.volume = this.volume;
			this.sound.play();
		}
	}
	
	sound[s.id] = s;
}





var carrier = function(X, Y, ID){
	var item = {
		image : new Image(),
		frameWidth : 64,
		frameHeight : 32,
		animTick : 0,
		maxAnimTick : 10,
		animation : 0,
		frame : 0,
		maxFrame : 3,
		
		x : X,
		y : Y,
		
		type : Math.floor(Math.random()*3)+1,
		shieldDuration : 100,
		statusRecovery : 100,
		plusPoints : (Math.floor(Math.random()*5)+1) * 2000,
		used : false,
		get : true,
		
		id : ID,
		draw : function(){
			if(!this.used){
				this.animTick--;
				if(this.animTick <= 0){
					this.animTick = this.maxAnimTick;
					this.animation = ++this.frame % this.maxFrame;
					
				}
			
				this.y += 5;
			
				this.image.src = "sprites/carrier/sprite.png";
				ctx_mid.drawImage(this.image, this.animation * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
			
				//ctx_mid.fillStyle = "red";
				//ctx_mid.fillRect(this.x, this.y, 5, 15);
				//ctx_mid.fillRect(this.x - 5, this.y + 5, 15, 5);
			}
		},
		
		acquired : function(){
			if(this.get){
				for(var i = 0; i < 45; i++){
					createDebris(player.x + (player.frameWidth / 2), player.y + (player.frameHeight / 2), (Math.random()*10)+3, "skyblue", "none", (Math.random()*5)+1, 360, Math.random());
					createDebris(player.x + (player.frameWidth / 2), player.y + (player.frameHeight / 2), (Math.random()*5)+3, "rgb(192, 192, 192)", "none", (Math.random()*5)+1, 360, Math.random());
				}
				
				if(this.type == 1){
					player.shield = true;
					player.shieldStatus = 3;
					createPopUp(player.x + (player.frameWidth / 2), player.y + (player.frameHeight / 2), "Shield", 50, Math.random());
				}
				
				if(this.type == 2){
					player.status = this.statusRecovery;
					createPopUp(player.x + (player.frameWidth / 2), player.y + (player.frameHeight / 2), "Recovered", 50, Math.random());
				}
				
				if(this.type == 3){
					points += this.plusPoints;
					createPopUp(player.x + (player.frameWidth / 2), player.y + (player.frameHeight / 2), "+"+this.plusPoints, 50, Math.random());
				}
				
				this.get = false;
			}
		
		}
	}
	
	carried[item.id] = item;
}


var popUps = {};
var createPopUp = function(X, Y, TEXT, DURATION, ID){
	var pop = {
		x : X,
		y : Y,
		text : TEXT,
		duration : DURATION,
		id : ID,
		
		draw : function(){
			if(this.duration > 0){
				this.duration--;
				this.y -= (this.duration * 0.1);
				createText(this.text, this.x, this.y, 20, "white", "center");
			}
		}
	}
	popUps[pop.id] = pop;
}










///////// S M O K E /////////


var createSmoke = function(X, Y, TEXTURE, ID){
	var s = {
		image : new Image(),
		x : X,
		y : Y,
		maxY : Y + ((Math.random()*100)+200),
		texture : TEXTURE,
		size : (Math.random()*10) + 10,
		id : ID,
		draw : function(){
			//this.image.src = "sprites/smoke.png";
			//ctx_mid.drawImage(this.image, this.texture * 64, 0, 64, 64, this.x, this.y, 32, 32);
			
			ctx_mid.beginPath();
			if(this.size > 6){
				ctx_mid.fillStyle = "rgba(10, 10, 10, 0.08)";
			}else{
				ctx_mid.fillStyle = "rgba(10, 10, 10, 0.2)";
			}
			ctx_mid.arc(this.x + (this.size / 2), this.y, this.size, 0, Math.PI * 2);
			ctx_mid.fill();
			ctx_mid.closePath();
			
			if(!pause){
				this.size += 2;
				
				this.y += 10;
			}
		}
	}
	
	smoke[s.id] = s;
}





/////// D E B R I S ////////

var createDebris = function(X, Y, SIZE, COLOR, IMAGE, SPEED, ANGLE, ID){
	var d = {
		x : X,
		y : Y,
		size : SIZE,
		color : COLOR,
		image : IMAGE,
		speed : SPEED,
		angle : Math.random()*ANGLE,
		id : ID,
		
		tick : (Math.random()*10)+10,
		draw : function(){
			this.x += this.speed * Math.cos(this.angle);
			this.y += this.speed * Math.sin(this.angle);
			
			this.tick--;
			
			if(this.image != "none"){
				ctx_mid.drawImage(this.image, (Math.random()*this.size) + 3, (Math.random()*this.size) + 3, this.size, this.size, this.x, this.y, this.size, this.size);
			}
			
			if(this.color != "none"){
				//ctx_mid.fillStyle = this.color;
				//ctx_mid.fillRect(this.x, this.y, (Math.random()*this.size) + 3, (Math.random()*this.size) + 3);
				ctx_mid.beginPath();
				ctx_mid.fillStyle = this.color;
				ctx_mid.arc(this.x, this.y, (Math.random()*this.size) + 1, 0, Math.PI * 2);
				ctx_mid.fill();
				ctx_mid.closePath();
			}
		}
	}
	debris[d.id] = d;
}





///////// P L A Y E R - B U L L E T //////////

var createPBullet = function(X, Y, SPEED, DAMAGE, COLOR, COUNT, ID){
	var playerBullet = {
		x : X,
		y : Y,
		speed : SPEED,
		damage : DAMAGE,
		color : COLOR,
		fCount : COUNT,
		id : ID,
		render : function(){
			
			if(!pause){
				this.y -= this.speed;
			}
			
			ctx_mid.fillStyle = this.color;
			ctx_mid.fillRect(this.x - 3, this.y, 6, 10);
		},
		
		explode : function(){
			for(var i = 0; i < (Math.random()*3)+5; i++){
				createDebris(this.x, this.y, 2, this.color, "none", 5, 360, Math.random());
			}
		}
	}
	
	pClip[playerBullet.id] = playerBullet;
	
}






///////// E N E M Y - B U L L E T //////////

var createEBullet = function(X, Y, SPEED, DAMAGE, COLOR, ID, TARGETX, TARGETY, DIRX, DIRY, TYPE){
	var enemyBullet = {
		x : X,
		y : Y,
		speed : SPEED,
		damage : DAMAGE,
		color : COLOR,
		id : ID,
		
		image : new Image(),
		animTick : 0,
		maxAnimTick : 10,
		animation : 0,
		frame : 0,
		maxFrame : 6,
		
		frameWidth : 16,
		frameHeight : 16,
		
		rndm : (Math.floor(Math.random()*120)+30),
		
		targetX : TARGETX,
		targetY : TARGETY,
		dirX : DIRX,
		dirY : DIRY,
		angle : 0,		
		type : TYPE,
		render : function(){
			this.image.src = "sprites/projectile.png";
			ctx_mid.drawImage(this.image, this.animation * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x - 8, this.y, this.frameWidth, this.frameHeight);
			
			if(showHitBoxes){
				ctx_mid.fillStyle = "rgba(0, 0, 200, 0.5)";
				ctx_mid.fillRect(this.x - 8, this.y, this.frameWidth, this.frameHeight);
			}
			
			this.animTick--;
			if(this.animTick <= 0){
				this.animTick = this.maxAnimTick;
				this.animation = ++this.frame % this.maxFrame;
			}
			
			if(!pause){
			
				if(this.type == "direct"){
					this.angle = Math.atan2(this.targetY - this.dirY, this.targetX - this.dirX);
				}
			
				if(this.type == "random"){
					this.angle = this.rndm * (Math.PI / 180);
				}
			
				this.x += this.speed * Math.cos(this.angle);
				this.y += this.speed * Math.sin(this.angle);
				
			}
		},
		
		explode : function(){
			for(var i = 0; i < (Math.random()*3)+5; i++){
				createDebris(this.x, this.y, 5, "none", this.image, 5, 360, Math.random());
			}
		}
	}
	eClip[enemyBullet.id] = enemyBullet;
}







///////// E N T I T Y - U P D A T E S /////////

var updateEntities = function(){
	if(player.alive){
		if(player.status <= 40){
			player.animate = false;
			
			if(!pause){
				createSmoke(player.x + (Math.random()*16) + 32, player.y + (Math.random()*player.frameHeight), Math.floor(Math.random()*3), Math.random());
			}
		}
		
		player.draw();
	
		for(var playerBullet in pClip){
			pClip[playerBullet].render();
			
			for(var e in enemy){
				if(pClip[playerBullet].x + 5 >= enemy[e].x && pClip[playerBullet].x <= enemy[e].x + enemy[e].frameWidth && pClip[playerBullet].y + 10 >= enemy[e].y && pClip[playerBullet].y <= enemy[e].y + enemy[e].frameHeight){
					enemy[e].status -= pClip[playerBullet].damage;
					pClip[playerBullet].explode();
					delete pClip[playerBullet];
				}
			}
		
			if(pClip[playerBullet].y <= -50){
				delete pClip[playerBullet];
			}
		}
	}else{	
		//localStorage.setItem("bp", points);
		player.explode(10);
		
		if(points >= bestPoints){
			createText(lang.eng.bestscore, 240, 140, 16, "white", "center");
		}else{
			createText(lang.eng.yourscore, 240, 140, 16, "white", "center");
		}
		createText(points, 240, 240, 98, "white", "center");
	}
	
	if(player.x <= -(player.frameWidth / 2)){
		player.x = -(player.frameWidth / 2);
	}
	else if(player.x >= W-(player.frameWidth / 2)){
		player.x = W-(player.frameWidth / 2);
	}
	if(player.y <= -(player.frameHeight/ 2)){
		player.y = -(player.frameHeight/ 2);
	}
	else if(player.y >= H-(player.frameHeight/ 2)){
		player.y = H-(player.frameHeight/ 2);
	}
	
	
	for(var enemyBullet in eClip){
		
		eClip[enemyBullet].render();
		
		if(player.alive){
			if(eClip[enemyBullet].x + 16 >= player.x + 32 && eClip[enemyBullet].x <= player.x + (32 + player.hitSize) && eClip[enemyBullet].y + eClip[enemyBullet].frameHeight >= player.y && eClip[enemyBullet].y <= player.y + (player.hitSize + 10)){
				if(player.shieldStatus > 0){
					player.shieldStatus -= 1;
				}else{
					player.status -= eClip[enemyBullet].damage;
				}
				playSound('sound/playerHit(slime).wav', 1, Math.random());
				eClip[enemyBullet].explode();
				delete eClip[enemyBullet];
				
				if(player.status < 0){
					playSound('sound/pop.wav', 1, Math.random());
				}
			}
		}
			
		if(eClip[enemyBullet].y >= H || eClip[enemyBullet].x >= W || eClip[enemyBullet].x <= 0 || eClip[enemyBullet].y <= 0){
			delete eClip[enemyBullet];
		}
	}
	
	
	for(var e in enemy){
		if(player.alive){
			if(enemy[e].x + enemy[e].frameWidth >= player.x + 32 && enemy[e].x <= player.x + 64 && enemy[e].y + enemy[e].frameHeight >= player.y && enemy[e].y <= player.y + player.frameHeight){
				enemy[e].status -= 100;
				if(player.shield){
					if(player.shieldStatus > 0){
						player.shieldStatus -= 1;
					}
				}else{
					player.status -= 100;
				}
			}
		}			
		
		if(enemy[e].status <= 0){
			enemy[e].status = 0;
			enemy[e].alive = false;
		}
		if(enemy[e].alive){
			enemy[e].draw();
			if(enemy[e].y >= enemy[e].maxY){
				enemy[e].y = enemy[e].maxY;
				enemy[e].speed = 0;
				if(player.alive){
					enemy[e].shoot();
				}
			}
			
			if(!pause){
				if(retreat){
					enemy[e].y -= 0.5;
					if(enemy[e].y <= -200){
						retreat = false;
						stage.enemySpawn -= 1;
						delete enemy[e];
					}
				}
				
				if(enemy[e].y >= H || enemy[e].x >= W || enemy[e].x <= 0){
					stage.enemySpawn -= 1;
					delete enemy[e];
				}
			}
		}else{
			playSound('sound/pop.wav', 1, Math.random());
			enemy[e].explode();
			createPopUp(enemy[e].x + (enemy[e].frameWidth / 2), enemy[e].y + (enemy[e].frameHeight / 2), "+100", 20, Math.random());
			delete enemy[e];
			points += 100;
			
			stage.enemySpawn -= 1;
		}
	}
	
	
	for(var s in smoke){
		smoke[s].draw();
		
		if(smoke[s].y >= smoke[s].maxY - 100){
		}
		
		if(smoke[s].y >= smoke[s].maxY){
			delete smoke[s];
		}
	}
	
	
	
	
	if(bossSpawned){
		bossSpawned = false;
		createBoss(Math.random(), 90, -240, bossType.GURK);
		bossIntro = true;
	}
	
	for(var b in boss){
		if(!pause){
		
			if(bossIntro){
				boss[b].animate = true;
				boss[b].animationName = "glide";
				boss[b].maxFrame = 12;
				boss[b].y += 0.5;
				if(boss[b].y >= 16){
					boss[b].y = 16;
					bossIntro = false;
					boss[b].animate = false;
					boss[b].animationName = "idle";
					bossUnvulnerable = false;
				}
			}
		
			if(bossOutro){
				boss[b].explode();
				bossUnvulnerable = true;
				boss[b].y -= 0.5;
				retreat = true;
				if(boss[b].y <= -200){
					stage.round += 1;
					stage.load = true;
					bossOutro = false;
					delete boss[b];
				}
			}
		}
		
		if(!bossUnvulnerable){
			for(var playerBullet in pClip){
				if(pClip[playerBullet].x + 5 >= boss[b].x && pClip[playerBullet].x <= boss[b].x + 300 && pClip[playerBullet].y + 10 >= boss[b].y && pClip[playerBullet].y <= boss[b].y + 144){
					boss[b].status -= pClip[playerBullet].damage;
					pClip[playerBullet].explode();
					delete pClip[playerBullet];
				}
			}
			
			boss[b].shoot();
		}
		
		if(!bossUnvulnerable && boss[b].status <= 0){
			boss[b].status = 0;
			bossOutro = true;
		}
		
		boss[b].draw();
	}
	
	
	
	
	for(var d in debris){
		debris[d].draw();
		
		if(debris[d].tick <= 0){
			delete debris[d];
		}
	}
	
	for(var item in carried){
		if(player.x + player.frameWidth >= carried[item].x && player.x <= carried[item].x + carried[item].frameWidth && player.y + player.frameHeight >= carried[item].y && player.y <= carried[item].y + carried[item].frameHeight){
			playSound('sound/pop.wav', 1, Math.random());
			carried[item].acquired();
			delete carried[item];
		}		
		
		if(carried[item].y >= H-64){
			delete carried[item];
		}
		
		carried[item].draw();
	}
	
	
	for(var s in sound){
		if(!pause){
			sound[s].play();
			
			delete sound[s];
		}
	}
	
	for(var pop in popUps){
		popUps[pop].draw();
		if(popUps[pop].duration <= 0){
			delete popUps[pop];
		}
	}
}












function createText(txt, x, y, size, color, align){
	ctx_front.beginPath();
	ctx_front.font = size+"px Arial";
	ctx_front.textAlign = align;
	ctx_front.fillStyle = color;
	ctx_front.fillText(txt, x, y);
	ctx_front.closePath();
}





//////// C O N T R O L S /////////

var mouse = {
	image : new Image(),
	mx : 0,
	my : 0,
	cx : 0,
	cy : 0,
	click : false,
	draw : function(){
		this.image.src = "sprites/cursor.png";
		ctx_front.drawImage(this.image, this.mx - 440, this.my - 7);
	}
}

document.onmousemove = mouseInside;
function mouseInside(e){
	e = e || window.event;
	
	mouse.mx = e.pageX;
	mouse.my = e.pageY;
	
	if(mouse.mx > 440 && mouse.mx < (W + 440) && mouse.my > 20 && mouse.my < (H + 20)){
		if(player.alive){
			if(!pause){
				if(play){
					player.x = (mouse.mx - (player.frameWidth / 2)) - 440, player.y = (mouse.my - (player.frameHeight / 2)) - 20;
				}
			}
		}
		
		//pause = false;
	}
}



document.onmousedown = mouseDown;
function mouseDown(e){
	shooting = true;
	
	e = e || window.event;
	
	mouse.mx = e.pageX;
	mouse.my = e.pageY;
	if(pause && !resume){
		if(mouse.mx > 440 && mouse.mx < (W + 440) && mouse.my > 20 && mouse.my < (H + 20)){
			resume = true;
		}
	}
	
	if(!player.alive){
		if(mouse.mx > 440 && mouse.mx < (W + 440) && mouse.my > 20 && mouse.my < (H + 20)){
			resetStart = true;
		}
	}
	
	mouse.click = true;
}

document.onmouseup = mouseUp;
function mouseUp(e){
	shooting = false;
	mouse.click = false;
}

document.onkeypress = keyPress;
function keyPress(e){
	e = e || window.event;
	
	if(e.keyCode == 32){
		if(play){
			if(!pause){
				pause = true;
			}else{
				resume = true;
			}
		}
	}
}




var keyDown = {};
addEventListener("keydown", function(e) {
    keyDown[e.keyCode] = true;
});
addEventListener("keyup", function(e) {
    delete keyDown[e.keyCode];
});





///////////////////////////////////////////////////////////////////////////////////////////////////////