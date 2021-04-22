let canvasWidth, canvasHeight;
let dungeonJSON;
let dungeon;
let map;
let currentScreen;
let MAPX, MAPY;
let mapXPos, mapYPos;
let T, L, B, R, TL, TR, TB, LR, BL, BR, TLR, TBL, TBR, BLR, TBLR;
let inkSS, quillSS, ink, quill;
let playerSS;
let pWalkUp, pWalkDown, pWalkLeft, pWalkRight, pIdleUp, pIdleDown, pIdleLeft, pIdleRight;
let idleFrameCount;
let walkFrameCount;
let gameState;
let player;
let mapOpen;
let penColor;

let merchant;

function preload() {
  canvasWidth = 1280;
  canvasHeight = 768;
  merchant = loadFont('assets/Merchant Copy.ttf');

  T = loadImage('assets/T.png');
  L = loadImage('assets/L.png');
  B = loadImage('assets/B.png');
  R = loadImage('assets/R.png');
  TL = loadImage('assets/TL.png');
  TR = loadImage('assets/TR.png');
  TB = loadImage('assets/TB.png');
  LR = loadImage('assets/LR.png');
  BL = loadImage('assets/BL.png');
  BR = loadImage('assets/BR.png');
  TLR = loadImage('assets/TLR.png');
  TBL = loadImage('assets/TBL.png');
  TBR = loadImage('assets/TBR.png');
  BLR = loadImage('assets/BLR.png');
  TBLR = loadImage('assets/TBLR.png');
  playerSS = loadImage('assets/Player Spritesheet.png');
  inkSS = loadImage('assets/Ink.png');
  quillSS = loadImage('assets/Quill.png')
  playerUp = playerDown = playerLeft = playerRight = false;
  gameState = GameState.START;
  penColor = Color.BLACK;
  mapOpen = false;
  mapXPos = 215;
  mapYPos = 159;

  dungeonJSON = loadJSON('assets/Map.json');
  MAPX = 8;
  MAPY = 9;
  idleFrameCount = walkFrameCount = 0;

  player = new Player(96, 5, canvasWidth / 2, canvasHeight / 2);
}

function setup() {
  createCanvas(1280, 768);
  textFont(merchant);
  textSize(32);
  noCursor();

  dungeon = new Dungeon();
  for (var i = 0; i < MAPX; i++) {
    for (var j = 0; j < MAPY; j++) {
      dungeon.screens[i][j] = new Screen(dungeonJSON[i][j].doorConfig, i, j);
    }
  }

  map = new Map();
  for (var i = 0; i < MAPX; i++) {
    for (var j = 0; j < MAPY; j++) {
      map.screens[i][j] = new Screen(DoorConfig.None, i, j);
    }
  }

  currentScreen = dungeon.screens[5][4];
  var playerSpriteW = playerSS.width / 4;
  var playerSpriteH = playerSS.height / 8;
  var ISW = inkSS.width / 5;
  var ISH = inkSS.height;
  var IQW = quillSS.width / 5;
  var IQH = quillSS.height;

  pWalkUp = [];
  pWalkDown = [];
  pWalkLeft = [];
  pWalkRight = [];
  pIdleUp = [];
  pIdleDown = [];
  pIdleLeft = [];
  pIdleRight = [];
  for (var i = 0; i < 4; i++) {
    append(pWalkUp, playerSS.get(i % 4 * playerSpriteW, 0, playerSpriteW, playerSpriteH));
    append(pWalkDown, playerSS.get(i % 4 * playerSpriteW, playerSpriteH, playerSpriteW, playerSpriteH));
    append(pWalkLeft, playerSS.get(i % 4 * playerSpriteW, playerSpriteH * 2, playerSpriteW, playerSpriteH));
    append(pWalkRight, playerSS.get(i % 4 * playerSpriteW, playerSpriteH * 3, playerSpriteW, playerSpriteH));
  }

  for (var i = 0; i < 3; i++) {
    append(pIdleUp, playerSS.get(i % 4 * playerSpriteW, playerSpriteH * 4, playerSpriteW, playerSpriteH));
    append(pIdleDown, playerSS.get(i % 4 * playerSpriteW, playerSpriteH * 5, playerSpriteW, playerSpriteH));
    append(pIdleLeft, playerSS.get(i % 4 * playerSpriteW, playerSpriteH * 6, playerSpriteW, playerSpriteH));
    append(pIdleRight, playerSS.get(i % 4 * playerSpriteW, playerSpriteH * 7, playerSpriteW, playerSpriteH));
  }

  ink = [];
  quill = [];
  for (var i = 0; i < 5; i++) {
    append(ink, inkSS.get(i % 5 * ISW, 0, ISW, ISH));
    append(quill, quillSS.get(i % 5 * IQW, 0, IQW, IQH));
  }
}

