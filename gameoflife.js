let w;

let optimize = true;

let play = 0;

let timerMax = 1;
let timer = timerMax;

let dx = 0;
let dy = 1;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB);
  rectMode(CENTER);

  w = new GameOfLife(99, 500, 0, 0);
}

function draw() {
  background(10);
  translate(width / 2, height / 2);
  w.addCell();
  if (play == 1) {
    if (timer == 0) {
      w.step();
      timer = timerMax;
    }
    if (!mouseIsPressed) {
      timer--;
    }
  }
  w.show();

  if (play == 0) {
    stroke(0, 100, 100, 1);
  } else {
    stroke(100, 100, 100, 1);
  }
  strokeWeight(20);
  point(0, -height / 2 + 20);
}

function keyPressed() {
  if (keyCode == 32) {
    if (play == 0) {
      play = 1;
    } else {
      play = 0;
    }
  }
  if (key == "g") {
    let res = w.res;
    w.board[round(res - 1)][round(res / 2 - 1)].state = 1;
    w.board[round(res - 2)][round(res / 2)].state = 1;
    w.board[round(res - 1)][round(res / 2)].state = 1;
    w.board[round(res - 2)][round(res / 2 - 1)].state = 1;
  }
  if (key == "y") {
    let res = w.res;
    w.board[round(res - 1)][round(res / 2 - 1)].state = 1;
    w.board[round(res - 2)][round(res / 2)].state = 1;
    w.board[round(res - 1)][round(res / 2)].state = 1;
    w.board[round(res - 2)][round(res / 2 - 1)].state = 1;

    w.board[round(res - 1)][round((res * 3) / 4)].state = 1;
    w.board[round(res - 1)][round((res * 1) / 4)].state = 1;
    w.board[round(res - 2)][round((res * 3) / 4)].state = 1;
    w.board[round(res - 2)][round((res * 1) / 4)].state = 1;
    w.board[round(res - 3)][round((res * 3) / 4)].state = 1;
    w.board[round(res - 3)][round((res * 1) / 4)].state = 1;
  }

  if (key == "d") {
    let res = w.res;
    w.board[round(res - 1)][round(res / 2 - 1)].state = 1;
    w.board[round(res - 2)][round(res / 2 - 1)].state = 1;
    w.board[round(res - 3)][round(res / 2 - 1)].state = 1;
    w.board[round(res - 1)][round(res / 2 + 2)].state = 1;
    w.board[round(res - 2)][round(res / 2 + 2)].state = 1;
    w.board[round(res - 3)][round(res / 2 + 2)].state = 1;
  }

  if (key == "h") {
    w.step();
  }

  if (key == "c") {
    for (let y = 0; y < w.res; y++) {
      for (let x = 0; x < w.res; x++) {
        w.board[y][x].state = 0;
        w.board[y][x].tempState = 0;
      }
    }
  }

  if (key == "o") {
    optimize = !optimize;
  }
}

class GameOfLife {
  constructor(res, scl, x, y) {
    this.res = res;
    this.size = scl;
    this.scl = scl / res;

    this.board = [];
    this.setup(res);

    this.x = x - scl / 2;
    this.y = y - scl / 2;
  }

  setup(res) {
    this.res = res;
    for (let y = 0; y < this.res; y++) {
      this.board[y] = [];
      for (let x = 0; x < this.res; x++) {
        this.board[y][x] = new Cell(0);
      }
    }
  }

  addCell() { 
    if (mouseIsPressed) {
      let mx = mouseX - width / 2 - this.scl / 2 - this.size / 2;
      let my = mouseY - height / 2 - this.scl / 2 - this.size / 2;
      let rmx = round(mx / this.scl) + this.res;
      let rmy = round(my / this.scl) + this.res;
      if (rmx >= 0 && rmx < this.res && rmy >= 0 && rmy < this.res) {
        this.board[rmy][rmx].state = 1;
        this.board[rmy][rmx].tempState = 1;
      }
    }
  }

