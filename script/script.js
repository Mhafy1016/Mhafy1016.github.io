SA.redirection_mobile ({mobile_url : "google.com",});


const header_canvas = document.getElementById("UI_Header");
header_canvas.width = 720, header_canvas.height = 40;
const ctx_header = header_canvas.getContext("2d");
const ctx_menu = [document.getElementById("UI_Layout").getContext("2d"), document.getElementById("UI_Layout_front").getContext("2d")];
const ctx_content = document.getElementById("UI_Content").getContext("2d")
document.getElementById("UI_Layout").width = 1024; document.getElementById("UI_Layout").height = 720;
document.getElementById("UI_Layout_front").width = 1024; document.getElementById("UI_Layout_front").height = 720;
document.getElementById("UI_Content").width = 1024; document.getElementById("UI_Content").height = 720;
const WIDTH = document.getElementById("UI_Layout").width;
const HEIGHT = document.getElementById("UI_Layout").height;

const pixel = 4;
var slideTimer = 0;

var mainBtn = [];

var firstLoad = false;
var slide = true;

var info = "";
var currentTab = "addons";
var recentTab = "";
var currentPage = 0;
var page = document.getElementsByClassName("addon");

var container = document.getElementById("updateContainer");
var allUpdate = document.getElementsByClassName("update");
var addons = document.getElementsByClassName("addon");
var mods = document.getElementsByClassName("mod");
var tPacks = document.getElementsByClassName("tpack");
var maps = document.getElementsByClassName("map");
var libs = document.getElementsByClassName("lib");

function init(){
	ctx_header.imageSmoothingEnabled = false;
	ctx_header.webkitImageSmoothingEnabled = false;
	ctx_header.msImageSmoothingEnabled = false;
	ctx_header.imageSmoothingEnabled = false;
	for(var i=0; i<ctx_menu.length; i++){
		ctx_menu[i].imageSmoothingEnabled = false;
		ctx_menu[i].webkitImageSmoothingEnabled = false;
		ctx_menu[i].msImageSmoothingEnabled = false;
		ctx_menu[i].imageSmoothingEnabled = false;
		
		ctx_menu[i].clearRect(0, 0, WIDTH, HEIGHT);
		ctx_menu[i].clearRect(0, 0, WIDTH, HEIGHT);
	}
	
	
	document.getElementById("info").innerHTML = info;
	
	if( loaded >= 100 ){
		document.getElementById("loading").style.display = "none";
		document.getElementsByClassName("links")[4].innerHTML = "HOME";
		document.getElementsByClassName("links")[3].innerHTML = "SUPPORT";
		document.getElementsByClassName("links")[2].innerHTML = "E-MAIL";
		document.getElementsByClassName("links")[1].innerHTML = "FAQ";
		document.getElementsByClassName("links")[0].innerHTML = "ABOUT";
		document.getElementsByClassName("actionBtn")[0].style.display = "block";
		document.getElementsByClassName("actionBtn")[1].style.display = "block";
		
		if( firstLoad === false ){
			firstLoad = true;
			mainBtn.push(new drawBitmap(WIDTH-152, 144*0, 152, 144, ctx_menu, 1, image[0][0], new Border(8, 8, 8, 8, 2), new ImagePart(32, 0, 22, 24)));
			mainBtn.push(new drawBitmap(WIDTH-152, 144*1, 152, 144, ctx_menu, 0, image[0][0], new Border(8, 8, 8, 8, 2), new ImagePart(32, 72, 22, 24)));
			mainBtn.push(new drawBitmap(WIDTH-152, 144*2, 152, 144, ctx_menu, 0, image[0][0], new Border(8, 8, 8, 8, 2), new ImagePart(32, 72, 22, 24)));
			mainBtn.push(new drawBitmap(WIDTH-152, 144*3, 152, 144, ctx_menu, 0, image[0][0], new Border(8, 8, 8, 8, 2), new ImagePart(32, 72, 22, 24)));
			mainBtn.push(new drawBitmap(WIDTH-152, 144*4, 152, 144, ctx_menu, 0, image[0][0], new Border(8, 8, 8, 8, 2), new ImagePart(54, 24, 22, 24)));
		}
		
		drawLayout();
	}else{
		document.getElementById("loading").style.display = "block";
		loadImages();
	}
	
	requestAnimationFrame(init);
}


