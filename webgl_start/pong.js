//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
let gl;

// we keep all local parameters for the program in a single object
let ctx = {
    shaderProgram: -1,
    uProjMat: -1,
    uModelMat: -1,
    uColor: -1
};

let key = {
    _pressed: {},
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

function isDown(keycode) {
    return key._pressed[keycode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
    console.log("KeyPressed: " + event.keyCode)
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}

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
    startGame();
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


function startGame() {
    let game = new Game();

    let middleBar = new VariableObject();
    middleBar.scale = [1, gl.drawingBufferHeight];
    game.addObject(middleBar);

    game.start();
}
/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    VariableObject.buffer = gl.createBuffer();

    let vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, VariableObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

}