function draw() {
  if (frameCount % 8 == 0) {
    walkFrameCount++;
  }
  if (frameCount % 14 == 0) {
    idleFrameCount++;
  }

  currentScreen.drawBG();

  imageMode(CENTER);
  player.animate();

  if (mapOpen) {
    showMap();
  }
}

// User input //

function mouseClicked() {
  switch (gameState) {
    case GameState.INTRO:
      break;
    case GameState.START:
      if (mapOpen) {
        changePenColor();
        editDoors();
      }
      break;
    case GameState.GAMEOVER:
      break;
  }
}

function keyPressed() {
  switch (gameState) {
    case GameState.INTRO:
      break;
    case GameState.START:
      switch (key) {
        case 'w':
          player.move(Direction.UP, true);
          break;
        case 's':
          player.move(Direction.DOWN, true);
          break;
        case 'a':
          player.move(Direction.LEFT, true);
          break;
        case 'd':
          player.move(Direction.RIGHT, true);
          break;
        case 'm':
          mapOpen = !mapOpen;
          break;
      }
      break;
    case GameState.GAMEOVER:
      break;
  }
}

function keyReleased() {
  switch (gameState) {
    case GameState.INTRO:
      break;
    case GameState.START:
      switch (key) {
        case 'w':
          player.move(Direction.UP, false);
          break;
        case 's':
          player.move(Direction.DOWN, false);
          break;
        case 'a':
          player.move(Direction.LEFT, false);
          break;
        case 'd':
          player.move(Direction.RIGHT, false);
          break;
      }
      break;
    case GameState.GAMEOVER:
      break;
  }
}

// Classes //

class Player {
  constructor(size, speed, xPos, yPos) {
    this.size = size;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.setHitBox();
    this.up = this.down = this.left = this.right = false;
    this.idleU = this.idleD = this.idleL = this.idleR = false;
  }

  setHitBox() {
    this.xMin = this.xPos - (this.size / 3);
    this.xMax = this.xPos + (this.size / 3);
    this.yMin = this.yPos - (this.size / 2);
    this.yMax = this.yPos + (this.size / 2);
  }

  collidingUp(doorConfig, buffer) {
    return collide(doorConfig, this.xMin, this.xMax, this.yMin - buffer, this.yMax);
  }

  collidingDown(doorConfig, buffer) {
    return collide(doorConfig, this.xMin, this.xMax, this.yMin, this.yMax + buffer);
  }

  collidingLeft(doorConfig, buffer) {
    return collide(doorConfig, this.xMin - buffer, this.xMax, this.yMin, this.yMax);
  }

  collidingRight(doorConfig, buffer) {
    return collide(doorConfig, this.xMin, this.xMax + buffer, this.yMin, this.yMax);
  }

  animate() {
    this.isWalking = (this.up || this.down || this.left || this.right);
    if (this.isWalking) {
      this.walk();
      if (this.up) {
        this.drawFrame(pWalkUp[walkFrameCount % 4]);
      } else if (this.down) {
        this.drawFrame(pWalkDown[walkFrameCount % 4]);
      } else if (this.left) {
        this.drawFrame(pWalkLeft[walkFrameCount % 4]);
      } else if (this.right) {
        this.drawFrame(pWalkRight[walkFrameCount % 4]);
      }
    } else {
      if (this.idleU) {
        this.drawFrame(pIdleUp[idleFrameCount % 3]);
      } else if (this.idleL) {
        this.drawFrame(pIdleLeft[idleFrameCount % 3]);
      } else if (this.idleR) {
        this.drawFrame(pIdleRight[idleFrameCount % 3]);
      } else if (this.idleD) {
        this.drawFrame(pIdleDown[idleFrameCount % 3]);
      } else {
        this.drawFrame(pIdleDown[idleFrameCount % 3]);
      }
    }
  }