function drawLayout(){
	//Header
		new drawBitmap(0, 0, header_canvas.width, header_canvas.height, ctx_header, 0, image[0][0], new Border(8, 8, 8, 8, 1), new ImagePart(0, 32, 32, 32)).draw();
	
	//Main Layout
		
		for(var i=0; i<mainBtn.length; i++){
			mainBtn[i].draw();
		}
		
		for(var d=0; d<page.length; d++){
			ctx_menu[1].fillStyle = "gray";
			ctx_menu[1].fillRect((((WIDTH-124)/2)-(((24-(page.length*.2))*page.length)/2))+((24-(page.length*.2))*d), HEIGHT-52, 12, 12);
		}
		ctx_menu[1].fillStyle = "black";
		ctx_menu[1].fillRect((((WIDTH-124)/2)-(((24-(page.length*.2))*page.length)/2))+((24-(page.length*.2))*currentPage), HEIGHT-52, 12, 12);
		
		
		new drawBitmap((WIDTH-152)+44, (144*0)+40, 64, 64, ctx_menu, 1, image[1][0], null, new ImagePart(0, 0, 64, 64)).draw();
		new drawBitmap((WIDTH-152)+44, (144*1)+40, 64, 64, ctx_menu, 1, image[1][0], null, new ImagePart(64, 0, 64, 64)).draw();
		new drawBitmap((WIDTH-152)+44, (144*2)+40, 64, 64, ctx_menu, 1, image[1][0], null, new ImagePart(128, 0, 64, 64)).draw();
		new drawBitmap((WIDTH-152)+44, (144*3)+40, 64, 64, ctx_menu, 1, image[1][0], null, new ImagePart(192, 0, 64, 64)).draw();
		new drawBitmap((WIDTH-152)+44, (144*4)+40, 64, 64, ctx_menu, 1, image[1][0], null, new ImagePart(256, 0, 64, 64)).draw();
		
		new drawBitmap(0, 0, WIDTH-136, HEIGHT, ctx_menu, 0, image[0][0], new Border(8, 8, 8, 8, 2), new ImagePart(0, 64, 32, 32)).draw();
	
	ctx_menu[0].fillStyle = 'gray';
	ctx_menu[0].fillRect(24, 24, WIDTH-184, 608);
	
	if( recentTab !== currentTab  ){
		refreshContainer();
		slide = true;
		slideTimer = 0;
		recentTab = currentTab;
	}
	
	slideTimer += 1;
	if( slide === true && slideTimer % 300 == 0 ){
		toPage(1);
	}
	info =  slideTimer+" / 300, "+slide;
	
	new drawBitmap(0, 0, WIDTH, HEIGHT, ctx_content, 0, image[0][0], new Border(8, 8, 8, 8, 2), new ImagePart(0, 64, 32, 32)).draw();
}


function refreshContainer(){
	var up = document.getElementsByClassName("update");
	for(var i=0; i<up.length; i++){
		up[i].style.display = "none";
	}
	page[currentPage].style.display = "block";
}

