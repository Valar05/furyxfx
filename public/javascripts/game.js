var piece = undefined;
var walls = [];
var score_left = undefined;
var score_right = undefined;
var gameOver = false;

function startGame() {
    piece = new component(28, 28, "x-piece", 10, 120);
    piece.gravity = 0.05;

    score_left = new component(30, 30, "0-piece", 415, 30);
    score_right = new component(30, 30, "0-piece", 435, 30);

    canvasArea.start();
}

var canvasArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.getElementsByClassName("game")[0].appendChild(this.canvas);
        this.frameNo = 0;

        this.interval = setInterval(updateCanvas, 15);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.color = color;

    this.update = function () {
        ctx = canvasArea.context;
        ctx.drawImage(document.getElementById(this.color), 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    };

    this.newPosition = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottomOrTop();
    };

    this.hitBottomOrTop = function () {
        var bottom = canvasArea.canvas.height - this.height;
        if (this.y > bottom) {
            this.y = bottom;
            this.gravitySpeed = 0;
        } else if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    };

    this.hitWall = function (wall) {
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);
        var wallLeft = wall.x;
        var wallRight = wall.x + (wall.width);
        var wallTop = wall.y;
        var wallBottom = wall.y + (wall.height);

        return !((bottom < wallTop) || (top > wallBottom) || (right < wallLeft) || (left > wallRight));
    }
}

function updateCanvas() {
    if(gameOver)
        return;

    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < walls.length; i += 1) {
        if (piece.hitWall(walls[i])) {
            gameOver = true;
            toggleResetButton();
            return;
        }
    }

    canvasArea.clear();
    canvasArea.frameNo += 1;

    if (canvasArea.frameNo == 1 || intervalCheck(150)) {
        x = canvasArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        walls.push(new component(10, height, "bar-1-piece", x, 0));
        walls.push(new component(10, x - height - gap, "bar-1-piece", x, height + gap));
    }

    for (i = 0; i < walls.length; i += 1) {
        walls[i].x += -1;
        walls[i].update();
    }

    var scoreArray = parseInt(canvasArea.frameNo / 100).toString().split("");
    if(scoreArray.length === 1)
        scoreArray.unshift("0");

    score_left.color = scoreArray[0] + "-piece";
    score_left.update();

    score_right.color = scoreArray[1] + "-piece";
    score_right.update();

    piece.newPosition();
    piece.update();
}

function intervalCheck(n) {
    return ((canvasArea.frameNo / n) % 1 == 0)
}

function accelerate(n) {
    piece.gravity = n;
}

function reset() {
    gameOver = false;
    canvasArea.clear();

    piece = undefined;
    walls = [];
    score_left = undefined;
    score_right = undefined;

    var element = document.getElementsByTagName("canvas")[0];
    element.parentNode.removeChild(element);

    clearInterval(canvasArea.interval);

    toggleResetButton();
    startGame();
}

function toggleResetButton() {
    if(gameOver)
        document.getElementById("reset-row").className = document.getElementById("reset-row").className.replace(/\bhidden\b/,'');
    else
        document.getElementById("reset-row").className += " hidden";
}

window.onload = function () {
    startGame();
};