  walk() {
    var dc = currentScreen.doorConfig;
    this.travel();
    if (this.up && !this.collidingUp(dc, this.speed)) {
      this.yPos -= this.speed;
    }
    if (this.down && !this.collidingDown(dc, this.speed)) {
      this.yPos += this.speed;
    }
    if (this.left && !this.collidingLeft(dc, this.speed)) {
      this.xPos -= this.speed;
    }
    if (this.right && !this.collidingRight(dc, this.speed)) {
      this.xPos += this.speed;
    }
    this.setHitBox();

  }

  move(direction, walk) {
    switch (direction) {
      case Direction.UP:
        this.up = walk;
        if (walk) {
          this.idleU = true;
          this.idleD = this.idleL = this.idleR = false;
        }
        break;
      case Direction.DOWN:
        this.down = walk;
        if (walk) {
          this.idleD = true;
          this.idleU = this.idleL = this.idleR = false;
        }
        break;
      case Direction.LEFT:
        this.left = walk;
        if (walk) {
          this.idleL = walk;
          this.idleU = this.idleD = this.idleR = false;
        }
        break;
      case Direction.RIGHT:
        this.right = walk;
        if (walk) {
          this.idleR = walk;
          this.idleU = this.idleD = this.idleL = false;
        }
        break;
    }
  }

  travel() {
    var buffer = this.speed;
    if (this.up) {
      if (edge(Direction.UP, this.xMin, this.xMax, this.yMin - buffer, this.yMax)) {
        changeScreen(Direction.UP);
        this.yPos = canvasHeight - buffer;
      }
    }
    if (this.down) {
      if (edge(Direction.DOWN, this.xMin, this.xMax, this.yMin, this.yMax + buffer)) {
        changeScreen(Direction.DOWN);
        this.yPos = buffer;
      }
    }
    if (this.left) {
      if (edge(Direction.LEFT, this.xMin - buffer, this.xMax, this.yMin - buffer, this.yMax)) {
        changeScreen(Direction.LEFT);
        this.xPos = canvasWidth - buffer;
      }
    }
    if (this.right) {
      if (edge(Direction.RIGHT, this.xMin, this.xMax + buffer, this.yMin - buffer, this.yMax)) {
        changeScreen(Direction.RIGHT);
        this.xPos = buffer;
      }
    }
  }

  drawFrame(frame) {
    image(frame, this.xPos, this.yPos, this.size, this.size);
  }

}

class Screen {
  constructor(doorConfig, i, j) {
    this.doorConfig = doorConfig;
    this.i = i;
    this.j = j;
  }

  drawBG() {
    bg(this.doorConfig);
  }

  drawCell() {
    noFill();
    stroke(171, 160, 132);
    strokeWeight(1);
    rect((this.i * 100) + mapXPos, (this.j * 50) + mapYPos, 100, 50);
    
    strokeWeight(3);
    drawPath(this.i, this.j, this.doorConfig);
  }

  editDoor(direction) {
    this.doorConfig = doorToConfig(this.doorConfig, direction); 
  }
}

class Dungeon {
  constructor() {
    this.screens = [];
    for (var j = 0; j < MAPY; j++) {
      this.screens[j] = [];
    }
  }
}

class Map {
  constructor() {
    this.screens = [];
    for (var j = 0; j < MAPY; j++) {
      this.screens[j] = [];
    }
  }
}

// Helper functions //

function changePenColor() {
  var penXMin = mouseX - 35;
  var penXMax = mouseX - 15;
  var penYMin = mouseY + 15;
  var penYMax = mouseY + 35;
  var inkXMin = canvasWidth - 254;
  var inkXMax = canvasWidth - 186;
  var inkYPos = canvasHeight - 196;
  var penX = (penXMin >= inkXMin && penXMax <= inkXMax);
  if (penX) {
    if (penYMin >= inkYPos - 214 && penYMax <= inkYPos - 146) {
      penColor = Color.CRIMSON;
    } else if (penYMin >= inkYPos - 154 && penYMax <= inkYPos - 86) {
      penColor = Color.VIOLET;
    } else if (penYMin >= inkYPos - 94 && penYMax <= inkYPos - 26) {
      penColor = Color.INDIGO;
    } else if (penYMin >= inkYPos - 34 && penYMax <= inkYPos + 46) {
      penColor = Color.EMERALD;
    } else if (penYMin >= inkYPos - 434 && penYMax <= inkYPos + 366) {
      penColor = Color.BLACK;
    }
  }
}