function drawBitmap(x, y, width, height, ctx, layer, img, border, part){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.layer = layer;
	this.img = img;
	this.border = border;
	this.part = part || new ImagePart();
	this.ctx = ctx;
	this.draw = function(){
		if( this.part.width <= 0 ){
			this.part.width = this.img.width;
		}
		if( this.part.height <= 0 ){
			this.part.height = this.img.height;
		}
		if( Array.isArray(this.ctx) ){
			if( this.border != null && this.border != 'undefined' ){
				this.ctx[this.layer].drawImage(this.img, this.part.x, this.part.y, border.left, border.top, this.x, this.y, border.left*border.scale, border.top*border.scale);
				this.ctx[this.layer].drawImage(this.img, this.part.x+border.left, this.part.y, this.part.width-(border.left+border.right), border.top, this.x+(border.left*border.scale), this.y, this.width-((border.left*border.scale)+(border.right*border.scale)), border.top*border.scale);
				this.ctx[this.layer].drawImage(this.img, (this.part.x+this.part.width)-border.right, this.part.y, border.right, border.top, this.x+(this.width-(border.right*border.scale)), this.y, border.left*border.scale, border.top*border.scale);
				this.ctx[this.layer].drawImage(this.img, this.part.x, this.part.y+border.top, border.left, this.part.height-(border.top+border.bottom), this.x, this.y+(border.top*border.scale), border.left*border.scale, this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx[this.layer].drawImage(this.img, this.part.x+border.left, this.part.y+border.right, this.part.width-(border.left+border.right), this.part.height-(border.top+border.bottom), this.x+(border.left*border.scale), this.y+(border.top*border.scale), this.width-((border.left*border.scale)+(border.right*border.scale)), this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx[this.layer].drawImage(this.img, (this.part.x+this.part.width)-border.right, this.part.y+border.top, border.right, this.part.height-(border.top+border.bottom), this.x+(this.width-(border.right*border.scale)), this.y+(border.top*border.scale), border.left*border.scale, this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx[this.layer].drawImage(this.img, this.part.x, (this.part.y+this.part.height)-border.bottom, border.left, border.bottom, this.x, this.y+(this.height-(border.bottom*border.scale)), border.left*border.scale, border.bottom*border.scale);
				this.ctx[this.layer].drawImage(this.img, this.part.x+border.left, (this.part.y+this.part.height)-border.bottom, (this.part.width)-(border.left+border.right), border.bottom, this.x+(border.left*border.scale), this.y+(this.height-(border.bottom*border.scale)), this.width-((border.left*border.scale)+(border.right*border.scale)), border.bottom*border.scale);
				this.ctx[this.layer].drawImage(this.img, (this.part.x+this.part.width)-border.right, (this.part.y+this.part.height)-border.bottom, border.right, border.bottom, this.x+(this.width-(border.right*border.scale)), this.y+(this.height-(border.bottom*border.scale)), border.left*border.scale, border.bottom*border.scale);

			} else {
				this.ctx[this.layer].drawImage(this.img, this.part.x, this.part.y, this.part.width, this.part.height, this.x, this.y, this.width, this.height);
			}
		} else {
			if( this.border != null && this.border != 'undefined' ){
				this.ctx.drawImage(this.img, this.part.x, this.part.y, border.left, border.top, this.x, this.y, border.left*border.scale, border.top*border.scale);
				this.ctx.drawImage(this.img, this.part.x+border.left, this.part.y, this.part.width-(border.left+border.right), border.top, this.x+(border.left*border.scale), this.y, this.width-((border.left*border.scale)+(border.right*border.scale)), border.top*border.scale);
				this.ctx.drawImage(this.img, (this.part.x+this.part.width)-border.right, this.part.y, border.right, border.top, this.x+(this.width-(border.right*border.scale)), this.y, border.left*border.scale, border.top*border.scale);
				this.ctx.drawImage(this.img, this.part.x, this.part.y+border.top, border.left, this.part.height-(border.top+border.bottom), this.x, this.y+(border.top*border.scale), border.left*border.scale, this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx.drawImage(this.img, this.part.x+border.left, this.part.y+border.right, this.part.width-(border.left+border.right), this.part.height-(border.top+border.bottom), this.x+(border.left*border.scale), this.y+(border.top*border.scale), this.width-((border.left*border.scale)+(border.right*border.scale)), this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx.drawImage(this.img, (this.part.x+this.part.width)-border.right, this.part.y+border.top, border.right, this.part.height-(border.top+border.bottom), this.x+(this.width-(border.right*border.scale)), this.y+(border.top*border.scale), border.left*border.scale, this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx.drawImage(this.img, this.part.x, (this.part.y+this.part.height)-border.bottom, border.left, border.bottom, this.x, this.y+(this.height-(border.bottom*border.scale)), border.left*border.scale, border.bottom*border.scale);
				this.ctx.drawImage(this.img, this.part.x+border.left, (this.part.y+this.part.height)-border.bottom, (this.part.width)-(border.left+border.right), border.bottom, this.x+(border.left*border.scale), this.y+(this.height-(border.bottom*border.scale)), this.width-((border.left*border.scale)+(border.right*border.scale)), border.bottom*border.scale);
				this.ctx.drawImage(this.img, (this.part.x+this.part.width)-border.right, (this.part.y+this.part.height)-border.bottom, border.right, border.bottom, this.x+(this.width-(border.right*border.scale)), this.y+(this.height-(border.bottom*border.scale)), border.left*border.scale, border.bottom*border.scale);
			
			} else {
				this.ctx.drawImage(this.img, this.part.x, this.part.y, this.part.width, this.part.height, this.x, this.y, this.width, this.height);
			}
		}
	}
}

function Border(left, top, right, bottom, scale){
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
	this.scale = scale;
}

function ImagePart(x, y, width, height){
	this.x = x | 0;
	this.y = y | 0;
	this.width = width | 0;
	this.height = height | 0;
}



function toPage(n){
	currentPage += n;
	if( currentPage >= page.length ){
		currentPage = 0;
	}
	if( currentPage < 0 ){
		currentPage = page.length-1;
	}
	refreshContainer();
}






var mb = document.getElementsByClassName("mainButton");
mb[0].addEventListener("click", function( event ){
		mainBtn[0].layer = 1, mainBtn[0].part = new ImagePart(32, 0, 22, 24);
	mainBtn[1].layer = 0, mainBtn[1].part = new ImagePart(32, 72, 22, 24);
	mainBtn[2].layer = 0, mainBtn[2].part = new ImagePart(32, 72, 22, 24);
	mainBtn[3].layer = 0, mainBtn[3].part = new ImagePart(32, 72, 22, 24);
	mainBtn[4].layer = 0, mainBtn[4].part = new ImagePart(54, 24, 22, 24);
	page = addons;
	currentPage = 0;
	currentTab = "addons";
}, false);
mb[1].addEventListener("click", function( event ){
	mainBtn[0].layer = 0, mainBtn[0].part = new ImagePart(32, 24, 22, 24);
		mainBtn[1].layer = 1, mainBtn[1].part = new ImagePart(32, 48, 22, 24);
	mainBtn[2].layer = 0, mainBtn[2].part = new ImagePart(32, 72, 22, 24);
	mainBtn[3].layer = 0, mainBtn[3].part = new ImagePart(32, 72, 22, 24);
	mainBtn[4].layer = 0, mainBtn[4].part = new ImagePart(54, 24, 22, 24);
	page = mods;
	currentPage = 0;
	currentTab = "mods";
}, false);
mb[2].addEventListener("click", function( event ){
	mainBtn[0].layer = 0, mainBtn[0].part = new ImagePart(32, 24, 22, 24);
	mainBtn[1].layer = 0, mainBtn[1].part = new ImagePart(32, 72, 22, 24);
		mainBtn[2].layer = 1, mainBtn[2].part = new ImagePart(32, 48, 22, 24);
	mainBtn[3].layer = 0, mainBtn[3].part = new ImagePart(32, 72, 22, 24);
	mainBtn[4].layer = 0, mainBtn[4].part = new ImagePart(54, 24, 22, 24);
	page = tPacks;
	currentPage = 0;
	currentTab = "tPacks";
}, false);
mb[3].addEventListener("click", function( event ){
	mainBtn[0].layer = 0, mainBtn[0].part = new ImagePart(32, 24, 22, 24);
	mainBtn[1].layer = 0, mainBtn[1].part = new ImagePart(32, 72, 22, 24);
	mainBtn[2].layer = 0, mainBtn[2].part = new ImagePart(32, 72, 22, 24);
		mainBtn[3].layer = 1, mainBtn[3].part = new ImagePart(32, 48, 22, 24);
	mainBtn[4].layer = 0, mainBtn[4].part = new ImagePart(54, 24, 22, 24);
	page = maps;
	currentPage = 0;
	currentTab = "maps";
}, false);
mb[4].addEventListener("click", function( event ){
	mainBtn[0].layer = 0, mainBtn[0].part = new ImagePart(32, 24, 22, 24);
	mainBtn[1].layer = 0, mainBtn[1].part = new ImagePart(32, 72, 22, 24);
	mainBtn[2].layer = 0, mainBtn[2].part = new ImagePart(32, 72, 22, 24);
	mainBtn[3].layer = 0, mainBtn[3].part = new ImagePart(32, 72, 22, 24);
		mainBtn[4].layer = 1, mainBtn[4].part = new ImagePart(54, 0, 22, 24);
	page = libs;
	currentPage = 0;
	currentTab = "libs";
}, false);












var imageNames = [
	["assets/",["sprite-sheet"],".png"],
	["assets/icons/",["icons"],".png"],
	["assets/",["loading"],".png"]
	
];


var loaded = 0;
var image = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
var img;
var allImageCount = 0;
var countAllImages = 0;
var imgCount = 0;
var nxtImg = 0;
var loadFinish = false;
var fileExists = true;
var getCount = false;



function loadImages(){
	if(imageNames.length != 0){
		if(fileExists){
			fileExists = false;
			img = new Image();
			img.onload = ifExist;
			img.onerror = ifDoesntExist;
			img.src = imageNames[nxtImg][0]+imageNames[nxtImg][1][imgCount]+imageNames[nxtImg][2];
		}
		
		
		if(!getCount){
			for(var a=0; a<imageNames.length; a++){
				allImageCount += imageNames[a][1].length;
			}
			getCount = true;
		}
		
		loaded = 100*((countAllImages+1)/allImageCount);
	}
}


function ifExist(){
	image[nxtImg].push(img);
	imgCount += 1;
	if(imgCount >= (imageNames[nxtImg][1].length)){
		imgCount = 0;
		nxtImg += 1;
	}
	countAllImages++;
	fileExists = true;
}

function ifDoesntExist(){
	loadFinish = true;
}
