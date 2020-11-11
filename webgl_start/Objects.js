let ObjectCtx = {
    vertexBuffer: -1,
    sideBuffer: -1,
    colorBuffer: -1,
    normalBuffer: -1,
    textureCoordBuffer: -1,
    identityMat: -1,
    worldMat: -1
}

class SolidObject {

    constructor(backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
        this._vertices = [
            // back
            -0.5, -0.5, -0.5,      // v0
            0.5, -0.5, -0.5,       // v1
            0.5,  0.5, -0.5,       // v2
            -0.5,  0.5, -0.5,      // v3
            // front
            -0.5, -0.5, 0.5,       // v4
            0.5, -0.5, 0.5,        // v5
            0.5,  0.5, 0.5,        // v6
            -0.5,  0.5, 0.5,       // v7
            // right
            0.5, -0.5, -0.5,       // v8 = v1
            0.5,  0.5, -0.5,       // v9 = v2
            0.5,  0.5,  0.5,       // v10 = v6
            0.5, -0.5,  0.5,       // v11 = v5
            // left
            -0.5, -0.5, -0.5,      // v12 = v0
            -0.5,  0.5, -0.5,      // v13 = v3
            -0.5,  0.5,  0.5,      // v14 = v7
            -0.5, -0.5,  0.5,      // v15 = v4
            // top
            -0.5, 0.5, -0.5,       // v16 = v3
            -0.5, 0.5,  0.5,       // v17 = v7
            0.5, 0.5,  0.5,        // v18 = v6
            0.5, 0.5, -0.5,        // v19 = v2
            // bottom
            -0.5, -0.5, -0.5,      // v20 = v0
            -0.5, -0.5, 0.5,       // v21 = v4
            0.5, -0.5, 0.5,        // v22 = v5
            0.5, -0.5, -0.5        // v23 = v1
        ];

        this._vertexIndices = [
            0,2,1, // face 0 (back)
            2,0,3,
            4,5,6, // face 1 (front)
            4,6,7,
            8,9,10, // face 2 (right)
            10,11,8,
            12,15,14, // face 3 (left)
            14,13,12,
            16,17,18, // face 4 (top)
            18,19,16,
            20,23,22, // face 5 (bottom)
            22,21,20
        ];

        this._textureCoords = [
            0.0,  0.0,              // back
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ];

        this._updateVertexBuffer();
        this._updateEdgeBuffer();
        this._updateTextureCoordBuffer();
        this._defineColors(backColor, frontColor, rightColor, leftColor, topColor, bottomColor);

    }

    _updateEdgeBuffer() {
        ObjectCtx.sideBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ObjectCtx.sideBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._vertexIndices), gl.STATIC_DRAW);
    }

    _updateVertexBuffer() {
        ObjectCtx.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
    }

    _updateTextureCoordBuffer() {
        ObjectCtx.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._textureCoords), gl.STATIC_DRAW);
    }

    _defineColors(backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
        // make 4 entries, one for each vertex
        let backSide = backColor.concat(backColor, backColor, backColor);
        let frontSide = frontColor.concat(frontColor, frontColor, frontColor);
        let rightSide = rightColor.concat(rightColor, rightColor, rightColor);
        let leftSide = leftColor.concat(leftColor, leftColor, leftColor);
        let topSide = topColor.concat(topColor, topColor, topColor);
        let bottomSide = bottomColor.concat(bottomColor, bottomColor, bottomColor);

        let allSides = backSide.concat(frontSide, rightSide, leftSide, topSide, bottomSide);

        ObjectCtx.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSides), gl.STATIC_DRAW);
    }

    _defineNormals() {
        let backNormal = [0.0, 0.0, -1.0];
        let frontNormal = [0.0, 0.0, 1.0];
        let rightNormal = [1.0, 0.0, 0.0];
        let leftNormal = [-1.0, 0.0, 0.0];
        let topNormal = [0.0, 1.0, 0.0];
        let bottomNormal = [0.0, -1.0, 0.0];

        // make 4 entries, one for each vertex
        let backSideNormal    = backNormal.concat(backNormal, backNormal, backNormal);
        let frontSideNormal   = frontNormal.concat(frontNormal, frontNormal, frontNormal);
        let rightSideNormal   = rightNormal.concat(rightNormal, rightNormal, rightNormal);
        let leftSideNormal    = leftNormal.concat(leftNormal, leftNormal, leftNormal);
        let topSideNormal     = topNormal.concat(topNormal, topNormal, topNormal);
        let bottomSideNormal  = bottomNormal.concat(bottomNormal, bottomNormal, bottomNormal);

        let allSidesNormal = backSideNormal.concat(frontSideNormal, rightSideNormal, leftSideNormal, topSideNormal, bottomSideNormal);

        ObjectCtx.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSidesNormal), gl.STATIC_DRAW);
    }

    draw() {
        this._updateVertexBuffer();
        this._updateEdgeBuffer();
        this._updateTextureCoordBuffer();
        this._defineNormals();

        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.vertexBuffer);
        gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexPositionId);

        // color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.colorBuffer);
        gl.vertexAttribPointer(ctx.aVertexColorId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexColorId);

        // texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.textureCoordBuffer);
        gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);

        // normal
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.normalBuffer);
        gl.vertexAttribPointer(ctx.aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexNormalId);

        // bind the element array
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ObjectCtx.sideBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        // disable all attributes
        gl.disableVertexAttribArray(ctx.aVertexPositionId);
        gl.disableVertexAttribArray(ctx.aVertexColorId);
        gl.disableVertexAttribArray(ctx.aVertexTextureCoordId);
        gl.disableVertexAttribArray(ctx.aVertexNormalId);

    }
}