function drawPen(c, size) {
  switch(c) {
  case Color.BLACK:
    image(quill[0], mouseX, mouseY, size, size);
    break;
  case Color.CRIMSON:
    image(quill[1], mouseX, mouseY, size, size);
    break;
  case Color.VIOLET:
    image(quill[2], mouseX, mouseY, size, size);
    break;
  case Color.INDIGO:
    image(quill[3], mouseX, mouseY, size, size);
    break;
  case Color.EMERALD:
    image(quill[4], mouseX, mouseY, size, size);
    break;
  }
}

function drawInk(xPos, yPos, size) {
  image(ink[4], xPos, yPos, size, size);
  image(ink[3], xPos, yPos - 60, size, size);
  image(ink[2], xPos, yPos - 120, size, size);
  image(ink[1], xPos, yPos - 180, size, size);
  image(ink[0], xPos, yPos - 400, size, size);
}

function showMap() {
  var penX = mouseX - 35;
  var penY = mouseY + 35;
  fill(209, 192, 155);
  rectMode(CENTER);
  strokeWeight(1);
  rect(canvasWidth / 2, canvasHeight / 2, 1000, 600);

  rectMode(CORNER);
  noFill();
  stroke(171, 160, 132);
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 9; j++) {
      map.screens[i][j].drawCell();
      stroke(171, 160, 132);
      if (penColor == Color.BLACK) {
        if (penX > mapXPos + 10 && penY > mapYPos + 10) {
          strokeWeight(3);
          if (penX >= i * 100 + mapXPos && penX <= i * 100 + mapXPos + 100 && penY >= j * 50 + mapYPos - 10 && penY <= j * 50 + mapYPos + 10) {
            line(i * 100 + mapXPos + 40, j * 50 + mapYPos - 5, i * 100 + mapXPos + 40, j * 50 + mapYPos + 5);
            line(i * 100 + mapXPos + 60, j * 50 + mapYPos - 5, i * 100 + mapXPos + 60, j * 50 + mapYPos + 5);
          } else if (penX >= i * 100 + mapXPos - 10 && penX <= i * 100 + mapXPos + 10 && penY >= j * 50 + mapYPos && penY < j * 50 + mapYPos + 50) {
            line(i * 100 + mapXPos - 5, j * 50 + mapYPos + 15, i * 100 + mapXPos + 5, j * 50 + mapYPos + 15);
            line(i * 100 + mapXPos - 5, j * 50 + mapYPos + 35, i * 100 + mapXPos + 5, j * 50 + mapYPos + 35);
          }
        }
      }
    }
  }

  drawInk(canvasWidth - 220, canvasHeight - 196, 68);
  drawPen(penColor, 128);

  fill(0);
  text(str((int)(penX - mapXPos)) + ", " + str((int)(penY - mapYPos)), mapXPos, mapYPos - 20);
}

function editDoors() {
  var penX = mouseX - 35;
  var penY = mouseY + 35;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 9; j++) {
      if (penColor == Color.BLACK) {
        if (penX > mapXPos + 10 && penY > mapYPos + 10) {
          if (penX >= i*100 + mapXPos && penX <= i*100 + mapXPos + 100 && penY >= j*50 + mapYPos - 10 && penY <= j*50 + mapYPos + 10) {
            map.screens[i][j - 1].editDoor(Direction.DOWN);
            map.screens[i][j].editDoor(Direction.UP);
          } else if (penX >= i*100 + mapXPos - 10 && penX <= i*100 + mapXPos + 10 && penY >= j*50 + mapYPos && penY < j*50 + mapYPos + 50) {
            map.screens[i - 1][j].editDoor(Direction.RIGHT);
            map.screens[i][j].editDoor(Direction.LEFT);
          }
        }
      }
    }
  }
}

function edge(direction, xMin, xMax, yMin, yMax) {
  switch (direction) {
    case Direction.UP:
      return yMin < 0;
    case Direction.DOWN:
      return yMax > canvasHeight;
    case Direction.LEFT:
      return xMin < 0;
    case Direction.RIGHT:
      return xMax > canvasWidth;
    default:
      return false;
  }
}

