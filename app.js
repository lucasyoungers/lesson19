new Vue({
    el: '#game',
    data: {
        canvas: {},
        ctx: {},
        score: 0,
        x: 0,
        y: 0,
        dx: 2,
        dy: -2,
        ballRadius: 10,
        ballColor: 'darkslategrey',
        paddleHeight: 10,
        paddleWidth: 75,
        paddleX: 0,
        rightPressed: false,
        leftPressed: false,
        brickRowCount: 5,
        brickColumnCount: 3,
        brickWidth: 75,
        brickHeight: 20,
        brickPadding: 10,
        brickOffsetTop: 30,
        brickOffsetLeft: 30,
        bricks: [],
        interval: {}
    },
    mounted: function () {
        this.bindEvents();
        this.initVariables();
    },
    methods: {
        initVariables() {
            this.canvas = document.getElementById('myCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.x = this.canvas.width / 2;
            this.y = this.canvas.height - 30;
            this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
            this.bricks = this.buildBricksArray(this.brickColumnCount, this.brickRowCount);
            // this.interval = setInterval(this.draw, 10)
        },
        bindEvents() {
            document.addEventListener("keydown", this.keyDownHandler, false);
            document.addEventListener("keyup", this.keyUpHandler, false);
            document.addEventListener("mousemove", this.mouseMoveHandler, false);
        },
        keyDownHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                this.rightPressed = true;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                this.leftPressed = true;
            }
        },
        keyUpHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                this.rightPressed = false;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                this.leftPressed = false;
            }
        },
        mouseMoveHandler(e) {
            let relativeX = e.clientX - this.canvas.brickOffsetLeft;
            if (relativeX > 0 && relativeX < this.canvas.width) {
                paddleX = relativeX - this.paddleWidth / 2;
            }
        },
        collisionDetection() {
            for (let col = 0; col < this.brickColumnCount; col++) {
                for (let row = 0; row < this.brickRowCount; row++) {
                    const layer = this.bricks[col][row];
                    const x = this.x;
                    const y = this.y;
                    if (layer.status == 1) {
                        if (x > layer.x && x < layer.x + this.brickWidth && y > layer.y && y < layer.y + this.brickHeight) {
                            this.dy = -this.dy;
                            layer.status = 0;
                            this.score++;
                            if (this.score == this.brickRowCount * this.brickColumnCount) {
                                alert("YOU WIN, CONGRATULATIONS!");
                                document.location.reload();
                                clearInterval(this.interval);
                            }
                        }
                    }
                }
            }
        },
        drawScore() {
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = "#0095DD";
            this.ctx.fillText("Score: " + this.score, 8, 20);
        },
        drawBall() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = "darkslategrey";
            this.ctx.fill();
            this.ctx.closePath();
        },
        drawPaddle() {
            this.ctx.beginPath();
            this.ctx.rect(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
            this.ctx.fillStyle = "darkslategrey";
            this.ctx.fill();
            this.ctx.closePath();
        },
        drawBricks() {
            for (let col = 0; col < this.brickColumnCount; col++) {
                for (let row = 0; row < this.brickRowCount; row++) {
                    if (this.bricks[col][row].status == 1) {
                        let brickX = (row * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                        let brickY = (col * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                        this.bricks[col][row].x = brickX;
                        this.bricks[col][row].y = brickY;
                        this.ctx.beginPath();
                        this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                        this.ctx.fillStyle = "darkslategrey";
                        this.ctx.fill();
                        this.ctx.closePath();
                    }
                }
            }
        },
        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawBricks();
            this.drawBall();
            this.drawPaddle();
            this.drawScore();
            this.collisionDetection();

            if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
                this.dx = -this.dx;
            }

            if (this.y + this.dy < this.ballRadius) {
                dy = -dy;
            } else if (this.y + this.dy > this.canvas.height - this.ballRadius - 10) {
                if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
                    this.dy = -this.dy;
                } else {
                    alert(`GAME OVER! YOU COLLECTED ${this.score} POINT(S)!`);
                    document.location.reload();
                    clearInterval(this.interval);
                }
            }

            if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
                this.paddleX += 7;
            } else if (this.leftPressed && this.paddleX > 0) {
                this.paddleX -= 7;
            }

            this.x += this.dx;
            this.y += this.dy;
        },
        buildBricksArray(brickColumnCount, brickRowCount) {
            let bricks = [];
            for (let c = 0; c < brickColumnCount; c++) {
                bricks[c] = [];
                for (let r = 0; r < brickRowCount; r++) {
                    bricks[c][r] = {
                        x: 0,
                        y: 0,
                        status: 1
                    };
                }
            }
            return bricks;
        }
    }
})