/**
 *
 * Define a sphere that can be drawn with texture or color.
 */

/**
 *
 * @param gl the gl object for which to define the sphere
 * @param latitudeBands the number of bands along the latitude direction
 * @param longitudeBands the number of bands along the longitude direction
 * @param color the color of the sphere
 *
 */
class SolidSphere {


    constructor(latitudeBands, longitudeBands, color) {
        this._vertices = [];
        this._normals = [];
        this._textures = [];
        this._indices = [];
        this._defineVerticesAndTexture(latitudeBands, longitudeBands);
        this._defineIndices(latitudeBands, longitudeBands);
        this._sphere = {};
        this._numberOfTriangles = latitudeBands*longitudeBands*2;
        this._color = color;

    }

    _defineVerticesAndTexture(latitudeBands, longitudeBands) {
        "use strict";
        // define the vertices of the sphere

        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            let theta = latNumber * Math.PI / latitudeBands;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                let phi = longNumber * 2 * Math.PI / longitudeBands;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                // position (and normals as it is a unit sphere)
                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                // texture coordinates
                let u = 1 - (longNumber / longitudeBands);
                let v = 1 - (latNumber / latitudeBands);

                this._vertices.push(x);
                this._vertices.push(y);
                this._vertices.push(z);

                this._normals.push(x);
                this._normals.push(y);
                this._normals.push(z);

                this._textures.push(u);
                this._textures.push(v);
            }
        }
    }

    _defineIndices(latitudeBands, longitudeBands) {

        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                let first = (latNumber * (longitudeBands + 1)) + longNumber;
                let second = first + longitudeBands + 1;

                this._indices.push(first);
                this._indices.push(first + 1);
                this._indices.push(second);

                this._indices.push(second);
                this._indices.push(first + 1);
                this._indices.push(second + 1);
            }
        }
    }

    draw() {
        "use strict";
        this._setupBuffers()

        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.vertexBuffer);
        gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexPositionId);

        // color is directly specified as an attribute here, as it is valid for the whole object
        gl.disableVertexAttribArray(ctx.aVertexColorId);
        gl.vertexAttrib3f(ctx.aVertexColorId, this._color[0], this._color[1], this._color[2]);

        // normal
        gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.normalBuffer);
        gl.vertexAttribPointer(ctx.aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexNormalId);

        // elements
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ObjectCtx.sideBuffer);
        gl.drawElements(gl.TRIANGLES, this._numberOfTriangles*3 ,gl.UNSIGNED_SHORT, 0);

    }

     _setupBuffers() {
         ObjectCtx.vertexBuffer  = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.vertexBuffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

         ObjectCtx.normalBuffer = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, ObjectCtx.normalBuffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);

         this._sphere.bufferTextures = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, this._sphere.bufferTextures);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._textures), gl.STATIC_DRAW);

         ObjectCtx.sideBuffer = gl.createBuffer();
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ObjectCtx.sideBuffer);
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);


     }
}