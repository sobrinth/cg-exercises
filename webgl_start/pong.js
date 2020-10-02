//
// Computer Graphics
//
// WebGL Exercises Dominik Baumann
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
let gl;
let game;

// we keep all local parameters for the program in a single object
let ctx = {
    shaderProgram: -1,
    uProjMat: -1,
    uModelMat: -1,
    uColor: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    const canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    setupGame();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setupWorldCoordinates();
    setUpBuffers();

    // set the clear color
    gl.clearColor(.1,.1,.1,1);
    
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";

    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColor = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjMat = gl.getUniformLocation(ctx.shaderProgram, "uProjMat");
    ctx.uModelMat = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

function setupWorldCoordinates() {

    let projMat = mat3.create();
    mat3.fromScaling(projMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjMat, false, projMat);
    gl.uniformMatrix3fv(ctx.uModelMat, false, VariableObject.modelMat)
}


function setupGame() {
    document.getElementById("statusBar").innerText = "Player: 0, Enemy: 0";
    document.getElementById("title").innerText = "Pong!";

    game = new Game();
    let middleBar = new VariableObject();
    middleBar.scale = [1, gl.drawingBufferHeight];
    game.addObject(middleBar);
    game._draw();

}

// Used by button to start the game
function startGame() {
    game.start();
}
/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    VariableObject.buffer = gl.createBuffer();

    // The vertices used to draw all the rectangles
    let vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, VariableObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

}

