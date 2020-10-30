const AXIS = {
    X: 0,
    Y: 1
}

class WireFrame3DObject {

    constructor() {
        this._vertices = [
            // X,   Y,   Z
            // bottom
            -1,  1, -1,  // V0 / 0
            -1, -1, -1,  // V1 / 1
            1, -1, -1,  // V2 / 2
            1,  1, -1,  // V3 / 3

            // top
            1,  1,  1,  // V4 / 4
            -1,  1,  1,  // V5 / 5
            -1, -1,  1,  // V6 / 6
            1, -1,  1,  // V7 / 7

            // front
            -1, -1, -1,  // V1 / 8
            1, -1, -1,  // V2 / 9
            1, -1,  1,  // V7 / 10
            -1, -1,  1,  // V6 / 11

            // back
            -1,  1, -1,  // V0 / 12
            1,  1, -1,  // V3 / 13
            1,  1,  1,  // V4 / 14
            -1,  1,  1,  // V5 / 15

            // left
            -1,  1, -1,  // V0 / 16
            -1, -1, -1,  // V1 / 17
            -1, -1,  1,  // V6 / 18
            -1,  1,  1,  // V5 / 19

            // right
            1, -1, -1,  // V2 / 20
            1,  1, -1,  // V3 / 21
            1,  1,  1,  // V4 / 22
            1, -1,  1,  // V7 / 23
        ];
        this._vertexIndices = [
            // bottom
            0, 1,
            1, 2,
            2, 3,
            3, 4,

            // top
            4, 5,
            5, 6,
            6, 7,
            7, 4,

            // front
            8, 9,
            9, 10,
            10, 11,
            11, 8,

            // back
            12, 13,
            13, 14,
            14, 15,
            15, 12,

            // left
            16, 17,
            17, 18,
            18, 19,
            19, 16,

            // right
            20, 21,
            21, 22,
            22, 23,
            23, 20,
        ];
        this._color = [0, 1, 1, 1];
        this._xRotation = new Float32Array(16);
        this._zRotation = new Float32Array(16);
        this._updateEdgeBuffer();
        this._updateVertexBuffer();
        this._rotVel = [1,16];

    }

    set vertices(vertices) {
        this._vertices = vertices;
        this._updateVertexBuffer();
    }

    set vertexIndices(indices) {
        this._vertices = indices;
        this._updateEdgeBuffer();
    }

    _updateEdgeBuffer() {
        WireFrame3DObject.edgeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, WireFrame3DObject.edgeBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._vertexIndices), gl.STATIC_DRAW);
    }

    _updateVertexBuffer() {
        WireFrame3DObject.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, WireFrame3DObject.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
    }

    turn(angle) {
        mat4.rotate(this._xRotation, WireFrame3DObject.identityMat, angle / this._rotVel[0], [1,0,0])
        mat4.rotate(this._zRotation, WireFrame3DObject.identityMat, angle / this._rotVel[1], [0,0,1])

        mat4.mul(WireFrame3DObject.worldMat, this._xRotation, this._zRotation);
        gl.uniformMatrix4fv(ctx.uWorldMatId, false, WireFrame3DObject.worldMat);

    }



    draw() {
        this._updateVertexBuffer();
        this._updateEdgeBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, WireFrame3DObject.vertexBuffer);
        gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexPositionId);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, WireFrame3DObject.edgeBuffer);

        gl.vertexAttrib4f(ctx.aColorId, this._color[0],this._color[1],this._color[2],this._color[3])

        gl.drawElements(gl.LINES, 46, gl.UNSIGNED_SHORT, 0);
    }
}

class Solid3DObject {

