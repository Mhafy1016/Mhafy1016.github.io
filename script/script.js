

const header_canvas = document.getElementById("UI_Header");
header_canvas.width = 374, header_canvas.height = 32;
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
	
	for(var i=0; i<ctx_menu.length; i++){
		ctx_menu[i].mozImageSmoothingEnabled = false;
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
			mainBtn.push(new drawBitmap(WIDTH-152, 144*0, 152, 144, ctx_menu, 1, image[2][0], new Border(8, 8, 8, 8, 2)));
			mainBtn.push(new drawBitmap(WIDTH-152, 144*1, 152, 144, ctx_menu, 0, image[5][0], new Border(8, 8, 8, 8, 2)));
			mainBtn.push(new drawBitmap(WIDTH-152, 144*2, 152, 144, ctx_menu, 0, image[5][0], new Border(8, 8, 8, 8, 2)));
			mainBtn.push(new drawBitmap(WIDTH-152, 144*3, 152, 144, ctx_menu, 0, image[5][0], new Border(8, 8, 8, 8, 2)));
			mainBtn.push(new drawBitmap(WIDTH-152, 144*4, 152, 144, ctx_menu, 0, image[7][0], new Border(8, 8, 8, 8, 2)));
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
		new drawBitmap(0, 0, header_canvas.width, header_canvas.height, ctx_header, 0, image[0][0], new Border(4, 4, 4, 4, 1)).draw();
	
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
		
		
		new drawBitmap((WIDTH-152)+44, (144*0)+40, 64, 64, ctx_menu, 1, image[8][0]).draw();
		new drawBitmap((WIDTH-152)+44, (144*1)+40, 64, 64, ctx_menu, 1, image[8][1]).draw();
		new drawBitmap((WIDTH-152)+44, (144*2)+40, 64, 64, ctx_menu, 1, image[8][2]).draw();
		new drawBitmap((WIDTH-152)+44, (144*3)+40, 64, 64, ctx_menu, 1, image[8][3]).draw();
		new drawBitmap((WIDTH-152)+44, (144*4)+40, 64, 64, ctx_menu, 1, image[8][4]).draw();
		
		new drawBitmap(0, 0, WIDTH-136, HEIGHT, ctx_menu, 0, image[1][0], new Border(8, 8, 8, 8, 2)).draw();
	
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
	
	new drawBitmap(0, 0, WIDTH, HEIGHT, ctx_content, 0, image[1][0], new Border(8, 8, 8, 8, 2)).draw();
}


function refreshContainer(){
	var up = document.getElementsByClassName("update");
	for(var i=0; i<up.length; i++){
		up[i].style.display = "none";
	}
	page[currentPage].style.display = "block";
}

