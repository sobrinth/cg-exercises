const AXIS = {
    X: 0,
    Y: 1
}


class VariableObject {

    constructor() {
        this.color = [1, 1, 1, 1];
        this._position = [0,0];
        this._scale = [1,1];
        this._rotation = 0;

        this._transMatrix = mat3.create();
    }

    get position() {
        return this._position;
    }

    move(pos) {
        this._position = [
            this._position[0] + pos[0],
            this._position[1] + pos[1]
        ];
        this._updateMatrix();
    }

    moveX(x) {
        this.move([x,0]);
    }
    moveY(y) {
        this.move([0,y]);
    }
    set position(pos) {
        this._position = pos;
        this._updateMatrix();
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale;
        this._updateMatrix()
    }

    set rotation(degree) {
        this._rotation = (degree%360) * (Math.PI/180);
        this._updateMatrix();
    }

    _updateMatrix() {
        this._transMatrix = mat3.create();

        mat3.translate(this._transMatrix, this._transMatrix, this.position);
        mat3.rotate(this._transMatrix, this._transMatrix, this._rotation);
        mat3.scale(this._transMatrix, this._transMatrix, this._scale);
    }

    draw() {
        gl.bindBuffer(gl.ARRAY_BUFFER, VariableObject.buffer);
        gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0,0);
        gl.enableVertexAttribArray(ctx.aVertexPositionId);

        gl.uniformMatrix3fv(ctx.uModelMat, false, this._transMatrix);
        gl.uniform4f(ctx.uColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    _clamp(value, max) {
        if (value > max) {
            return max
        }
        return value;
    }
}

class Player extends VariableObject {

    constructor() {
        super();
        this.scale = [5, gl.drawingBufferHeight/5];
        this.speed = 15;
    }

    _getDistanceFromBorder() {
        var padding = 7
        return (((gl.drawingBufferWidth/2)-(this.scale[0]/2)) - padding)
    }

    _setLeft() {
        this.position = [
            -this._getDistanceFromBorder(),
            0
        ]
    }

    _setRight() {
        this.position = [
            this._getDistanceFromBorder(),
            0
        ]
    }

    _topBorder() {
        return gl.drawingBufferHeight/2 - this.scale[AXIS.Y]/2;
    }

    _bottomBorder() {
        return -this._topBorder();
    }

    update() {
        if(isDown(key.UP)) {
            this.moveUp();
        }
        if(isDown(key.DOWN)) {
            this.moveDown();
        }
    }

    moveUp() {
        let y = this.position[AXIS.Y] + (this.speed);
        y = this._clamp(y, this._topBorder())
        this.position = [this.position[AXIS.X], y];
    }

    moveDown() {
        let y = this.position[1] - (this.speed)
        y = y > this._bottomBorder() ? y : this._bottomBorder();
        this.position = [this.position[AXIS.X], y];
    }
}

class Enemy extends Player {

    constructor(game) {
        super();
        this._game = game;
        // speed of the AI
        this.speed = 15;
    }
    update() {
        let nearestBallDistance = 1000;
        let nearestBall = new Ball(game);
        this._game._balls.forEach(o => {
            if (this.position[AXIS.X] - o.position[AXIS.X] < nearestBallDistance) {
                nearestBallDistance = this.position[AXIS.X] - o.position[AXIS.X];
                nearestBall = o;
            }
        });

        if((nearestBall.position[AXIS.Y] - this.position[AXIS.Y]) > 15) {
            this.moveUp();
        } else if((nearestBall.position[AXIS.Y] - this.position[AXIS.Y]) < -15) {
            this.moveDown();
        }
    }
}

class Ball extends VariableObject {

    constructor(game) {
        super();
        this.scale = [15,15];
        this._reset();
        this.game = game;
        this._bounces = 1;
        this.primary = false;

    }

    update() {
        this.move([
            this._velocity[AXIS.X],
            this._velocity[AXIS.Y]
        ]);

        if(this._collidesWithTopOrBot()) {
            this.reflect(AXIS.Y);
        }
        if (this._collidesWithBackwall()) {
            this.reflect(AXIS.X);
            this._velocity = [2,3];
            this._bounces = 1;
            if(this.position[AXIS.X] > 0) {
                game.playerscore++;
            } else {
                game.enemyscore++;
            }
            this._reset();
            game.resetGame();
            //todo: add score for game
            document.getElementById("statusBar").innerText = "Player: "+ game.playerscore + ", Enemy: " + game.enemyscore;
            if(game.enemyscore === 3 || game.playerscore === 3) {
                document.getElementById("title").innerText = "Game Over!";
                game.stop = true;
            }
        }
        if(this._collidesWithPlayer()) {
            this.reflect(AXIS.X);
            if(this._bounces % 4 === 0) {
                this.increaseVelocity();
            }
            if(this._bounces % 10 === 0) {
                if(this.primary === true) {
                    let newBall = new Ball(this.game);
                    game.addObject(newBall);
                    game._balls.push(newBall);
                }
            }
            this._bounces++;
        }
    }

    increaseVelocity() {
        this._velocity = [
            this._clamp(this._velocity[0] * this._clamp(1+ Math.random(), 1.3), 10),
            this._clamp(this._velocity[1] * this._clamp(1+ Math.random(), 1.3), 8)
        ];
        this.color = [
            Math.random(),
            Math.random(),
            Math.random(),
            1
        ]
    }

    _reset() {
        this.position = [0,0];
        this._velocity = [
            -3 + Math.floor(Math.random() * 7),
            -3 + Math.floor(Math.random() * 7)
        ];
        if(this._velocity[0] === 0) {
            this._velocity[0] = 1.5
        }
    }

    _collidesWithTopOrBot() {
        let collisionDistance = gl.drawingBufferHeight/2 - this.scale[AXIS.Y]/2;
        return this.position[AXIS.Y] >= collisionDistance ||
            this.position[AXIS.Y] <= -collisionDistance;
    }

    _collidesWithPlayer() {
        return this._hitsPlayer(this.game._player) || this._hitsPlayer(this.game._enemy);
    }

    _hitsPlayer(player) {
        return this._collidesWith(AXIS.X, player) && this._collidesWith(AXIS.Y, player);
    }

    _collidesWith(axis, object) {
        let objectSize = object.scale[axis]/2;
        // Checks the upper/right collisionbound
        if(this.position[axis] - this.scale[axis]/2 < object.position[axis] + objectSize) {
            // Check the lower/left collisionbound
            if(this.position[axis] + this.scale[axis]/2 > object.position[axis] - objectSize) {
                return true;
            }
        }
        return false;
    }

    _collidesWithBackwall() {
        let collisionDistance = gl.drawingBufferWidth/2 - this.scale[AXIS.X]/2;
        return this.position[AXIS.X] >= (collisionDistance + 20) || this.position[AXIS.X] <= (-collisionDistance -20);
    }

    reflect(axis) {
        this._velocity[axis] = -this._velocity[axis];
    }
}

VariableObject.buffer = -1;
VariableObject.modelMat = mat3.create();