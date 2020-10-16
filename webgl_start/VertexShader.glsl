attribute vec3 aVertexPosition;

uniform mat4 uViewMat;
uniform mat4 uProjMat;
uniform mat4 uWorldMat;
attribute vec4 aColor;

varying vec4 uColor;

void main () {
    uColor = aColor;
    gl_Position = uProjMat * uViewMat * uWorldMat * vec4(aVertexPosition, 1);}