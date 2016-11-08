function Terrain(gridx, gridz, loader, texturePack, blendMapTexture) {

    this.SIZE = 800;
    this.VERTEX_COUNT = 8;
    this.texturePack = texturePack;
    this.blendMapTexture = blendMapTexture;
    this.x = gridx * this.SIZE;
    this.z = gridz * this.SIZE;
    this.model = this.generateTerrain(loader);

}

Terrain.prototype = {
    generateTerrain: function (loader) {
        var count = this.VERTEX_COUNT * this.VERTEX_COUNT;
        var vertices = new Array(count * 3);
        var texCoords = new Array(count * 2);
        var normals = new Array(count * 3);
        var indices = new Array(6 * (this.VERTEX_COUNT - 1) * this.VERTEX_COUNT);
        var vertexPointer = 0;
        for (var i = 0; i < this.VERTEX_COUNT; i++) {
            for (var j = 0; j < this.VERTEX_COUNT; j++) {
                vertices[vertexPointer * 3] = -j / (this.VERTEX_COUNT - 1) * this.SIZE;
                vertices[vertexPointer * 3 + 1] = 0;
                vertices[vertexPointer * 3 + 2] = -i / (this.VERTEX_COUNT - 1) * this.SIZE;
                normals[vertexPointer * 3] = 0;
                normals[vertexPointer * 3 + 1] = 1;
                normals[vertexPointer * 3 + 2] = 0;
                texCoords[vertexPointer * 2] = j / (this.VERTEX_COUNT - 1);
                texCoords[vertexPointer * 2 + 1] = i / (this.VERTEX_COUNT - 1);
                vertexPointer++;
            }
        }
        var pointer = 0;
        for (var gz = 0; gz < this.VERTEX_COUNT - 1; gz++) {
            for (var gx = 0; gx < this.VERTEX_COUNT - 1; gx++) {
                var topLeft = (gz * this.VERTEX_COUNT) + gx;
                var topRight = topLeft + 1;
                var bottomLeft = ((gz + 1) * this.VERTEX_COUNT) + gx;
                var bottomRight = bottomLeft + 1;
                indices[pointer++] = topLeft;
                indices[pointer++] = bottomLeft;
                indices[pointer++] = topRight;
                indices[pointer++] = topRight;
                indices[pointer++] = bottomLeft;
                indices[pointer++] = bottomRight;
            }
        }

        return loader.loadToVao(vertices, texCoords, normals, indices);
    }
}
