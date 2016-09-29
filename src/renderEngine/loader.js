function Loader() {

    this.vbos = [];
    this.vaos = [];

    var _this = this;

    function createVAO() {
        var vao = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, vao);
        _this.vaos.push(vao);
        return vao;
    }

    function unbindVAO(vaoId) {

        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }

    function storeDataInAttributeList(attr, size, data) {
        var vbo = GL.createBuffer();
        _this.vbos.push(vbo);
        GL.bindBuffer(GL.ARRAY_BUFFER, vbo);
        var data = new Float32Array(data);
        GL.bufferData(GL.ARRAY_BUFFER, data, GL.STATIC_DRAW);
        GL.enableVertexAttribArray(attr);
        GL.vertexAttribPointer(attr, size, GL.FLOAT, false, 0, 0);
        return {
            buffer: vbo,
            data: data,
            type: GL.ARRAY_BUFFER
        };
    }

    function bindIndicesBuffer(indices) {
        var vboID = GL.createBuffer();
        _this.vbos.push(vboID);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vboID);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), GL.STATIC_DRAW);
        return {
            buffer: vboID,
            data: new Uint16Array(indices),
            type: GL.ELEMENT_ARRAY_BUFFER
        };

    }

    this.loadToVao = function (positions, texCoords, normals, indices) {
        var vaoID = createVAO();
        var i = bindIndicesBuffer(indices);
        var p = storeDataInAttributeList(0, 3, positions);
        var t = storeDataInAttributeList(1, 2, texCoords);
        var n = storeDataInAttributeList(2, 3, normals);
        unbindVAO();
        return new RawModel(vaoID, indices.length, {
            iBuffer: i,
            pBuffer: p,
            tBuffer: t,
            nBuffer: n
        });
    }

    this.loadTexture = function (filename) {
        var texture = GL.createTexture();

        GL.bindTexture(GL.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 blue pixel.
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE,
            new Uint8Array([0, 255, 255, 255]));

        var image = new Image();
        image.src = "./assets/" + filename + ".png";
        image.onload = function () {
            GL.bindTexture(GL.TEXTURE_2D, texture);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
            GL.generateMipmap(GL.TEXTURE_2D);
            GL.bindTexture(GL.TEXTURE_2D, null);
        };
        GL.bindTexture(GL.TEXTURE_2D, null);

        return texture;
    }

    this.cleanUp = function () {
        for (var i = 0; i < this.vbos.length; i++) {
            GL.deleteBuffer(this.vbos[i]);
        }
        for (var i = 0; i < this.vaos.length; i++) {
            GL.deleteVertexArrays(this.vaos[i]);
        }
    }
};