    constructor() {
        this._vertices = [
            // X,   Y,   Z                      R,   G,   B       U,   V,
            // bottom
            -0.5,  0.5, -0.5,  /* V0 / 0 */   1.0, 0.0, 0.0,    0.0, 1.0,
            -0.5, -0.5, -0.5,  /* V1 / 1 */   1.0, 0.0, 0.0,    1.0, 1.0,
            0.5, -0.5, -0.5,  /* V2 / 2 */   1.0, 0.0, 0.0,    1.0, 0.0,
            0.5,  0.5, -0.5,  /* V3 / 3 */   1.0, 0.0, 0.0,    0.0, 0.0,

            // top
            0.5,  0.5,  0.5,  /* V4 / 4 */   0.0, 1.0, 0.0,    0.0, 1.0,
            -0.5,  0.5,  0.5,  /* V5 / 5 */   0.0, 1.0, 0.0,    1.0, 1.0,
            -0.5, -0.5,  0.5,  /* V6 / 6 */   0.0, 1.0, 0.0,    1.0, 0.0,
            0.5, -0.5,  0.5,  /* V7 / 7 */   0.0, 1.0, 0.0,    0.0, 0.0,

            // front
            -0.5, -0.5, -0.5,  /* V1 / 8 */   0.0, 0.0, 1.0,    0.0, 1.0,
            0.5, -0.5, -0.5,  /* V2 / 9 */   0.0, 0.0, 1.0,    1.0, 1.0,
            0.5, -0.5,  0.5,  /* V7 / 10 */  0.0, 0.0, 1.0,    1.0, 0.0,
            -0.5, -0.5,  0.5,  /* V6 / 11 */  0.0, 0.0, 1.0,    0.0, 0.0,

            // back
            -0.5,  0.5, -0.5,  /* V0 / 12 */  1.0, 1.0, 0.0,    0.0, 1.0,
            0.5,  0.5, -0.5,  /* V3 / 13 */  1.0, 1.0, 0.0,    1.0, 1.0,
            0.5,  0.5,  0.5,  /* V4 / 14 */  1.0, 1.0, 0.0,    1.0, 0.0,
            -0.5,  0.5,  0.5,  /* V5 / 15 */  1.0, 1.0, 0.0,    0.0, 0.0,

            // left
            -0.5,  0.5, -0.5,  /* V0 / 16 */  1.0, 0.0, 1.0,    0.0, 1.0,
            -0.5, -0.5, -0.5,  /* V1 / 17 */  1.0, 0.0, 1.0,    1.0, 1.0,
            -0.5, -0.5,  0.5,  /* V6 / 18 */  1.0, 0.0, 1.0,    1.0, 0.0,
            -0.5,  0.5,  0.5,  /* V5 / 19 */  1.0, 0.0, 1.0,    0.0, 0.0,

            // right
            0.5, -0.5, -0.5,  /* V2 / 20 */  0.0, 1.0, 1.0,    0.0, 1.0,
            0.5,  0.5, -0.5,  /* V3 / 21 */  0.0, 1.0, 1.0,    1.0, 1.0,
            0.5,  0.5,  0.5,  /* V4 / 22 */  0.0, 1.0, 1.0,    1.0, 0.0,
            0.5, -0.5,  0.5,  /* V7 / 23 */  0.0, 1.0, 1.0,    0.0, 0.0,
        ];
        this._vertexIndices = [
            // bottom
            2, 1, 0,
            0, 3, 2,

            // top
            4, 5, 6,
            6, 7, 4,

            // front
            8, 9, 10,
            10, 11, 8,

            // back
            14, 13, 12,
            12, 15, 14,

            // left
            16, 17, 18,
            18, 19, 16,

            // right
            20, 21, 22,
            22, 23, 20,
        ];
        this._xRotation = new Float32Array(16);
        this._zRotation = new Float32Array(16);
        this._rotVel = [1,16];

    }

    set vertices(vertices) {
        this._vertices = vertices;
        this._updateVertexBuffer();
    }

    set vertexIndices(indices) {
        this._vertices = indices;
        this._updateEdgeBuffer();
    }

    _updateEdgeBuffer() {
        WireFrame3DObject.edgeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, WireFrame3DObject.edgeBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._vertexIndices), gl.STATIC_DRAW);
    }

    _updateVertexBuffer() {
        WireFrame3DObject.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, WireFrame3DObject.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
    }

    turn(angle) {
        mat4.rotate(this._xRotation, WireFrame3DObject.identityMat, angle / this._rotVel[0], [1,0,0])
        mat4.rotate(this._zRotation, WireFrame3DObject.identityMat, angle / this._rotVel[1], [0,0,1])

        mat4.mul(WireFrame3DObject.worldMat, this._xRotation, this._zRotation);
        gl.uniformMatrix4fv(ctx.uWorldMatId, false, WireFrame3DObject.worldMat);

    }



    draw() {
        this._updateVertexBuffer();
        this._updateEdgeBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, WireFrame3DObject.vertexBuffer);
        gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(ctx.aVertexPositionId);

        gl.vertexAttribPointer(ctx.aColorId, 3, gl.FLOAT, false, 8* Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(ctx.aColorId);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, WireFrame3DObject.edgeBuffer);

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}
WireFrame3DObject.vertexBuffer = -1;
WireFrame3DObject.edgeBuffer = -1;
WireFrame3DObject.identityMat = -1;
WireFrame3DObject.worldMat = -1;