function drawBitmap(x, y, width, height, ctx, layer, img, border){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.layer = layer;
	this.img = img;
	this.border = border;
	this.ctx = ctx;
	this.draw = function(){
		if( Array.isArray(this.ctx) ){
			if( this.border != null && this.border != 'undefined' ){
				this.ctx[this.layer].drawImage(this.img, 0, 0, border.left, border.top, this.x, this.y, border.left*border.scale, border.top*border.scale);
				this.ctx[this.layer].drawImage(this.img, border.left, 0, img.width-(border.left+border.right), border.top, this.x+(border.left*border.scale), this.y, this.width-((border.left*border.scale)+(border.right*border.scale)), border.top*border.scale);
				this.ctx[this.layer].drawImage(this.img, img.width-border.right, 0, border.right, border.top, this.x+(this.width-(border.right*border.scale)), this.y, border.left*border.scale, border.top*border.scale);
				this.ctx[this.layer].drawImage(this.img, 0, border.top, border.left, img.height-(border.top+border.bottom), this.x, this.y+(border.top*border.scale), border.left*border.scale, this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx[this.layer].drawImage(this.img, border.left, border.right, img.width-(border.left+border.right), img.height-(border.top+border.bottom), this.x+(border.left*border.scale), this.y+(border.top*border.scale), this.width-((border.left*border.scale)+(border.right*border.scale)), this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx[this.layer].drawImage(this.img, img.width-border.right, border.top, border.right, img.height-(border.top+border.bottom), this.x+(this.width-(border.right*border.scale)), this.y+(border.top*border.scale), border.left*border.scale, this.height-((border.top*border.scale)+(border.bottom*border.scale)));
				this.ctx[this.layer].drawImage(this.img, 0, img.height-border.bottom, border.left, border.bottom, this.x, this.y+(this.height-(border.bottom*border.scale)), border.left*border.scale, border.bottom*border.scale);
				this.ctx[this.layer].drawImage(this.img, border.left, img.height-border.bottom, img.width-(border.left+border.right), border.bottom, this.x+(border.left*border.scale), this.y+(this.height-(border.bottom*border.scale)), this.width-((border.left*border.scale)+(border.right*border.scale)), border.bottom*border.scale);
				this.ctx[this.layer].drawImage(this.img, img.width-border.right, img.height-border.bottom, border.right, border.bottom, this.x+(this.width-(border.right*border.scale)), this.y+(this.height-(border.bottom*border.scale)), border.left*border.scale, border.bottom*border.scale);

			} else {
				this.ctx[this.layer].drawImage(this.img, this.x, this.y, this.width, this.height);
			}
		} else {
			this.ctx.drawImage(this.img, 0, 0, border.left, border.top, this.x, this.y, border.left*border.scale, border.top*border.scale);
			this.ctx.drawImage(this.img, border.left, 0, img.width-(border.left+border.right), border.top, this.x+(border.left*border.scale), this.y, this.width-((border.left*border.scale)+(border.right*border.scale)), border.top*border.scale);
			this.ctx.drawImage(this.img, img.width-border.right, 0, border.right, border.top, this.x+(this.width-(border.right*border.scale)), this.y, border.left*border.scale, border.top*border.scale);
			this.ctx.drawImage(this.img, 0, border.top, border.left, img.height-(border.top+border.bottom), this.x, this.y+(border.top*border.scale), border.left*border.scale, this.height-((border.top*border.scale)+(border.bottom*border.scale)));
			this.ctx.drawImage(this.img, border.left, border.right, img.width-(border.left+border.right), img.height-(border.top+border.bottom), this.x+(border.left*border.scale), this.y+(border.top*border.scale), this.width-((border.left*border.scale)+(border.right*border.scale)), this.height-((border.top*border.scale)+(border.bottom*border.scale)));
			this.ctx.drawImage(this.img, img.width-border.right, border.top, border.right, img.height-(border.top+border.bottom), this.x+(this.width-(border.right*border.scale)), this.y+(border.top*border.scale), border.left*border.scale, this.height-((border.top*border.scale)+(border.bottom*border.scale)));
			this.ctx.drawImage(this.img, 0, img.height-border.bottom, border.left, border.bottom, this.x, this.y+(this.height-(border.bottom*border.scale)), border.left*border.scale, border.bottom*border.scale);
			this.ctx.drawImage(this.img, border.left, img.height-border.bottom, img.width-(border.left+border.right), border.bottom, this.x+(border.left*border.scale), this.y+(this.height-(border.bottom*border.scale)), this.width-((border.left*border.scale)+(border.right*border.scale)), border.bottom*border.scale);
			this.ctx.drawImage(this.img, img.width-border.right, img.height-border.bottom, border.right, border.bottom, this.x+(this.width-(border.right*border.scale)), this.y+(this.height-(border.bottom*border.scale)), border.left*border.scale, border.bottom*border.scale);
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
		mainBtn[0].layer = 1, mainBtn[0].img = image[2][0];
	mainBtn[1].layer = 0, mainBtn[1].img = image[5][0];
	mainBtn[2].layer = 0, mainBtn[2].img = image[5][0];
	mainBtn[3].layer = 0, mainBtn[3].img = image[5][0];
	mainBtn[4].layer = 0, mainBtn[4].img = image[7][0];
	page = addons;
	currentPage = 0;
	currentTab = "addons";
}, false);
mb[1].addEventListener("click", function( event ){
	mainBtn[0].layer = 0, mainBtn[0].img = image[3][0];
		mainBtn[1].layer = 1, mainBtn[1].img = image[4][0];
	mainBtn[2].layer = 0, mainBtn[2].img = image[5][0];
	mainBtn[3].layer = 0, mainBtn[3].img = image[5][0];
	mainBtn[4].layer = 0, mainBtn[4].img = image[7][0];
	page = mods;
	currentPage = 0;
	currentTab = "mods";
}, false);
mb[2].addEventListener("click", function( event ){
	mainBtn[0].layer = 0, mainBtn[0].img = image[3][0];
	mainBtn[1].layer = 0, mainBtn[1].img = image[5][0];
		mainBtn[2].layer = 1, mainBtn[2].img = image[4][0];
	mainBtn[3].layer = 0, mainBtn[3].img = image[5][0];
	mainBtn[4].layer = 0, mainBtn[4].img = image[7][0];
	page = tPacks;
	currentPage = 0;
	currentTab = "tPacks";
}, false);
mb[3].addEventListener("click", function( event ){
	mainBtn[0].layer = 0, mainBtn[0].img = image[3][0];
	mainBtn[1].layer = 0, mainBtn[1].img = image[5][0];
	mainBtn[2].layer = 0, mainBtn[2].img = image[5][0];
		mainBtn[3].layer = 1, mainBtn[3].img = image[4][0];
	mainBtn[4].layer = 0, mainBtn[4].img = image[7][0];
	page = maps;
	currentPage = 0;
	currentTab = "maps";
}, false);
mb[4].addEventListener("click", function( event ){
	mainBtn[0].layer = 0, mainBtn[0].img = image[3][0];
	mainBtn[1].layer = 0, mainBtn[1].img = image[5][0];
	mainBtn[2].layer = 0, mainBtn[2].img = image[5][0];
	mainBtn[3].layer = 0, mainBtn[3].img = image[5][0];
		mainBtn[4].layer = 1, mainBtn[4].img = image[6][0];
	page = libs;
	currentPage = 0;
	currentTab = "libs";
}, false);












var imageNames = [
	["assets/",["greyBorder"],".png"],
	["assets/",["dialog_background_opaque"],".png"],
	["assets/",["TabRightFrontTopMost"],".png"],
	["assets/",["TabRightBackTopMost"],".png"],
	["assets/",["TabRightFront"],".png"],
	["assets/",["TabRightBack"],".png"],
	["assets/",["TabRightFrontBottomMost"],".png"],
	["assets/",["TabRightBackBottomMost"],".png"],
	["assets/icons/",["addon","mod","textures","map","library"],".png"],
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
