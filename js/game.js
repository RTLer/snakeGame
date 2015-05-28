var c = document.getElementById("board");
var ctx = c.getContext("2d");
ctx.webkitImageSmoothingEnabled = 
            ctx.mozImageSmoothingEnabled = false;
var speed = 80;
var documentWidth = $(document).width()*window.devicePixelRatio;
var documentHeight = $(document).height()*window.devicePixelRatio;
$( "#board" ).css( "" );
var cubeHeight = 10*window.devicePixelRatio, cubeWidth = 10*window.devicePixelRatio;
cubeWidth += (documentWidth%cubeWidth)/Math.floor(documentWidth / cubeWidth);
var mainMapHeight = cubeHeight
		* Math.floor((documentHeight - 25) / cubeHeight);
var mainMapWidth = documentWidth;
var blocksHeightCount=(mainMapHeight / cubeHeight),blocksWidthCount=(mainMapWidth / cubeWidth);
	c.width = mainMapWidth;
	c.height = mainMapHeight + 25;

var colors = [ 	"#ecf0f1", "#34495e", 
				"#e74c3c", "#3498db", "#f1c40f", "#1abc9c", 
				"#e74c3c", "#3498db", "#f1c40f", "#1abc9c" ];
var x=-1,y=-1;
var arrayMap = [];
var gameInfo = "";
var start=0, end=0;
// game variables /////////////////////////////
var listener = new window.keypress.Listener();
var snake = [], walls = [], foods = [];
var tempsnake;
var keyArray = ["top", "left", "bottom", "right"];
var keyIndex = 0;
var maxFoods = 5;
var lastTile = [];
var snakecolor = [2];
var snakecolorIndex = 0;
	snake[0]=[Math.floor((documentHeight - 25) / cubeHeight)-2,2,3];
	

//game main loop //////////////////////////////
function runloop() {
	if(x!=-1){
		if(x<=($(document).width()/2)){
			if(keyIndex>=(keyArray.length-1))
				keyIndex = 0;
			else
				keyIndex++;
		}else{
			if(keyIndex<=0)
				keyIndex = keyArray.length-1;
			else
				keyIndex--;
		}
	x=-1;
	console.log(keyArray[keyIndex]);
	}
	tempsnake=snake[0].slice();
	switch(keyIndex){
		case 0:
			if(tempsnake[0]<=0)
				tempsnake[0]=blocksHeightCount-1;
			else
				tempsnake[0]--;
			break;
		case 1:
			if(tempsnake[1]<=0)
				tempsnake[1]=blocksWidthCount-1;
			else
				tempsnake[1]--;
			break;
		case 2:
			if(tempsnake[0]>=blocksHeightCount-1)
				tempsnake[0]=0;
			else
				tempsnake[0]++;
			break;
		case 3:
			if(tempsnake[1]>=blocksWidthCount-1)
				tempsnake[1]=0;
			else
				tempsnake[1]++;
			break;	
	}
	snake.unshift(tempsnake);
	lastTile = snake.pop();
	Math.floor((Math.random() * 10) + 1);
	// foods
	if(foods.length<maxFoods){
		foods.push([Math.floor((Math.random() * blocksHeightCount)),Math.floor((Math.random() * blocksWidthCount)),
		Math.floor(Math.random() * 4)+6]);
	}

	for (var i = 0; i < blocksHeightCount; i++)
		for (var j = 0; j < blocksWidthCount; j++)
			arrayMap[i][j] = 0;
	walls.forEach(markBlock);
	snake.forEach(markBlock);
	foods.forEach(markBlock);
	snakecolorIndex = 0;
	gameInfo = msToTime(end-start);
}
// make simple wall in middle
for (var i = 1; i < blocksHeightCount-1; i++)
	walls[i]=[i,Math.floor(blocksWidthCount/2),1];
function markBlock(cell,index){
	if(cell[2]>=6&&cell[2]<=9&&arrayMap[cell[0]][cell[1]]>=2&&arrayMap[cell[0]][cell[1]]<=5){
		foods.splice(index, 1);
		snake.push(lastTile);
		snakecolor.unshift(cell[2]-4);
	}
	if(cell[2]>=6&&cell[2]<=9&&arrayMap[cell[0]][cell[1]]==1){
		foods.splice(index, 1);
	}
	if(cell[2]>=2&&cell[2]<=5&&((arrayMap[cell[0]][cell[1]]>=2&&arrayMap[cell[0]][cell[1]]<=5)||arrayMap[cell[0]][cell[1]]==1)){
		console.log("game is over");
		window.clearInterval(mainTimer);
		if(arrayMap[cell[0]][cell[1]]>=2&&arrayMap[cell[0]][cell[1]]<=5)console.log("you bite your self ;)");
		if(arrayMap[cell[0]][cell[1]]==1)console.log("they call it wall, the thing you just hit ;)");
	}
	if(cell[2]>=2&&cell[2]<=5){
		arrayMap[cell[0]][cell[1]] = snakecolor[snakecolorIndex];
		snakecolorIndex++;
	}else
		arrayMap[cell[0]][cell[1]] = cell[2];
}
listener.simple_combo("left", function() {
x=0;
});
listener.simple_combo("right", function() {
x=mainMapWidth;
});
//game main loop end //////////////////////////
document.addEventListener("touchend", function(e) { e.preventDefault(); }, false);
c.addEventListener("touchstart",function(event) {
	x = event.pageX - this.offsetLeft;
	y = event.pageY - this.offsetLeft;
	event.preventDefault();
	return false;
});
$('body').bind('touchmove', function(e){e.preventDefault()});
$("#board").mousedown(function(event) {
	x = event.pageX - this.offsetLeft;
	y = event.pageY - this.offsetLeft;
	event.preventDefault();
	return false;
});
$(document).ready(startNewGame());
function startNewGame() {
	for (var i = 0; i < blocksHeightCount; i++) {
		arrayMap[i] = [];
		for (var k = 0; k < blocksWidthCount; k++) {
			j = k;

			arrayMap[i][j] = 0;
			start = new Date().getTime();
			end = new Date().getTime();
		}
	}
}

function gameEnd(i, j) {

}
function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100), seconds = parseInt((duration / 1000) % 60), minutes = parseInt((duration / (1000 * 60)));

	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return minutes + ":" + seconds;
}
mainTimer=setInterval(
		function() {
			ctx.clearRect(0, 0,mainMapHeight, mainMapWidth);
			ctx.fillStyle = colors[0];
			ctx.fillRect(0,0, mainMapWidth,
					mainMapHeight);
			runloop();
			for (var i = 0; i < blocksHeightCount; i++) {
				for (var k = 0; k < blocksWidthCount; k++) {
					j = k;
						Block = arrayMap[i][j];
						if(Block!=0){
						ctx.fillStyle = colors[Block];
						ctx.fillRect(k * cubeWidth, i * cubeHeight,
								cubeWidth-.5, cubeHeight-.5);
						}
					gameEnd(i, j);
				}
			}
			ctx.font = "16px Arial";
			ctx.fillStyle = "#ecf0f1";
			ctx.fillRect(0, mainMapHeight, mainMapWidth, mainMapHeight + 25);
			end = new Date().getTime();
			ctx.strokeStyle = 'black';
			ctx.strokeRect(0, 0, mainMapWidth, mainMapHeight);
			ctx.fillStyle = "#000";
			ctx.fillText(gameInfo, 10, mainMapHeight + 18);
		}, speed);