// const canvas = document.getElementById('myCanvas');
// const ctx = canvas.getContext('2d');

// let score = 0;

// let x = canvas.width / 2;
// let y = canvas.height - 30;
// let dx = 2;
// let dy = -2;
// const ballRadius = 10;
// const ballColor = "darkslategrey";

// const paddleHeight = 10;
// const paddleWidth = 75;
// let paddleX = (canvas.width - paddleWidth) / 2;
// let rightPressed = false;
// let leftPressed = false;

// const brickRowCount = 5;
// const brickColumnCount = 3;
// const brickWidth = 75;
// const brickHeight = 20;
// const brickPadding = 10;
// const brickOffsetTop = 30;
// const brickOffsetLeft = 30;

// let bricks = [];
// for (let c = 0; c < brickColumnCount; c++) {
//     bricks[c] = [];
//     for (let r = 0; r < brickRowCount; r++) {
//         bricks[c][r] = {
//             x: 0,
//             y: 0,
//             status: 1
//         };
//     }
// }

// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);

// function keyDownHandler(e) {
//     if (e.key == "Right" || e.key == "ArrowRight") {
//         rightPressed = true;
//     } else if (e.key == "Left" || e.key == "ArrowLeft") {
//         leftPressed = true;
//     }
// }

// function keyUpHandler(e) {
//     if (e.key == "Right" || e.key == "ArrowRight") {
//         rightPressed = false;
//     } else if (e.key == "Left" || e.key == "ArrowLeft") {
//         leftPressed = false;
//     }
// }

// function collisionDetection() {
//     for (let c = 0; c < brickColumnCount; c++) {
//         for (let r = 0; r < brickRowCount; r++) {
//             const b = bricks[c][r];
//             if (b.status == 1) {
//                 if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
//                     dy = -dy;
//                     b.status = 0;
//                     score++;
//                     if (score == brickRowCount * brickColumnCount) {
//                         alert("YOU WIN, CONGRATULATIONS!");
//                         document.location.reload();
//                         clearInterval(interval);
//                     }
//                 }
//             }
//         }
//     }
// }

// function drawScore() {
//     ctx.font = "16px Arial";
//     ctx.fillStyle = "#0095DD";
//     ctx.fillText("Score: " + score, 8, 20);
// }

// function drawBall() {
//     ctx.beginPath();
//     ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
//     ctx.fillStyle = ballColor;
//     ctx.fill();
//     ctx.closePath();
// }

// function drawPaddle() {
//     ctx.beginPath();
//     ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
//     ctx.fillStyle = "darkslategrey";
//     ctx.fill();
//     ctx.closePath();
// }

// function drawBricks() {
//     for (let c = 0; c < brickColumnCount; c++) {
//         for (let r = 0; r < brickRowCount; r++) {
//             if (bricks[c][r].status == 1) {
//                 let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
//                 let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
//                 bricks[c][r].x = brickX;
//                 bricks[c][r].y = brickY;
//                 ctx.beginPath();
//                 ctx.rect(brickX, brickY, brickWidth, brickHeight);
//                 ctx.fillStyle = "darkslategrey";
//                 ctx.fill();
//                 ctx.closePath();
//             }
//         }
//     }
// }

// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawBricks();
//     drawBall();
//     drawPaddle();
//     drawScore();
//     collisionDetection();

//     if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
//         dx = -dx;
//     }

//     if (y + dy < ballRadius) {
//         dy = -dy;
//     } else if (y + dy > canvas.height - ballRadius - 10) {
//         if (x > paddleX && x < paddleX + paddleWidth) {
//             dy = -dy;
//         } else {
//             alert(`GAME OVER! YOU COLLECTED ${score} POINT(S)!`);
//             document.location.reload();
//             clearInterval(interval);
//         }
//     }

//     if (rightPressed && paddleX < canvas.width - paddleWidth) {
//         paddleX += 7;
//     } else if (leftPressed && paddleX > 0) {
//         paddleX -= 7;
//     }

//     x += dx;
//     y += dy;
// }

// const interval = setInterval(draw, 10);
// }