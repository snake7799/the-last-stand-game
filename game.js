class player {
    constructor() {
        this.plPosX = 1000;
        this.plPosY = 380;
        this.playerPics = ['./Imgs/PlayerPics/Player Frame1.png',
            './Imgs/PlayerPics/Player Frame2.png',
            './Imgs/PlayerPics/Player Frame3.png',
            './Imgs/PlayerPics/Player Frame4.png',
            './Imgs/PlayerPics/Player Frame5.png',
            './Imgs/PlayerPics/Player Frame6.png',
            './Imgs/PlayerPics/Player Frame7.png',
            './Imgs/PlayerPics/Player Frame8.png',
            './Imgs/PlayerPics/Player Frame9.png',
            './Imgs/PlayerPics/Player Frame10.png'
        ];
        this.curFrame = 0;
        this.curFrameInterval = 0;
        this.shootSpeed = 20;
        this.shootInterval = 0;
        this.damage = 1;
    }
}

class shoot {
    constructor() {
        this.shootX = [];
        this.shootY = [];
        this.isShot = false;
    }
}

class enemy {
    constructor(posY) {

    }
}

var field = document.getElementById('gameArea');
var pl;
var Shoot;
var shotImg = new Image();
var ctx = field.getContext('2d');
var plImg = new Image();
var backgoundPic = new Image();

var beginGame = function() {
    pl = new player();
    Shoot = new shoot();
    shotImg.src = './Imgs/PlayerPics/Weapon 1 Fire.png';
    backgoundPic.src = './Imgs/Background.jpg';
    plImg.src = './Imgs/PlayerPics/Player 1 stop.png';
}

var enemyGeneration = function() {

}

var enemyRedraw = function(context) {

}

var playerRedraw = function(context) {
    context.drawImage(backgoundPic, 0, 0, 1280, 640);
    context.drawImage(plImg, pl.plPosX, pl.plPosY);
    if (Shoot.isShot == true) {
        for (var i = 0; i < Shoot.shootX.length; i++) {
            if (Shoot.shootX[i] > 0) {
                context.drawImage(shotImg, Shoot.shootX[i], Shoot.shootY[i]);
                Shoot.shootX[i] -= 10;
            } else {
                Shoot.shootX.shift();
                Shoot.shootY.shift();
            }
        }
    }
}


function chengePlayerFrame() {
    if (pl.curFrame == 9 & pl.curFrameInterval == 3) {
        pl.curFrame = 0;
        pl.curFrameInterval = 0;
        plImg.src = pl.playerPics[pl.curFrame];
    }
    if (pl.curFrameInterval == 3) {
        pl.curFrame++;
        pl.curFrameInterval = 0;
        plImg.src = pl.playerPics[pl.curFrame];
    }
    pl.curFrameInterval++;
}

function chengePlayerFrameBackword() {
    if (pl.curFrame == 0 & pl.curFrameInterval == 3) {
        pl.curFrame = 9;
        pl.curFrameInterval = 0;
        plImg.src = pl.playerPics[pl.curFrame];
    }
    if (pl.curFrameInterval == 3) {
        pl.curFrame--;
        pl.curFrameInterval = 0;
        plImg.src = pl.playerPics[pl.curFrame];
    }
    pl.curFrameInterval++;
}

var keyState = {};

document.addEventListener('keydown', function(e) {
    keyState[e.keyCode || e.which] = true;
}, true);

window.addEventListener('keyup', function(e) {
    keyState[e.keyCode || e.which] = false;
}, true);

var shootDelay = function(delay) {
    if (delay > pl.shootInterval) {
        return false;
    } else {
        return true;
    }
}

document.onkeyup = function playerDefaltActions(e) {
    if (e.keyCode == 38 & pl.plPosY > 281) {
        plImg.src = './Imgs/PlayerPics/Player 1 stop.png';
    }
    if (e.keyCode == 40 & pl.plPosY < 530) {
        plImg.src = './Imgs/PlayerPics/Player 1 stop.png';
    }
    if (e.keyCode == 37 & pl.plPosX > 0) {
        plImg.src = './Imgs/PlayerPics/Player 1 stop.png';
    }
    if (e.keyCode == 39 & pl.plPosX < 1200) {
        plImg.src = './Imgs/PlayerPics/Player 1 stop.png';
    }
    if (e.keyCode == 32) {
        plImg.src = './Imgs/PlayerPics/Player 1 stop.png';
    }
}

var playerActions = function(){
  if (keyState[38] && keyState[37] && pl.plPosY > 281 && pl.plPosX > 0){
    pl.plPosX -= 1.5;
    pl.plPosY -= 1.5;
    chengePlayerFrame();
  } else if (keyState[40] && keyState[37] && pl.plPosY < 530 && pl.plPosX > 0){
    pl.plPosX -= 1.5;
    pl.plPosY += 1.5;
    chengePlayerFrame();
  } else if (keyState[40] && keyState[39] && pl.plPosY < 530 && pl.plPosX < 1200){
    pl.plPosX += 1.5;
    pl.plPosY += 1.5;
    chengePlayerFrameBackword();
  } else if (keyState[38] && keyState[39] && pl.plPosY > 281 && pl.plPosX < 1200){
    pl.plPosX += 1.5;
    pl.plPosY -= 1.5;
    chengePlayerFrameBackword();
  } else if (keyState[37] && pl.plPosX > 0) {
      pl.plPosX -= 3;
      chengePlayerFrame();
  } else if (keyState[39] && pl.plPosX < 1200) {
      pl.plPosX += 3;
      chengePlayerFrameBackword();
  } else if (keyState[40] && pl.plPosY < 530) {
      pl.plPosY += 3;
      chengePlayerFrame();
  } else if (keyState[38] && pl.plPosY > 281) {
      pl.plPosY -= 3;
      chengePlayerFrame();
  } else if (keyState[32]) {
      if (shootDelay(pl.shootSpeed) != false) {
          Shoot.isShot = true;
          pl.shootInterval = 0;
          plImg.src = './Imgs/PlayerPics/Player 1 shoot.png';
          Shoot.shootX.push(pl.plPosX);
          Shoot.shootY.push(pl.plPosY + 17);
      }
  }
}

requestAnimationFrame(function redraw() {
    pl.shootInterval++;
    playerActions();
    playerRedraw(ctx);
    enemyRedraw(ctx);
    requestAnimationFrame(redraw);
})
