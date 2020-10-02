
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
}

VariableObject.buffer = -1;
VariableObject.modelMat = mat3.create();