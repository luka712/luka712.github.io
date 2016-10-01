function StaticShader() {
    this.position_transformationMatrix = null;
    this.position_projectionMatrix = null;
    this.position_viewMatrix = null;
    this.position_lightPos = null;
    this.position_lightColor = null;
    this.position_reflectivity = null;
    this.position_shineDamper = null;
    this.position_fakeLighting = null;
    this.position_skyColor = null;
    this.attribLocations = [];
    ShaderProgram.call(this, "vertexShader", "fragmentShader");

    this.inverseMatrix = null;
}

StaticShader.prototype = Object.create(ShaderProgram.prototype);

StaticShader.prototype.bindAttributes = function () {
    this.attribLocations = [0, 1, 2];
    this.bindAttribute(0, "a_position");
    this.bindAttribute(1, "a_texCoords");
    this.bindAttribute(2, "a_normals");
}

StaticShader.prototype.getAllUniformLocations = function () {
    this.position_transformationMatrix = this.getUniformLocation("u_transformationMatrix");
    this.position_projectionMatrix = this.getUniformLocation("u_projectionMatrix");
    this.position_viewMatrix = this.getUniformLocation("u_viewMatrix");
    this.position_lightPos = this.getUniformLocation("u_lightPosition");
    this.position_lightColor = this.getUniformLocation("u_lightColor");
    this.position_reflectivity = this.getUniformLocation("u_reflectivity");
    this.position_shineDamper = this.getUniformLocation("u_shineDamper");
    this.position_inverseViewMatrix = this.getUniformLocation("u_inverseViewMatrix");
    this.position_fakeLighting = this.getUniformLocation("u_fakeLighting");
    this.position_skyColor = this.getUniformLocation("u_skyColor");
}

StaticShader.prototype.loadSkyColor = function (r, g, b) {
    this.loadVector(this.position_skyColor, [r, g, b]);
}

StaticShader.prototype.loadTransformationMatrix = function (value) {
    this.loadMatrix(this.position_transformationMatrix, value);
}

StaticShader.prototype.loadProjectionMatrix = function (value) {
    this.loadMatrix(this.position_projectionMatrix, value);
}

StaticShader.prototype.loadViewMatrix = function (camera) {
    var matrix = Maths.createViewMatrix(camera);
    this.loadMatrix(this.position_viewMatrix, matrix);
    this.loadMatrix(this.position_inverseViewMatrix, mat4.invert(matrix, matrix));
}

StaticShader.prototype.loadLight = function (light) {
    this.loadVector(this.position_lightPos, light.position);
    this.loadVector(this.position_lightColor, light.color);
}

StaticShader.prototype.loadShineVariables = function (reflectivity, damper) {
    this.loadFloat(this.position_reflectivity, reflectivity);
    this.loadFloat(this.position_shineDamper, damper);
}

StaticShader.prototype.loadFakeLighting = function (val) {
    this.loadFloat(this.position_fakeLighting, val ? 1.0 : 0.0);
}

StaticShader.prototype.enableAttribs = function () {
    this.attribLocations.forEach(function (l) {
        GL.enableVertexAttribArray(l);
    });
}

StaticShader.prototype.disableAttribs = function () {
    this.attribLocations.forEach(function (l) {
        GL.disableVertexAttribArray(l);
    });
}