function changeScreen(direction) {
  var i = currentScreen.i;
  var j = currentScreen.j;
  switch (direction) {
    case Direction.UP:
      if (j > 0) {
        currentScreen = dungeon.screens[i][j - 1];
      }
      break;
    case Direction.DOWN:
      if (j < MAPY - 1) {
        currentScreen = dungeon.screens[i][j + 1];
      }
      break;
    case Direction.LEFT:
      if (i > 0) {
        currentScreen = dungeon.screens[i - 1][j];
      }
      break;
    case Direction.RIGHT:
      if (i < MAPX - 1) {
        currentScreen = dungeon.screens[i + 1][j];
      }
      break;
  }
}

function collide(doorConfig, xMin, xMax, yMin, yMax) {
  switch (doorConfig) {
    case DoorConfig.T:
      return left(xMin) || bottom(yMax) || right(xMax)
        || topLeftTop(xMin, yMin) || topRightTop(xMax, yMin);
    case DoorConfig.B:
      return cTop(yMin) || left(xMin) || right(xMax)
        || bottomLeftBottom(xMin, yMax) || bottomRightBottom(xMax, yMax);
    case DoorConfig.L:
      return cTop(yMin) || bottom(yMax) || right(xMax)
        || topLeftLeft(xMin, yMin) || bottomLeftLeft(xMin, yMax);
    case DoorConfig.R:
      return cTop(yMin) || bottom(yMax) || left(xMin)
        || topRightRight(xMax, yMin) || bottomRightRight(xMax, yMax);
    case DoorConfig.TL:
      return right(xMax) || bottom(yMax)
        || topRightTop(xMax, yMin) || topLeftTop(xMin, yMin)
        || topLeftLeft(xMin, yMin) || bottomLeftLeft(xMin, yMax);
    case DoorConfig.TB:
      return left(xMin) || right(xMax)
        || topLeftTop(xMin, yMin) || topRightTop(xMax, yMin)
        || bottomLeftBottom(xMin, yMax) || bottomRightBottom(xMax, yMax);
    case DoorConfig.TR:
      return left(xMin) || bottom(yMax)
        || topLeftTop(xMin, yMin) || topRightTop(xMax, yMin)
        || topRightRight(xMax, yMin) || bottomRightRight(xMax, yMax);
    case DoorConfig.BL:
      return cTop(yMin) || right(xMax)
        || topLeftLeft(xMin, yMin) || bottomLeftLeft(xMin, yMax)
        || bottomLeftBottom(xMin, yMax) || bottomRightBottom(xMax, yMax);
    case DoorConfig.BR:
      return cTop(yMin) || left(xMin)
        || topRightRight(xMax, yMin) || bottomRightRight(xMax, yMax)
        || bottomRightBottom(xMax, yMax) || bottomLeftBottom(xMin, yMax);
    case DoorConfig.LR:
      return cTop(yMin) || bottom(yMax)
        || topLeftLeft(xMin, yMin) || topRightRight(xMax, yMin)
        || bottomLeftLeft(xMin, yMax) || bottomRightRight(xMax, yMax);
    case DoorConfig.TLR:
      return bottom(yMax) || bottomLeftLeft(xMin, yMax)
        || topLeftLeft(xMin, yMin) || topLeftTop(xMin, yMin)
        || topRightTop(xMax, yMin) || topRightRight(xMax, yMin)
        || bottomRightRight(xMax, yMax);
    case DoorConfig.TBL:
      return right(xMax) || topRightTop(xMax, yMin)
        || topLeftTop(xMin, yMin) || topLeftLeft(xMin, yMin)
        || bottomLeftLeft(xMin, yMax) || bottomLeftBottom(xMin, yMax)
        || bottomRightBottom(xMax, yMax);
    case DoorConfig.TBR:
      return left(xMin) || topLeftTop(xMin, yMin)
        || topRightTop(xMax, yMin) || topRightRight(xMax, yMin)
        || bottomRightRight(xMax, yMax) || bottomRightBottom(xMax, yMax)
        || bottomLeftBottom(xMin, yMax);
    case DoorConfig.BLR:
      return cTop(yMin) || topLeftLeft(xMin, yMin)
        || bottomLeftLeft(xMin, yMax) || bottomLeftBottom(xMin, yMax)
        || bottomRightBottom(xMax, yMax) || bottomRightRight(xMax, yMax)
        || topRightRight(xMax, yMin);
    case DoorConfig.TBLR:
      return topLeftTop(xMin, yMin) || topLeftLeft(xMin, yMin)
        || topRightTop(xMax, yMin) || topRightRight(xMax, yMin)
        || bottomRightRight(xMax, yMax) || bottomRightBottom(xMax, yMax)
        || bottomLeftLeft(xMin, yMax) || bottomLeftBottom(xMin, yMax);
    default:
      return false;
  }
}

