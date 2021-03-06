var upgrades = [];
var upgradeGen = {
	frame: 0,
	framesPer: rand_i(480,600),
}
function upgradeGenerator(){
	/*
	upgradeGen.frame ++;
	if(upgradeGen.frame >= upgradeGen.framesPer){
		rand_a([
			function(){new HealthUpgrade(500,rand_i(0,300),rand_i(1,3))},
		])();
		upgradeGen.frame = 0;
		upgradeGen.framesPer = rand_i(480,600);
	}
	*/
}

function Upgrade(x,y){
	upgrades.push(this);

	this.x = x;
	this.y = y;
	
	this.dx = -6;
	this.dy = 0;

	this.onScreen = true;
}
Upgrade.prototype.render = function(){
	if(this.onScreen){
		ctx.drawImage(this.img,this.imgFrameX,this.imgFrameY,this.imgW,this.imgH,this.x,this.y,this.w,this.h);
	}
}
Upgrade.prototype.animate = function(){
	if(willCollide(this,this.dx,0,player)){
		this.onCollide();
	}
	this.dx *= game.global_dxdy;
	this.dy *= game.global_dxdy;
	this.x += this.dx;
	this.y += this.dy;
}
Upgrade.prototype.onCollide = function(){
}

function HealthUpgrade(x,y,amt){
	Upgrade.call(this,x,y);
	this.hp = amt;
	this.img = heart_img;
	this.imgW = heart_img.width;
	this.imgH = heart_img.height;
	this.imgFrameX = 0;
	this.imgFrameY = 0;
	this.w = 20;
	this.h = 20;

	this.onCollide = function(){
		player.hp += this.hp;
		del(this,upgrades);
		sound.play(sound.list.heart_pickup);
	}
}

HealthUpgrade.prototype = Object.create(Upgrade.prototype);
HealthUpgrade.prototype.constructor = HealthUpgrade;

function ShieldUpgrade(x,y,amt){
	Upgrade.call(this,x,y);
	this.strength = amt;
	this.img = heart_img;
	this.imgW = this.img.width;
	this.imgH = this.img.height;
	this.imgFrameX = 0;
	this.imgFrameY = 0;
	this.w = 20;
	this.h = 20;

	this.onCollide = function(){
		player.shield += this.strength;
		del(this,upgrades);
		sound.play(sound.list.heart_pickup);
	}
}

ShieldUpgrade.prototype = Object.create(Upgrade.prototype);
ShieldUpgrade.prototype.constructor = ShieldUpgrade;


function RocketLauncherUpgrade(x,y,amt){
	Upgrade.call(this,x,y);
	this.ammo = amt;
	this.img = rocket_img;
	this.imgW = 16;
	this.imgH = 16;
	this.imgFrameX = 51;
	this.imgFrameY = 23;
	this.w = 20;
	this.h = 20;
	this.onCollide = function(){
		weapons._rocket.ammo += this.ammo;
		weapons._rocket.framesSinceLastShot = 120;
		player.weapon = weapons._rocket;
		del(this,upgrades);
		sound.play(sound.list.rocket_pickup);
	}
}
RocketLauncherUpgrade.prototype = Object.create(Upgrade.prototype);
RocketLauncherUpgrade.prototype.constructor = RocketLauncherUpgrade;



var weapons = {
	_plasma: {
		framesPerShot: 120,
		framesSinceLastShot: 120,
		ammo: 0,
		purchaseCost: 7,
		fire: function(){
			if(this.framesPerShot - this.framesSinceLastShot <= 0 && !game.awaitingInput){
				if(this.ammo <= 0){
					if(!player.next_weapon()){
						sound.play(sound.list.out_of_ammo);
					}
					this.framesSinceLastShot = 0;
				}
				else{
					new Projectile_plasma(player.x+player.w/2,player.y+player.h/2,1,0,enemies);
					this.framesSinceLastShot = 0;
					this.ammo --;
					sound.play(sound.list.plasma_fire);
				}
			}
		},
		purchased: function(){
			this.ammo ++;
		},
	},

	_rocket: {
		framesPerShot: 90,
		framesSinceLastShot: 90,
		ammo: 0,
		purchaseCost: 3,
		fire: function(){
			if(this.framesPerShot - this.framesSinceLastShot <= 0 && !game.awaitingInput){
				if(this.ammo <= 0){
					if(!player.next_weapon()){
						sound.play(sound.list.out_of_ammo);
					}
					this.framesSinceLastShot = 0;
				}
				else{
					new Projectile_rocket(player.x+player.w/2,player.y+player.h/2,1,0,enemies.concat(walls));
					this.framesSinceLastShot = 0;
					this.ammo --;
					sound.play(sound.list.rocket_fire);
				}
			}
			
		},
		purchased: function(){
			this.ammo ++;
		},
	},

	_default: {
		framesPerShot: 20,
		framesSinceLastShot: 60,
		ammo: Infinity,
		purchaseCost: 1,
		fire: function(){
			if(this.framesPerShot - this.framesSinceLastShot <= 0 && !game.awaitingInput){
				effects.screen_shake(1);
				effects.ship.small_particle_explosion(player.x+player.w,player.y+player.h/2,[255,255,51]);
				if(this.ammo <= 0){
					if(!player.next_weapon()){
						sound.play(sound.list.out_of_ammo);
					}
					this.framesSinceLastShot = 0;
					
				}
				else{
					new Projectile_basic(player.x+player.w/2,player.y+player.h/2,1,0,enemies);
					this.framesSinceLastShot = 0;
					sound.play(sound.list.default_fire);
					this.ammo --;
				}
			}
		},
		purchased: function(){
			this.ammo ++;
		},
	},
};