  show() {
    push();
    noStroke();
    fill(50);
    rect(0, 0, this.scl * this.res + 20, this.scl * this.res + 20);
    fill(16);
    rect(0, 0, this.scl * this.res + 15, this.scl * this.res + 15);
    pop();
    for (let y = 0; y < this.res; y++) {
      for (let x = 0; x < this.res; x++) {
        this.board[y][x].setData(x, y, this.x, this.y, this.scl);
        this.board[y][x].show();
      }
    }
  }

  step() {
    for (let y = 0; y < this.res; y++) {
      for (let x = 0; x < this.res; x++) {
        this.neighbors(x, y);
      }
    }
    for (let y = 0; y < this.res; y++) {
      for (let x = 0; x < this.res; x++) {
        this.board[y][x].setState();
      }
    }
  }

  neighbors(x, y) {
    let population = 0;
    let s = 1;
    for (let k = -s; k <= s; k++) {
      for (let j = -s; j <= s; j++) {
        let index = findIndex(x + j, y + k, this.res, this.res);
        if ((j == 0) & (k == 0)) {
        } else {
          if (this.board[index[1]][index[0]].state == 1) {
            population += 1;
          }
        }
      }
    }
        //I was suggested to make this optimize feature here but in my testing it doesn't seem to have a noticeable effect on the performance. I will still leave it here though!
    if (optimize) {
      if (population == 0) {
        this.board[y][x].tempState = this.board[y][x].state;
        return;
      }
    }
    let index = findIndex(x + dx, y + dy, this.res, this.res);
    if (this.board[index[1]][index[0]].state == 1) {
      this.board[y][x].tempState = 1;
    } else {
      if (this.board[y][x].state == 1) {
        if (population < 2) {
          this.board[y][x].tempState = 0;
        } else if (population >= 2 && population <= 3) {
          this.board[y][x].tempState = 1;
        } else if (population > 3) {
          this.board[y][x].tempState = 0;
        }
      } else {
        if (population == 3) {
          this.board[y][x].tempState = 1;
        }
      }
    }
  }
}

class Cell {
  constructor(state) {
    this.state = state;
    this.tempState = state;

    this.x = 0;
    this.y = 0;
    this.ox = 0;
    this.oy = 0;
    this.scl = 0;
  }

  setData(x, y, ox, oy, scl) {
    this.x = x;
    this.y = y;
    this.ox = ox;
    this.oy = oy;
    this.scl = scl;
  }

  show() {
    if (optimize) {
      if (this.state == 1) {
        let b = 0.9;
        push();
        noStroke();
        fill(0, 0, 0, 1);
        rect(
          (this.x + 0.5) * this.scl + this.ox,
          (this.y + 0.5) * this.scl + this.oy,
          this.scl,
          this.scl
        );
        let t = map(this.state, 0, 1, 16, 100);
        fill(0, 0, t, 1);
        rect(
          (this.x + 0.5) * this.scl + this.ox,
          (this.y + 0.5) * this.scl + this.oy,
          this.scl * b,
          this.scl * b
        );
        pop();
      }
    } else {
      let b = 0.9;
      push();
      noStroke();
      fill(0, 0, 0, 1);
      rect(
        (this.x + 0.5) * this.scl + this.ox,
        (this.y + 0.5) * this.scl + this.oy,
        this.scl,
        this.scl
      );
      let t = map(this.state, 0, 1, 16, 100);
      fill(0, 0, t, 1);
      rect(
        (this.x + 0.5) * this.scl + this.ox,
        (this.y + 0.5) * this.scl + this.oy,
        this.scl * b,
        this.scl * b
      );
      pop();
    }
  }

  setState() {
    this.state = this.tempState;
  }
}

function findIndex(x, y, width, height) {
  let xpos = x % width;
  let ypos = y % height;
  if (xpos < 0) {
    xpos = width - abs(xpos);
  }
  if (ypos < 0) {
    ypos = height - abs(ypos);
  }
  return [xpos, ypos];
}