// Collision values for ledges/walls
function cTop(yMin) {
  return (0 <= yMin && yMin <= 88);
}

function bottom(yMax) {
  return (672 <= yMax && yMax <= canvasHeight);
}

function left(xMin) {
  return (0 <= xMin && xMin < 144);
}

function right(xMax) {
  return (1136 <= xMax && xMax <= canvasWidth);
}

function topLeftTop(xMin, yMin) {
  return (0 <= xMin && xMin <= 544 && 0 <= yMin && yMin <= 88);
}

function topLeftLeft(xMin, yMin) {
  return (0 <= xMin && xMin <= 136 && 0 <= yMin && yMin <= 280);
}

function topRightTop(xMax, yMin) {
  return (752 <= xMax && xMax <= canvasWidth && 0 <= yMin && yMin <= 88);
}

function topRightRight(xMax, yMin) {
  return (1142 <= xMax && xMax <= canvasWidth && 0 <= yMin && yMin <= 280);
}

function bottomLeftBottom(xMin, yMax) {
  return (0 <= xMin && xMin <= 546 && 680 <= yMax && yMax < canvasHeight);
}

function bottomLeftLeft(xMin, yMax) {
  return (0 <= xMin && xMin <= 136 && 488 <= yMax && yMax <= canvasHeight);
}

function bottomRightBottom(xMax, yMax) {
  return (736 <= xMax && xMax <= canvasWidth && 680 <= yMax && yMax <= canvasHeight);
}

function bottomRightRight(xMax, yMax) {
  return (1142 <= xMax && xMax <= canvasWidth && 488 <= yMax && yMax <= canvasHeight);
}

// Draws a background based on the given door configuration
function bg(doorConfig) {
  imageMode(CORNER);
  switch (doorConfig) {
    case DoorConfig.T:
      background(T);
      break;
    case DoorConfig.B:
      background(B);
      break;
    case DoorConfig.L:
      background(L);
      break;
    case DoorConfig.R:
      background(R);
      break;
    case DoorConfig.TL:
      background(TL);
      break;
    case DoorConfig.TR:
      background(TR);
      break;
    case DoorConfig.TB:
      background(TB);
      break;
    case DoorConfig.LR:
      background(LR);
      break;
    case DoorConfig.BL:
      background(BL);
      break;
    case DoorConfig.BR:
      background(BR);
      break;
    case DoorConfig.TLR:
      background(TLR);
      break;
    case DoorConfig.TBL:
      background(TBL);
      break;
    case DoorConfig.TBR:
      background(TBR);
      break;
    case DoorConfig.BLR:
      background(BLR);
      break;
    case DoorConfig.TBLR:
      background(TBLR);
      break;
    default:
      background(0);
  }
}

