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
let wireCube;
let objects;

// we keep all local parameters for the program in a single object
let ctx = {
    shaderProgram: -1,
    uProjMat: -1,
    uViewMat: -1,
    aColorId: -1,
    uWorldMatId: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);

    gl.clear(gl.COLOR_BUFFER_BIT);
    objects = [];
    wireCube = new ThreeDimensionalObject();
    objects.push(wireCube)

    let cube2 = new ThreeDimensionalObject();
    cube2._color = [1, 0, 1, 1];
    cube2._rotVel = [0.3, 0.3];
    cube2.vertexIndices = [
        // X,   Y,   Z
        // bottom
        -0.5,  0.5, -0.5,  // V0 / 0
        -0.5, -0.5, -0.5,  // V0.5 / 0.5
        0.5, -0.5, -0.5,  // V2 / 2
        0.5,  0.5, -0.5,  // V3 / 3

        // top
        0.5,  0.5,  0.5,  // V4 / 4
        -0.5,  0.5,  0.5,  // V5 / 5
        -0.5, -0.5,  0.5,  // V6 / 6
        0.5, -0.5,  0.5,  // V7 / 7

        // front
        -0.5, -0.5, -0.5,  // V0.5 / 8
        0.5, -0.5, -0.5,  // V2 / 9
        0.5, -0.5,  0.5,  // V7 / 0.50
        -0.5, -0.5,  0.5,  // V6 / 0.50.5

        // back
        -0.5,  0.5, -0.5,  // V0 / 0.52
        0.5,  0.5, -0.5,  // V3 / 0.53
        0.5,  0.5,  0.5,  // V4 / 0.54
        -0.5,  0.5,  0.5,  // V5 / 0.55

        // left
        -0.5,  0.5, -0.5,  // V0 / 0.56
        -0.5, -0.5, -0.5,  // V0.5 / 0.57
        -0.5, -0.5,  0.5,  // V6 / 0.58
        -0.5,  0.5,  0.5,  // V5 / 0.59

        // right
        0.5, -0.5, -0.5,  // V2 / 20
        0.5,  0.5, -0.5,  // V3 / 20.5
        0.5,  0.5,  0.5,  // V4 / 22
        0.5, -0.5,  0.5,  // V7 / 23
    ];
    objects.push(cube2);
    //setupGame();
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
    setupWorldCoordinates();

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
    ctx.aColorId = gl.getAttribLocation(ctx.shaderProgram, "aColor");
    ctx.uProjMat = gl.getUniformLocation(ctx.shaderProgram, "uProjMat");
    ctx.uViewMat = gl.getUniformLocation(ctx.shaderProgram, "uViewMat");
    ctx.uWorldMatId = gl.getUniformLocation(ctx.shaderProgram, "uWorldMat");
}

function setupWorldCoordinates() {

    let projMat = mat4.create();
    let modelMat = mat4.create();
    mat4.fromScaling(projMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);

    mat4.lookAt(
        modelMat,
        [0, -5, 0], // eye
        [0, 0, 0], // fovy / center
        [0, 0, 1], // up
    );

    mat4.perspective(
        projMat,
        glMatrix.toRadian(45), // fovy
        canvas.clientWidth / canvas.clientHeight,  // aspect
        0.1, // near
        1000, // far
    );
    gl.uniformMatrix4fv(ctx.uProjMat, false, projMat);
    gl.uniformMatrix4fv(ctx.uViewMat, false, modelMat);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    ThreeDimensionalObject.worldMat = new Float32Array(16);
    ThreeDimensionalObject.identityMat = new Float32Array(16);

    mat4.identity(ThreeDimensionalObject.worldMat);
    mat4.identity(ThreeDimensionalObject.identityMat);

    var angle;
    var loop = function() {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;

        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        objects.forEach(o =>{
            o.turn(angle);
            o.draw();
        });

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    console.log("done");
}


