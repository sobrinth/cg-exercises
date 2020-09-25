
/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 *
 */
function initTexture(image, textureObject) {
    // create texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject);

    // set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    // turn the texture off again
    gl.bindTexture(gl.TEXTURE_2D, null);
}