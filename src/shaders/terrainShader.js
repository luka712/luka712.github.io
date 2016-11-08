function TerrainShader() {
    this.position_transformationMatrix = null;
    this.position_projectionMatrix = null;
    this.position_viewMatrix = null;
    this.position_lightPos = null;
    this.position_lightColor = null;
    this.position_reflectivity = null;
    this.position_shineDamper = null;
    this.position_skyColor = null;
    this.attribLocations = [];
    this.position_backgroundTexture = null;
    this.position_redTexture = null;
    this.position_greenTexture = null;
    this.position_blueTexture = null;
    this.position_blendMapTexture = null;
    ShaderProgram.call(this, "terrainVertexShader", "terrainFragmentShader");

    this.inverseMatrix = null;
}

TerrainShader.prototype = Object.create(ShaderProgram.prototype);

TerrainShader.prototype.bindAttributes = function () {
    this.attribLocations = [0, 1, 2];
    this.bindAttribute(0, "a_position");
    this.bindAttribute(1, "a_texCoords");
    this.bindAttribute(2, "a_normals");
}

TerrainShader.prototype.getAllUniformLocations = function () {
    this.position_transformationMatrix = this.getUniformLocation("u_transformationMatrix");
    this.position_projectionMatrix = this.getUniformLocation("u_projectionMatrix");
    this.position_viewMatrix = this.getUniformLocation("u_viewMatrix");
    this.position_lightPos = this.getUniformLocation("u_lightPosition");
    this.position_lightColor = this.getUniformLocation("u_lightColor");
    this.position_reflectivity = this.getUniformLocation("u_reflectivity");
    this.position_shineDamper = this.getUniformLocation("u_shineDamper");
    this.position_inverseViewMatrix = this.getUniformLocation("u_inverseViewMatrix");
    this.position_skyColor = this.getUniformLocation("u_skyColor");
    this.position_backgroundTexture = this.getUniformLocation("u_backgroundTexture");
    this.position_redTexture = this.getUniformLocation("u_redTexture");
    this.position_greenTexture = this.getUniformLocation("u_greenTexture");
    this.position_blueTexture = this.getUniformLocation("u_blueTexture");
    this.position_blendMapTexture = this.getUniformLocation("u_blendMapTexture");
}

TerrainShader.prototype.connectTextureUnits = function () {
    this.loadInt(this.position_backgroundTexture, 0);
    this.loadInt(this.position_redTexture, 1);
    this.loadInt(this.position_greenTexture, 2);
    this.loadInt(this.position_blueTexture, 3);
    this.loadInt(this.position_blendMapTexture, 4);
}

TerrainShader.prototype.loadSkyColor = function (r, g, b) {
    this.loadVector(this.position_skyColor, [r, g, b]);
}

TerrainShader.prototype.loadTransformationMatrix = function (value) {
    this.loadMatrix(this.position_transformationMatrix, value);
}

TerrainShader.prototype.loadProjectionMatrix = function (value) {
    this.loadMatrix(this.position_projectionMatrix, value);
}

TerrainShader.prototype.loadViewMatrix = function (camera) {
    var matrix = Maths.createViewMatrix(camera);
    this.loadMatrix(this.position_viewMatrix, matrix);
    this.loadMatrix(this.position_inverseViewMatrix, mat4.invert(matrix, matrix));
}

TerrainShader.prototype.loadLight = function (light) {
    this.loadVector(this.position_lightPos, light.position);
    this.loadVector(this.position_lightColor, light.color);
}

TerrainShader.prototype.loadShineVariables = function (reflectivity, damper) {
    this.loadFloat(this.position_reflectivity, reflectivity);
    this.loadFloat(this.position_shineDamper, damper);
}

TerrainShader.prototype.enableAttribs = function () {
    this.attribLocations.forEach(function (l) {
        GL.enableVertexAttribArray(l);
    });
}

TerrainShader.prototype.disableAttribs = function () {
    this.attribLocations.forEach(function (l) {
        GL.disableVertexAttribArray(l);
    });
}

