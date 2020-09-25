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
var textures = {
    textureObj: {},
    textureObj2: {}
};

function loadTexture() {
    var image = new Image();
    var image2 = new Image();
    // create texture object
    textures.textureObj = gl.createTexture();
    textures.textureObj2 = gl.createTexture();
    image.onload = function() {
        initTexture(image, textures.textureObj);
        // make sure to redraw
        draw()
    };
    image2.onload = function() {
        initTexture(image2, textures.textureObj2);
        // make sure to redraw
        draw()
    };
    image.src = "light_blue_wool.png";
    image2.src = "light_gray_wool.png";
}

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    verticeBuffer: -1,
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

    // set the clear color
    gl.clearColor(.2,.2,.2,1);
    
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";

    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    var vertices = [
        // square 1
        -1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        -1.0, 0.0,
        // square 2
        0.0, 0.0,
        1.0, 0.0,
        1.0, -1.0,
        0.0, -1.0,
        // square 3
        -1.0, 0.0,
        0.0, 0.0,
        0.0, -1.0,
        -1.0, -1.0,
        // square 4
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];

    var texturePos = [
        // square 1
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // square 2
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // square 3
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // square 4
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]

    // setup texturePos buffer
    rectangleObject.texturePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.texturePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturePos), gl.STATIC_DRAW);

    // setup vertice buffer
    rectangleObject.verticeBuffer = gl.createBuffer();
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

    // bind an enable Vertice Buffer
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.verticeBuffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0,0);

    // bind and enable TexturePosition Buffer
    gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.texturePosBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);

    // bind textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.textureObj);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.textureObj2);

    // select texture and draw
    gl.uniform1i(ctx.uSampler2DId, 0)
    gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4,4);

    // select texture and draw
    gl.uniform1i(ctx.uSampler2DId, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 8,4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12,4);

    console.log("done");
}