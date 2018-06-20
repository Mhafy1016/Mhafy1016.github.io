

var imageNames = [
	"sprites/cursor.png",
	"sprites/projectile.png",
	"sprites/smoke.png",
	"sprites/ship.png",
	"sprites/sprite.png",
	
	"sprites/enemies/gurk.png",
	"sprites/enemies/gurk-sprite.png",
	
	"sprites/carrier/carrier.png",
	"sprites/carrier/sprite.png",
	
	"sprites/background/gurk.png"

];

var loaded = 0;
var image = [];
var img;
var imgCount = 0;
var loadFinish = false;
var fileExists = true;

function loadImages(){
	if(fileExists){
		fileExists = false;
		img = new Image();
		img.onload = ifExist;
		img.onerror = ifDoesntExist;
		img.src = imageNames[imgCount];
	}
	
	loaded = 100 * (imgCount/imageNames.length);
}


function ifExist(){
	image.push(img);
	imgCount += 1;
	fileExists = true;
}

function ifDoesntExist(){
	//alert("File Missing ");
	loadFinish = true;
}















////////// M E N U /////////


var gui = {
	draw : function(type){
		if(type == "menu"){
			ctx_front.fillStyle = "rgb(50, 50, 50)";
			ctx_front.fillRect(0, 0, W, H);
			
			createText(lang.eng.bestscore, 240, 160, 16, "white", "center");
			createText(bestPoints, 240, 240, 78, "white", "center");
			
			createBtn(164, 315, 160, 50, "white", lang.eng.play, 48, 0);
			createBtn(212, 412, 64, 24, "white", lang.eng.reset, 16, 1);
		}
	}
	
}





var resetStart = false;


function resetAll(){
	if(resetStart){
		resetStart = false;
		
		pClip = {};
	
		enemy = {};
		eClip = {};
	
		boss = {};
	
		item = {};
		smoke = {};
		debris = {};
	
		showHitBoxes = false;
	
		shooting = false;
	
		spawnTick = 0, maxSpawnTick = 75;
	
		points = 0;
	
		second = 60;
		pause = false, resumeCountdown = 3, resume = false;
	
		play = false;
	
	
		bossUnvulnerable = true, bossIntro = false, bossOutro = false, bossSpawned = false, spawnBoss = false, retreat = false;
		
		stage.load = true;
		
		backImage.y1 = 0, backImage.y2 = 0;
		
		player.alive = true;
		player.canShoot = true;
		player.canMove = true;
		player.status = 100;
		
		player.x = 192;
		player.y = 566;
		player.toX = 0;
		player.toY = 0;
		player.dir = 0;
		player.speed = 10;
		
		player.hitSize = 0;
		
		player.blasterCount = 1;
		
		player.animate = true;
		player.animTick = 0;
		player.maxAnimTick = 10;
		player.animation = 0;
		player.frame = 0;
		player.maxFrame = 6;
		
		player.frameWidth = 96;
		player.frameHeight = 64;
		
		player.shootCoolDown = 0;
		player.maxShootCoolDown = 10;
		
		player.explosion = true;
		player.explosionCount = 10;
		
		mouse.mx = 0;
		mouse.my = 0;
		mouse.cx = 0;
		mouse.cy = 0;
		mouse.click = false;
	}
}











var lang = {
	eng : {
		play : "PLAY",
		paused : "PAUSED",
		reset : "RESET",
		yourscore : "YOUR SCORE",
		bestscore : "BEST SCORE"
	}

}	