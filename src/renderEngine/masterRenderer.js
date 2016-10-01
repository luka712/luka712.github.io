function MasterRenderer() {
    
    this.RED = 0.5;
    this.BLUE = 0.5;
    this.GREEN = 0.5;

    this.shader = new StaticShader();
    this.terrainShader = new TerrainShader();
    this.renderer = new EntityRenderer(this.shader);
    this.terrainRenderer = new TerrainRenderer(this.terrainShader);
    MasterRenderer.enableBackCull();

    this.entities = {};
    this.terrains = [];

}

MasterRenderer.prototype = {
    prepare: function () {
        GL.enable(GL.DEPTH_TEST);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.clearColor(this.RED, this.GREEN , this.BLUE, 1);
    },

    render: function (sun, camera) {

        this.prepare();
        this.shader.start();
        this.shader.loadLight(sun);
        this.shader.loadViewMatrix(camera);
        this.shader.loadSkyColor(this.RED, this.GREEN , this.BLUE)
        this.renderer.render(this.entities);
        this.shader.stop();
        this.terrainShader.start();
        this.terrainShader.loadLight(sun);
        this.terrainShader.loadSkyColor(this.RED, this.GREEN , this.BLUE);
        this.terrainShader.loadViewMatrix(camera);
        this.terrainRenderer.render(this.terrains);
        this.terrainShader.stop();
        this.entities = {};
        this.terrains = [];
    },
    processEntity: function (entity) {
        var entityModel = entity.texturedModel;
        var batch = [];
        if (this.entities[entityModel.id]) {
            this.entities[entityModel.id].entities.push(entity);
        } else {
            batch.push(entity);
            this.entities[entityModel.id] = {
                model: entityModel,
                entities: batch
            };
        }
    },
    processTerrain: function (terrain) {
        this.terrains.push(terrain);
    },
    cleanUp: function () {
        this.shader.cleanUp();
        this.terrainShader.cleanUp();
    }
}

MasterRenderer.enableBackCull = function () {
    GL.enable(GL.CULL_FACE);
    GL.cullFace(GL.BACK);
}

MasterRenderer.disableBackCull = function () {
    GL.disable(GL.CULL_FACE);
}