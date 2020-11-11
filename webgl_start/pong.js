//
// Computer Graphics
//
// WebGL Exercises Dominik Baumann
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
let gl;
let canvas;
let objects = [];
let sphere = {};

// we keep all local parameters for the program in a single object
let ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aVertexNormalId: -1,
    aVertexTextureCoordId: -1,
    uModelViewMatrixId: -1,
    uProjectionMatrixId: -1,
    uNormalMatrixId: -1,
    uEnableTextureId: -1,
    uEnableLightingId: -1,
    uLightPositionId: -1,
    uLightColorId: -1,
    uSamplerId: -1
};

let scene = {
    eyePosition: [0, 3, -4],
    lookAtPosition: [0, 0, 0],
    upVector: [0, 1, 0],
    nearPlane: 0.1,
    farPlane: 30.0,
    fov: 40,
    lightPosition: [-20, 20, 0],
    lightColor: [1, 1, 1],
    rotateObjects: true,
    angle: 0,
    angularSpeed: 0.1 * 2 * Math.PI / 360.0
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.requestAnimationFrame(drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    setUpAttributesAndUniforms();
    setupMatrices();
    loadTextures();

    // set the clear color
    gl.clearColor(.1,.1,.1,1);

    draw();

    
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";

    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal")
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");

    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");

    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");

    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");

    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");

}

function loadTextures() {
    let image = new Image();
    //woolTex.texture = gl.createTexture();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, woolTex.texture);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        draw();
    };
    //image.src = "light_blue_wool.png";

}

function setupMatrices() {
    "use strict"

    let solidCube = new SolidObject(
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0],
        [0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0]
    );


    sphere = new SolidSphere(20, 20, [16/256, 0.5, 32/256]);
    objects.push(sphere);
    objects.push(solidCube)

}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    let modelViewMatrix = mat4.create();
    let viewMatrix = mat4.create();
    let projectionMatrix = mat4.create();
    let textureMatrix = mat3.create();
    let normalMatrix = mat3.create();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //set matrices from scene
    mat4.lookAt(viewMatrix, scene.eyePosition, scene.lookAtPosition, scene.upVector);

    mat4.perspective(projectionMatrix, glMatrix.toRadian(66),
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        scene.nearPlane, scene.farPlane);


    // textures
    gl.uniform1i(ctx.uEnableTextureId, 0);
    gl.uniform1i(ctx.uSamplerId, 0);

    // lighting
    gl.uniform1i(ctx.uEnableLightingId, 1);
    gl.uniform3fv(ctx.uLightPositionId, scene.lightPosition);
    gl.uniform3fv(ctx.uLightColorId, scene.lightColor);

    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);


    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [1.0, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [0, 2, 1]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    objects[1].draw();

    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [-1.0, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [0, 1, -2]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    objects[1].draw();

    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [0.0, 0.0, -2.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [1, 0, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.5, 0.5, 0.5]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    objects[0].draw();

}

let first = true;
let lastTimeStamp = 0;

function drawAnimated(timeStamp) {
    let timeElapsed = 0;
    if (first) {
        lastTimeStamp = timeStamp;
        first = false;
    } else {
        timeElapsed = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
    }

    scene.angle += timeElapsed * scene.angularSpeed;
    if (scene.angle > 2.0*Math.PI) {
        scene.angle -= 2.0*Math.PI;
    }
    draw();

    window.requestAnimationFrame(drawAnimated)

}


