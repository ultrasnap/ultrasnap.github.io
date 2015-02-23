var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var player = {
	x: 360,
	y: 240,
	r: 25,
	speed: 3,
	gun: {},
	hp: 100,
	chance: 0,
	kills: 0,
	totalkills: 0,
	shooting: false,
	weapon_list: {
		pistol: {
			speed: 15,
			bps: 1,
			spread: 0,
			damage: 15,
			sps: 3,
			pierce: false,
			r: 3,
		},
		shotgun: {
			speed: 10,
			bps: 8,
			spread: 3,
			damage: 10,
			sps: 1.25,
			pierce: false,
			r: 3,
		},
		rifle: {
			speed: 20,
			bps: 1,
			spread: 0,
			damage: 7,
			sps: 12,
			pierce: false,
			r: 3,
		},
		sniper: {
			speed: 30,
			bps: 1,
			spread: 0,
			damage: 60,
			sps: .75,
			pierce: true,
			r: 3,
		},
		cannon: {
			speed: 3,
			bps: 1,
			spread: 0,
			damage: 100,
			sps: .50,
			pierce: true,
			r: 8,
		},
	}
}
player.gun = player.weapon_list.pistol
var mouse = {
	x: 0,
	y: 0,
	angle: 0,
}
var enemies = []
var bullets = []
var hyp;
var leftKey = false;
var rightKey = false;
var upKey = false;
var downKey = false;
//
//
//
//
function init(){
	createEnemy(1)
	loop()
}


function setAngle(e){
	mouse.x = e.clientX -10;
	mouse.y = e.clientY -10;
	hyp = Math.round(Math.sqrt((Math.pow(mouse.y-player.y,2))+(Math.pow(mouse.x-player.x,2))))
	mouse.angle = Math.round((180/Math.PI)*Math.asin((mouse.y-player.y)/hyp))
}

function drawPlayer(){
	ctx.fillStyle='rgb('+(255-2*player.hp)+',0,0)'
	ctx.beginPath();
	ctx.arc(player.x,player.y,player.r,0,2*Math.PI)
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.arc(mouse.x,mouse.y,2,0,2*Math.PI)
	ctx.closePath();
	ctx.fill()
}
function animatePlayer(){
	if(leftKey){player.x-= player.speed}
	else if(rightKey){player.x+= player.speed}
	if(upKey){player.y-= player.speed}
	else if(downKey){player.y+= player.speed}
	
	//if(globaltick % 60 == 0){console.log(player.hp)}
	if(player.hp <= 0){gameOver()}
	if(globaltick % 60 == 0){player.hp ++}
	
	player.chance = player.kills
	
	//if(player.totalkills == 20){player.gun = player.weapon_list.shotgun}
	//if(player.totalkills == 40){player.gun = player.weapon_list.rifle}
}

function createEnemy(amount){
	for(var i=0; i<amount; i++){
		var ran = Math.random()
		var ran2 = 450-Math.floor(Math.random()*450)
		if(ran < .25){
			var x = ran2 + 360
			var y = Math.sqrt((450*450)-(ran2*ran2)) + 240
		}
		else if(ran > .25 && ran <= .5){
			var x = -ran2 + 360
			var y = Math.sqrt((450*450)-(ran2*ran2)) + 240
		}
		else if(ran > .5 && ran <= .75){
			var x = -ran2 + 360
			var y = -Math.sqrt((450*450)-(ran2*ran2)) + 240
		}
		else{
			var x = ran2 + 360
			var y = -Math.sqrt((450*450)-(ran2*ran2)) + 240
		}
		var speed = Math.floor(Math.random()*5)+1
		var hp = 80/speed
		var r = 20/speed + 7
		enemies.push([x,y,speed,hp,r])
	}
}
function drawEnemy(){
	ctx.fillStyle='rgb(0,0,0)'
	for (var i=0; i<enemies.length; i++){
		ctx.beginPath();
		ctx.arc(enemies[i][0],enemies[i][1],enemies[i][4],0,2*Math.PI)
		ctx.closePath();
		ctx.fill();
	}
}
function animateEnemy(){
	for (var i=0; i<enemies.length; i++){
		var x = enemies[i][0];
		var y = enemies[i][1];
		var s = enemies[i][2];
		var dirx = player.x - x;
		var diry = player.y - y;
		var hyp = Math.sqrt((dirx*dirx)+(diry*diry));
		dirx /= hyp;
		diry /= hyp;
		enemies[i][0] += dirx*s;
		enemies[i][1] += diry*s;

		if(enemies[i][3] <= 0){
			enemies.splice(i,1);
			player.kills++
			player.totalkills++
			var ran = Math.floor(Math.random()*100)
			if(ran <= player.chance){
				createEnemy(2);
			}
			else{createEnemy(1)}
		}
	}
}
var lastShot = new Date()
lastShot.getDate();

