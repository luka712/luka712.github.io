function EntityRenderer(shader) {

    var FOV = 70;
    var NEAR_PLANE = 0.1;
    var FAR_PLANE = 1000;

    this.shader = shader;
    var projectionMatrix = mat4.create();
    projectionMatrix = mat4.perspective(projectionMatrix, FOV, WIDTH / HEIGHT, NEAR_PLANE, FAR_PLANE);
    shader.start();
    shader.loadProjectionMatrix(projectionMatrix);
    shader.stop();

}

EntityRenderer.prototype = {

    // render: function (entity, shader) {
    //     var texturedModel = entity.texturedModel;
    //     var model = texturedModel.model;
    //     GL.bindBuffer(GL.ARRAY_BUFFER, model.vao);
    //     shader.enableAttribs();
    //     var transformationMatrix = Maths.createTransformationMatrix(entity.position, entity.rotX, entity.rotY, entity.rotZ, entity.scale);
    //     shader.loadTransformationMatrix(transformationMatrix);
    //     GL.activeTexture(GL.TEXTURE0);
    //     GL.bindTexture(GL.TEXTURE_2D, texturedModel.texture.textureId);
    //     GL.drawElements(GL.TRIANGLES, model.vertexCount, GL.UNSIGNED_SHORT, 0);
    //     shader.disableAttribs();
    //     GL.bindBuffer(GL.ARRAY_BUFFER, null);

    //     GL.flush();
    // },

    prepareInstance: function (entity) {
        var transformationMatrix = Maths.createTransformationMatrix(entity.position, entity.rotX, entity.rotY, entity.rotZ, entity.scale);
        this.shader.loadTransformationMatrix(transformationMatrix);
    },

    render: function (entities) {
        Object.keys(entities).forEach(function (key) {
            this.prepareTexturedModel(entities[key].model);

            for (var i in entities[key].entities) {
                var entity = entities[key].entities[i];
                this.prepareInstance(entity);
                GL.drawElements(GL.TRIANGLES, entity.texturedModel.model.vertexCount, GL.UNSIGNED_SHORT, 0);
            }
        }, this);
        this.unbindTexturedModel();
    },

    prepareTexturedModel: function (texModel) {
        var model = texModel.model;
        var texture = texModel.texture;
        this.shader.enableAttribs();

        var b = model.buffers;
        var gl = GL;


        if (texture.isTransparent) {
            MasterRenderer.disableBackCull();
        }
        this.shader.loadShineVariables(texture.reflectivity, texture.damper);
        this.shader.loadFakeLighting(texture.useFakeLight);

        gl.bindBuffer(b.pBuffer.type, b.pBuffer.buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(b.tBuffer.type, b.tBuffer.buffer);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(b.nBuffer.type, b.nBuffer.buffer);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(b.iBuffer.type, b.iBuffer.buffer);

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture.textureId);
    },

    unbindTexturedModel: function () {
        this.shader.disableAttribs();
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.flush();
    }
}
