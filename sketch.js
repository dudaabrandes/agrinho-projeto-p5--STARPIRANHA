function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
let cols, rows;
let w = 40;
let grid = [];
let current;
let stack = [];
let player;
let goal;

function setup() {
  createCanvas(800, 800);
  cols = floor(width / w);
  rows = floor(height / w);
  frameRate(60);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
  generateMaze();

  player = { i: 0, j: 0 };
  goal = { i: cols - 1, j: rows - 1 };
}

function draw() {
  background("#ffd1dc"); // rosa claro

  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  // desenha jogador
  let x = player.i * w + w / 2;
  let y = player.j * w + w / 2;
  fill("#ff69b4"); // rosa mais forte
  noStroke();
  ellipse(x, y, w / 2);

  // desenha objetivo
  fill("#ffb6c1");
  rect(goal.i * w, goal.j * w, w, w);

  if (player.i === goal.i && player.j === goal.j) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Você venceu!", width / 2, height / 2);
    noLoop();
  }
}

function keyPressed() {
  let index = indexFromCoords(player.i, player.j);
  let cell = grid[index];

  if (key === 'w' || key === 'W') {
    if (!cell.walls[0]) player.j--;
  } else if (key === 'd' || key === 'D') {
    if (!cell.walls[1]) player.i++;
  } else if (key === 's' || key === 'S') {
    if (!cell.walls[2]) player.j++;
  } else if (key === 'a' || key === 'A') {
    if (!cell.walls[3]) player.i--;
  }
}

function indexFromCoords(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) return -1;
  return i + j * cols;
}

function generateMaze() {
  while (true) {
    current.visited = true;
    let next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true]; // top, right, bottom, left
  this.visited = false;

  this.show = function () {
    let x = this.i * w;
    let y = this.j * w;
    stroke("#db7093");

    if (this.walls[0]) line(x, y, x + w, y); // top
    if (this.walls[1]) line(x + w, y, x + w, y + w); // right
    if (this.walls[2]) line(x + w, y + w, x, y + w); // bottom
    if (this.walls[3]) line(x, y + w, x, y); // left

    if (this.visited) {
      noStroke();
      fill("#ffe4e1");
      rect(x, y, w, w);
    }
  };

  this.checkNeighbors = function () {
    let neighbors = [];

    let top = grid[indexFromCoords(i, j - 1)];
    let right = grid[indexFromCoords(i + 1, j)];
    let bottom = grid[indexFromCoords(i, j + 1)];
    let left = grid[indexFromCoords(i - 1, j)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      let r = floor(random(neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  let y = a.j - b.j;

  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}