function shoot(){
	var thisShot = new Date();
	thisShot.getDate();
	var tempspread = player.gun.spread
	var r = player.gun.r
	if(thisShot-lastShot > 1000/player.gun.sps){
		if(player.gun.spread == 0){
			var angle = mouse.angle
			var dirx = mouse.x - player.x;
			var diry = mouse.y - player.y;
			var hyp = Math.sqrt((dirx*dirx)+(diry*diry))
			dirx /= hyp
			diry /= hyp
			for (var i=0; i<player.gun.bps; i++){
			
				bullets.push([player.x,player.y,dirx,diry,player.gun.speed,r])
			}
		}
		else{
			for (var i=0; i<player.gun.bps; i++){
				if((mouse.x < player.x && mouse.y < player.y)){
					var dirx = (mouse.x) - (player.x);
					dirx /= 2
					dirx += player.gun.spread
					var diry = (mouse.y) - (player.y);
					diry /= 2
					diry += player.gun.spread
					player.gun.spread *= -1.6;
				}
				else if((mouse.x > player.x && mouse.y > player.y)){
					var dirx = ((mouse.x) - (player.x))
					dirx /= 2
					dirx += player.gun.spread;
					var diry = ((mouse.y) - (player.y))
					diry /= 2
					diry += player.gun.spread;
					player.gun.spread *= -1.6;
				}
				else{
					var dirx = (mouse.x) - (player.x)
					dirx += player.gun.spread;
					var diry = (mouse.y) - (player.y)
					diry += player.gun.spread;
					player.gun.spread *= -1.5;
				}
				var hyp = Math.sqrt((dirx*dirx)+(diry*diry))
				dirx /= hyp
				diry /= hyp
				bullets.push([player.x,player.y,dirx,diry,player.gun.speed,r])
				
			}
			
		}
		
		
		lastShot = thisShot
		player.gun.spread = tempspread
	}
}
function drawBullets(){
	for (var i=0; i<bullets.length; i++){
		ctx.beginPath();
		ctx.arc(bullets[i][0],bullets[i][1],bullets[i][5],0,2*Math.PI)
		ctx.closePath();
		ctx.fill();
		bullets[i][0] += bullets[i][2]*bullets[i][4];
		bullets[i][1] += bullets[i][3]*bullets[i][4];
	}
}

function checkCollision(){
	for (var j=0; j<enemies.length; j++){
		var ex = enemies[j][0];
		var ey = enemies[j][1];
		for (var i=0; i<bullets.length; i++){
			var bx = bullets[i][0];
			var by = bullets[i][1];
			var dist = Math.sqrt((ey-by)*(ey-by)+(ex-bx)*(ex-bx))
			if(dist < enemies[j][4]){
				enemies[j][3]-= player.gun.damage;
				if(!player.gun.pierce){bullets.splice(i,1)}
			}
		}
		var dist2 = Math.sqrt((player.y-ey)*(player.y-ey)+(player.x-ex)*(player.x-ex))
		if(dist2 < player.r + enemies[j][4]){player.hp--}
	}
}
alph = 0
var tempfired = false;
var text = ''
function drawText(){
	alph *= .95
	ctx.font = '24px Georgia'
	ctx.fillStyle='rgba(0,0,0,'+alph+')'
	if(!tempfired && player.totalkills == 20){alph = 1;tempfired=true;text = 'Shotgun Unlocked'}
	if(player.totalkills == 21){tempfired=false;}
	if(!tempfired && player.totalkills == 40){alph = 1;tempfired=true;text = 'Rifle Unlocked'}
	if(player.totalkills == 21){tempfired=false;}
	ctx.fillText(text,265,220)
}

function gameOver(){
	alert('game over\nkills: '+player.kills)
	enemies = []
	bullets = []
	player.x = 360
	player.y = 240
	player.hp = 100
	rightKey = false;
	leftKey = false;
	upKey = false;
	downKey = false;
	player.kills = 0;
	//player.gun = player.weapon_list.pistol
	createEnemy(1)
	
}

canvas.addEventListener('mousemove',setAngle)
document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)
document.addEventListener('mousedown',function(){player.shooting=true})
document.addEventListener('mouseup',function(){player.shooting=false})

function keyDown(e){
	//console.log(e.keyCode)
	if(e.keyCode == 76){player.hp = 999999; player.totalkills = 999}
	
	//press 1 to pistol
	//press 2 for shotgun
	//press 3 for rifle
	//etc.
	
	if(e.keyCode == 49 && player.totalkills >= 0){player.gun = player.weapon_list.pistol;console.log('change')}
	if(e.keyCode == 50 && player.totalkills >= 20){player.gun = player.weapon_list.shotgun;console.log('change')}
	if(e.keyCode == 51 && player.totalkills >= 40){player.gun = player.weapon_list.rifle;console.log('change')}
	if(e.keyCode == 52 && player.totalkills >= 0){player.gun = player.weapon_list.sniper;console.log('change')}
	if(e.keyCode == 53 && player.totalkills >= 0){player.gun = player.weapon_list.cannon;console.log('change')}
	
	
	if(e.keyCode == 32){
		if(player.shooting){
			player.shooting = false}
		else{player.shooting = true}
	}
	if(e.keyCode == 65){leftKey = true}
	else if(e.keyCode == 87){upKey = true}
	if(e.keyCode == 68){rightKey = true}
	else if(e.keyCode == 83){downKey = true}
}
function keyUp(e){
	//if(e.keyCode == 32){player.shooting = false}
	if(e.keyCode == 65){leftKey = false}
	else if(e.keyCode == 87){upKey = false}
	if(e.keyCode == 68){rightKey = false}
	else if(e.keyCode == 83){downKey = false}
}
var globaltick = 0
function loop(){
	globaltick ++
	ctx.clearRect(0,0,720,480)
	ctx.beginPath();
	ctx.arc(360,240,450,0,2*Math.PI)
	ctx.stroke();
	animatePlayer()
	animateEnemy()
	checkCollision()
	drawBullets()
	drawText()
	drawPlayer()
	drawEnemy()
	if(player.shooting){shoot()}
	
	requestAnimationFrame(loop)
}
window.onload=init()