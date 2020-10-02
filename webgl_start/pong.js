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

// we keep all the parameters for drawing a specific object together
let rectangleObject = {
    verticeBuffer: -1,
    modelMat: -1
};

let playerModel = {
    size: [100, 100],
    position: [0,0]
}

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    const canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
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

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    rectangleObject.verticeBuffer = gl.createBuffer();

    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.verticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Set up the world coordinates
    let projMat = mat3.create();
    mat3.fromScaling(projMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);

    rectangleObject.modelMat = mat3.create();

    // set matrices for vertex shader
    gl.uniformMatrix3fv(ctx.uProjMat, false, projMat);
    gl.uniformMatrix3fv(ctx.uModelMat, false, rectangleObject.modelMat);

}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    // bind an enable Vertice Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.verticeBuffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniform4f(ctx.uColor, 1, 1, 1, 1);


    drawElement(playerModel);


    console.log("done");
}

function drawElement(element) {
    mat3.fromTranslation(rectangleObject.modelMat, element.position);
    mat3.scale(rectangleObject.modelMat, rectangleObject.modelMat, element.size);
    gl.uniformMatrix3fv(ctx.uModelMat, false, rectangleObject.modelMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}