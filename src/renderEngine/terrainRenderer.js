function TerrainRenderer(shader) {

    var FOV = 70;
    var NEAR_PLANE = 0.1;
    var FAR_PLANE = 1000;

    this.shader = shader;
    var projectionMatrix = mat4.create();
    projectionMatrix = mat4.perspective(projectionMatrix, FOV, WIDTH / HEIGHT, NEAR_PLANE, FAR_PLANE);
    GL.enable(GL.CULL_FACE);
    GL.cullFace(GL.BACK);
    shader.start();
    shader.loadProjectionMatrix(projectionMatrix);
    shader.stop();

}

TerrainRenderer.prototype = {
    loadModelMatrix: function (terrain) {
        var transformationMatrix = Maths.createTransformationMatrix(vec3.fromValues(terrain.x, 0, terrain.z), 0, 0, 0, 1);
        this.shader.loadTransformationMatrix(transformationMatrix);
    },

    render: function (terrains) {
        for (var i in terrains) {
            this.prepareTerrain(terrains[i]);
            this.loadModelMatrix(terrains[i]);
            GL.drawElements(GL.TRIANGLES, terrains[i].model.vertexCount, GL.UNSIGNED_SHORT, 0);
            this.unbindTextureModel();
        }
    },

    prepareTerrain: function (terrain) {
        var texture = terrain.texture;
        var model = terrain.model;
        var gl = GL;
        var b = model.buffers;

                this.shader.enableAttribs();
        this.shader.loadShineVariables( texture.reflectivity, texture.damper);
        
        gl.bindBuffer(b.pBuffer.type, b.pBuffer.buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(b.tBuffer.type, b.tBuffer.buffer);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(b.nBuffer.type, b.nBuffer.buffer);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(b.iBuffer.type, b.iBuffer.buffer);

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture.textureId);
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture.textureId);
    },

    unbindTextureModel: function () {
        this.shader.disableAttribs();
        //GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }
}