// Draw paths on the map based on each cell's player-editable door configuration
function drawPath(i, j, dc) {
  switch(dc) {
  case DoorConfig.None:
    break;
  case DoorConfig.T:
    line(i*100 + mapXPos + 40, j*50 + mapYPos, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos, i*100 + mapXPos + 60, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 15, i*100 + mapXPos + 60, j*50 + mapYPos + 15);
    break;
  case DoorConfig.B:
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 60, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 35, i*100 + mapXPos + 60, j*50 + mapYPos + 35);
    break;
  case DoorConfig.L:
    line(i*100 + mapXPos, j*50 + mapYPos + 15, i*100 + mapXPos + 15, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 35, i*100 + mapXPos + 15, j*50 + mapYPos + 35);
    line(i*100 + mapXPos + 15, j*50 + mapYPos + 15, i*100 + mapXPos + 15, j*50 + mapYPos + 35);
    break;
  case DoorConfig.R:
    line(i*100 + mapXPos + 85, j*50 + mapYPos + 15, i*100 + mapXPos + 100, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 85, j*50 + mapYPos + 35, i*100 + mapXPos + 100, j*50 + mapYPos + 35);
    line(i*100 + mapXPos + 85, j*50 + mapYPos + 15, i*100 + mapXPos + 85, j*50 + mapYPos + 35);
    break;
  case DoorConfig.TL:
    line(i*100 + mapXPos + 40, j*50 + mapYPos, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos, i*100 + mapXPos + 60, j*50 + mapYPos + 35);
    line(i*100 + mapXPos, j*50 + mapYPos + 15, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 35, i*100 + mapXPos + 60, j*50 + mapYPos + 35);
    break;
  case DoorConfig.TB:
    line(i*100 + mapXPos + 40, j*50 + mapYPos, i*100 + mapXPos + 40, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 60, j*50 + mapYPos, i*100 + mapXPos + 60, j*50 + mapYPos + 50);
    break;
  case DoorConfig.TR:
    line(i*100 + mapXPos + 40, j*50 + mapYPos, i*100 + mapXPos + 40, j*50 + mapYPos + 35);
    line(i*100 + mapXPos + 60, j*50 + mapYPos, i*100 + mapXPos + 60, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 15, i*100 + mapXPos + 100, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 35, i*100 + mapXPos + 100, j*50 + mapYPos + 35);
    break;
  case DoorConfig.BL:
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 15, i*100 + mapXPos + 60, j*50 + mapYPos + 50);
    line(i*100 + mapXPos, j*50 + mapYPos + 15, i*100 + mapXPos + 60, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 35);
    break;
  case DoorConfig.BR:
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 15, i*100 + mapXPos + 40, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 60, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 15, i*100 + mapXPos + 100, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 100, j*50 + mapYPos + 35);
    break;
  case DoorConfig.LR:
    line(i*100 + mapXPos, j*50 + mapYPos + 15, i*100 + mapXPos + 100, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 35, i*100 + mapXPos + 100, j*50 + mapYPos + 35);
    break;
  case DoorConfig.TLR:
    line(i*100 + mapXPos + 40, j*50 + mapYPos, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos, i*100 + mapXPos + 60, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 15, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 15, i*100 + mapXPos + 100, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 35, i*100 + mapXPos + 100, j*50 + mapYPos + 35);
    break;
  case DoorConfig.TBL:
    line(i*100 + mapXPos + 40, j*50 + mapYPos, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 60, j*50 + mapYPos, i*100 + mapXPos + 60, j*50 + mapYPos + 50);
    line(i*100 + mapXPos, j*50 + mapYPos + 15, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 35);
    break;
  case DoorConfig.TBR:
    line(i*100 + mapXPos + 60, j*50 + mapYPos, i*100 + mapXPos + 60, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 60, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 40, j*50 + mapYPos, i*100 + mapXPos + 40, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 15, i*100 + mapXPos + 100, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 100, j*50 + mapYPos + 35);
    break;
  case DoorConfig.BLR:
    line(i*100 + mapXPos, j*50 + mapYPos + 15, i*100 + mapXPos + 100, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 35);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 100, j*50 + mapYPos + 35);
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 60, j*50 + mapYPos + 50);
    break;
  case DoorConfig.TBLR:
    line(i*100 + mapXPos, j*50 + mapYPos + 15, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 15, i*100 + mapXPos + 100, j*50 + mapYPos + 15);
    line(i*100 + mapXPos, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 35);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 100, j*50 + mapYPos + 35);
    line(i*100 + mapXPos + 40, j*50 + mapYPos, i*100 + mapXPos + 40, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 60, j*50 + mapYPos, i*100 + mapXPos + 60, j*50 + mapYPos + 15);
    line(i*100 + mapXPos + 40, j*50 + mapYPos + 35, i*100 + mapXPos + 40, j*50 + mapYPos + 50);
    line(i*100 + mapXPos + 60, j*50 + mapYPos + 35, i*100 + mapXPos + 60, j*50 + mapYPos + 50);
    break;
  }
}

