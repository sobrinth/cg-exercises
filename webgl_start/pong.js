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
    //wireCube = new ThreeDimensionalObject();
    //objects.push(wireCube)
    let solidCube = new Solid3DObject();
    objects.push(solidCube);

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

    WireFrame3DObject.worldMat = new Float32Array(16);
    WireFrame3DObject.identityMat = new Float32Array(16);

    mat4.identity(WireFrame3DObject.worldMat);
    mat4.identity(WireFrame3DObject.identityMat);

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


