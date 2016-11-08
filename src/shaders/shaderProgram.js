function ShaderProgram(vertexId, fragmentId) {
    this.vertexShader = loadShader(vertexId, GL.VERTEX_SHADER);
    this.fragmentShader = loadShader(fragmentId, GL.FRAGMENT_SHADER);
    this.programId = GL.createProgram();
    GL.attachShader(this.programId, this.vertexShader);
    GL.attachShader(this.programId, this.fragmentShader);
            this.bindAttributes();
    GL.linkProgram(this.programId);
    GL.validateProgram(this.programId);
    this.getAllUniformLocations();

    function loadShader(id, type) {
        var shader = GL.createShader(type);
        var source = document.getElementById(id).innerText;

        GL.shaderSource(shader, source);
        GL.compileShader(shader);

        var compiled = GL.getShaderParameter(shader, GL.COMPILE_STATUS);
        if (compiled) {
            return shader;
        }
        console.log('Shader compiled successfully: ' + compiled);
        var compilationLog = GL.getShaderInfoLog(shader);
        console.log('Shader compiler log: ' + compilationLog);

        throw new Error(compilationLog);
    }

}

ShaderProgram.prototype = {
    bindAttributes: function () {

    },
    getAllUniformLocations: function () {

    },
    bindAttribute: function (attribLocation, attribName) {
        GL.bindAttribLocation(this.programId, attribLocation, attribName);
    },
    start: function () {
        GL.useProgram(this.programId);
    },
    stop: function () {
        GL.useProgram(null);
    },
    cleanUp: function () {
        GL.detachShader(this.programId, this.vertexShader);
        GL.detachShader(this.programId, this.fragmentId);
        GL.deleteShader(this.vertexShader);
        GL.deleteShader(this.fragmentId);
        GL.deleteProgram(this.programId);
    },
    getUniformLocation: function (name) {
        return GL.getUniformLocation(this.programId, name);
    },
    loadFloat: function (location, value) {
        GL.uniform1f(location, value);
    },
    loadBoolean: function (location, value) {
        GL.uniform1f(location, value ? 1 : 0);
    },
    loadVector: function (location, value) {
        GL.uniform3fv(location, value);
    },
    loadMatrix: function (location, value) {
        GL.uniformMatrix4fv(location, false, value);
    },
    loadInt: function(location, value){
        GL.uniform1i(location, value);
    }
}
