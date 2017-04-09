const healthImage = new Image();
healthImage.src = './img/interface/health.png';
let score = 0;

const drawStartScreen = function(context) {
	const logo = new Image();
	logo.src = './img/interface/planet.png';

	context.fillStyle = 'rgba(0, 0, 0, .8)';
	context.fillRect(0, 0, 1481, 700);

	context.drawImage(logo, 80, 70);

	context.font = '108px Agency FB';
	context.fillStyle = '#ffffff';
	context.fillText('The Last Stand', 920, 250);

	context.font = '48px Agency FB';
	context.fillText('Click to PLAY', 1060, 380);
	context.save();

	context.font = '36px Agency FB';
	context.fillText('Use arrow keys to move', 1020, 470);
	context.fillText('Use the Space key to shoot', 1005, 520);
	context.fillText('Use the R key to force reload', 992, 570);

	context.font = '26px Agency FB';
	context.fillText('JSkills Game Team © 2017', 645, 680);
	context.restore();
};

const drawInterface = function(context, object, ammoImages, isUltReady) {
	let healthImagePos = 1415;
	for (let i = 0; i < object.health; i++) {
		context.drawImage(healthImage, healthImagePos, 30);
		healthImagePos -= 50;
	}

	if (isUltReady) {
		context.font = '32px Agency FB';
		context.fillStyle = '#ffffff';
		context.fillText('Press Q to activate KTA', 655, 600);
	} else {
		context.font = '32px Agency FB';
		context.fillStyle = '#ffffff';
		context.fillText('KTA is not ready', 655, 600);
	}

    let weaponImagePos = 40;
   	for (let i = 1; i < ammoImages.length; i++) {
       context.drawImage(ammoImages[i], weaponImagePos, 30);
       if (i == object.guns.indexOf(object.currentGun) + 1) {
		   context.drawImage(ammoImages[0], weaponImagePos - 3, 27);
       }
       weaponImagePos += 90;
    }

	context.fillText(score, 735, 67);
};

const increaseScore = function() {
	score += 10;
};

const getScore = function() {
	return score;
}

const drawWeaponIndicator = function(context, object) {
	context.beginPath();
	context.moveTo(object.x + 35, object.y + 10);
	if (object.currentGun.currentBulletsAmount !== 0) {
		context.strokeStyle = '#fff200';
		context.lineTo(object.x + 35 + 53 * (object.currentGun.currentBulletsAmount / object.currentGun.bulletCapacity), object.y + 10);
	} else {
		context.strokeStyle = '#8b0000';
		context.lineTo(object.x + 35 + 53 * ((Date.now() - object.currentGun.countdownStart) / object.currentGun.reloadingCooldown), object.y + 10);
	}
	context.closePath();
	context.stroke();
};

const drawPause = function(context) {
	context.fillStyle = 'rgba(127, 62, 162, 0.5)';
	context.fillRect(0, 0, 1481, 700);

	context.font = '92px Agency FB';
	context.fillStyle = '#ffffff';
	context.fillText('PAUSE', 655, 370);

	context.font = '26px Agency FB';
	context.fillText('JSkills Game Team © 2017', 645, 680);

	context.font = '48px Agency FB';
};

const gameOver = function(context) {
	context.save();
	context.font = 'bold 140px Agency FB';
	context.fillStyle = '#d03f9e';
	context.fillText('G A M E   O V E R', 370, 370);

	context.font = '36px Agency FB';
	context.fillStyle = '#ffffff';
	context.fillText('Click to TRY AGAIN', 645, 460);

	context.font = '26px Agency FB';
	context.fillText('JSkills Game Team © 2017', 645, 680);
	context.restore();
};

export {drawStartScreen, drawInterface, increaseScore, drawWeaponIndicator, drawPause, gameOver, getScore};
