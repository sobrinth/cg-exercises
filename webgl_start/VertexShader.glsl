attribute vec2 aVertexPosition;

uniform mat3 uModelMat;
uniform mat3 uProjMat;

void main () {
    vec3 projPos = uProjMat * uModelMat * vec3(aVertexPosition, 1);
    gl_Position = vec4(vec2(projPos[0], projPos[1]), 0, projPos[2]);
    //gl_Position = vec4(uProjMat * uModelMat * vec3(aVertexPosition, 1), 1);
}