//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1, //wird unten wieder überschrieben
    aVertexPositionId: -1,
    aVertexTextureCoordId: -1,
    uSampler2DId: -1
};

// all the parameters for the lena texture
var woolTexture = {
    textureObj: {}
};

function loadTexture() {
    var image = new Image();
    // create texture object
    woolTexture.textureObj = gl.createTexture();
    image.onload = function() {
        initTexture(image, woolTexture.textureObj);
        // make sure to redraw
        draw()
    };
    image.src = "light_blue_wool.png";
}

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    verticeBuffer: -1,
    colorBuffer: -1,
    texturePosBuffer: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    loadTexture();
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

    // set the clear color here
    gl.clearColor(.2,.2,.2,1); //-> damit wird alles übermalen (erst wenn clear)
    
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    // finds the index of the variable in the program || überschreibt ctx.aVertexPositionId
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    rectangleObject.verticeBuffer = gl.createBuffer();
    rectangleObject.texturePosBuffer = gl.createBuffer();


    var vertices = [
        -0.5,0.5,
        0.5,0.5,
        0.5,-0.5,
        -0.5,-0.5,
    ];

    var texturePos = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]

    // setup texture buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.texturePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturePos), gl.STATIC_DRAW);

    // setup vertice buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.verticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    // add drawing routines here
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.verticeBuffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0,0);

    gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.texturePosBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, woolTexture.textureObj);
    gl.uniform1i(ctx.uSampler2DId, 0)

    gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
    console.log("done");
}