function doorToConfig(doorConfig, direction) {
  switch(doorConfig) {
  case DoorConfig.None:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.T;
    case Direction.DOWN:
      return DoorConfig.B;
    case Direction.LEFT:
      return DoorConfig.L;
    case Direction.RIGHT:
      return DoorConfig.R;
    }
  case DoorConfig.T:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.None;
    case Direction.DOWN:
      return DoorConfig.TB;
    case Direction.LEFT:
      return DoorConfig.TL;
    case Direction.RIGHT:
      return DoorConfig.TR;
    }
  case DoorConfig.B:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.TB;
    case Direction.DOWN:
      return DoorConfig.None;
    case Direction.LEFT:
      return DoorConfig.BL;
    case Direction.RIGHT:
      return DoorConfig.BR;
    }
  case DoorConfig.L:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.TL;
    case Direction.DOWN:
      return DoorConfig.BL;
    case Direction.LEFT:
      return DoorConfig.None;
    case Direction.RIGHT:
      return DoorConfig.LR;
    }
  case DoorConfig.R:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.TR;
    case Direction.DOWN:
      return DoorConfig.BR;
    case Direction.LEFT:
      return DoorConfig.LR;
    case Direction.RIGHT:
      return DoorConfig.None;
    }
  case DoorConfig.TL:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.L;
    case Direction.DOWN:
      return DoorConfig.TBL;
    case Direction.LEFT:
      return DoorConfig.T;
    case Direction.RIGHT:
      return DoorConfig.TLR;
    }
  case DoorConfig.TB:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.B;
    case Direction.DOWN:
      return DoorConfig.T;
    case Direction.LEFT:
      return DoorConfig.TBL;
    case Direction.RIGHT:
      return DoorConfig.TBR;
    }
  case DoorConfig.TR:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.R;
    case Direction.DOWN:
      return DoorConfig.TBR;
    case Direction.LEFT:
      return DoorConfig.TLR;
    case Direction.RIGHT:
      return DoorConfig.T;
    }
  case DoorConfig.BL:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.TBL;
    case Direction.DOWN:
      return DoorConfig.L;
    case Direction.LEFT:
      return DoorConfig.B;
    case Direction.RIGHT:
      return DoorConfig.BLR;
    }
  case DoorConfig.BR:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.TBR;
    case Direction.DOWN:
      return DoorConfig.R;
    case Direction.LEFT:
      return DoorConfig.BLR;
    case Direction.RIGHT:
      return DoorConfig.B;
    }
  case DoorConfig.LR:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.TLR;
    case Direction.DOWN:
      return DoorConfig.BLR;
    case Direction.LEFT:
      return DoorConfig.R;
    case Direction.RIGHT:
      return DoorConfig.L;
    }
  case DoorConfig.TLR:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.LR;
    case Direction.DOWN:
      return DoorConfig.TBLR;
    case Direction.LEFT:
      return DoorConfig.TR;
    case Direction.RIGHT:
      return DoorConfig.TL;
    }
  case DoorConfig.TBL:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.BL;
    case Direction.DOWN:
      return DoorConfig.TL;
    case Direction.LEFT:
      return DoorConfig.TB;
    case Direction.RIGHT:
      return DoorConfig.TBLR;
    }
  case DoorConfig.TBR:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.BR;
    case Direction.DOWN:
      return DoorConfig.TR;
    case Direction.LEFT:
      return DoorConfig.TBLR;
    case Direction.RIGHT:
      return DoorConfig.TB;
    }
  case DoorConfig.BLR:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.TBLR;
    case Direction.DOWN:
      return DoorConfig.LR;
    case Direction.LEFT:
      return DoorConfig.BR;
    case Direction.RIGHT:
      return DoorConfig.BL;
    }
  case DoorConfig.TBLR:
    switch(direction) {
    case Direction.UP:
      return DoorConfig.BLR;
    case Direction.DOWN:
      return DoorConfig.TLR;
    case Direction.LEFT:
      return DoorConfig.TBR;
    case Direction.RIGHT:
      return DoorConfig.TBL;
    }
  default:
    return DoorConfig.None;
  }
}

// enums
const DoorConfig = {
  T: "T",
  B: "B",
  L: "L",
  R: "R",
  TL: "TL",
  TR: "TR",
  BL: "BL",
  BR: "BR",
  TB: "TB",
  LR: "LR",
  TBL: "TBL",
  TBR: "TBR",
  TLR: "TLR",
  BLR: "BLR",
  TBLR: "TBLR",
  None: "None"
}

const GameState = {
  INTRO: "INTRO",
  START: "START",
  GAMEOVER: "GAMEOVER"
}

const Direction = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT"
}

const Color = {
  BLACK: "BLACK",
  CRIMSON: "CRIMSON",
  VIOLET: "VIOLET",
  INDIGO: "INDIGO",
  EMERALD: "EMERALD"
}