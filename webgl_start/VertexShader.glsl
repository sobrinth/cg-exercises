attribute vec2 aVertexPosition;

uniform mat3 uModelMat;
uniform mat3 uProjMat;

void main () {
    gl_Position = vec4(uProjMat * uModelMat * vec3(aVertexPosition, 1), 1);
}