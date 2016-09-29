
Object.defineProperties(window, {
    "WIDTH": {
        value: 1280,
        writable: false
    }, "HEIGHT": {
        value: 720,
        writable: false
    }

});

var GL;

var loader;
var renderer;
var shader;
var model;
var entity;
var camera;
var light;
var entities = [];
var terrain1, terrain2;
var terrains = [];


function main() {

    var canvas = document.getElementById("renderCanvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    try {
        GL = canvas.getContext("experimental-webgl", { antialias: true });
    } catch (e) {
        alert("WebGL unavailable");
        return false;
    }


    DisplayManager.create();
    loader = new Loader();
    renderer = new MasterRenderer(shader);
    camera = new Camera();
    light = new Light([0, 0, -20.0], [1.0, 1.0, 1.0]);

    var grassTexture = new ModelTexture(loader.loadTexture("grass"));
    terrain1 = new Terrain(0, 0, loader, grassTexture);
    terrain2 = new Terrain(1, 0, loader, grassTexture);
    terrains = [terrain1, terrain2];

    loadModel('tree', 'tree', 3);
    loadModel('lowPolyTree', 'lowPolyTree', 0.3);
    loadModel('fern', 'fern', 0.3, true);
    loadModel('grassModel', 'grassTexture', 1, true, true);
    loadModel('grassModel', 'flower', 1, true, true);

    animate();
}

function animate() {
    camera.move();
    renderer.render(light, camera);
    for (var i in terrains) {
        renderer.processTerrain(terrains[i]);
    }
    for (var i in entities) {
        renderer.processEntity(entities[i]);
    }
    GL.flush();
    window.requestAnimationFrame(animate);
}

function loadModel(model, textureName, scale, transparent, fakelight) {

    objLoader.loadObjModel(model, textureName, scale, transparent, fakelight, function (v, t, n, i, texureName, scale, transparent, fakelight) {

        rawModel = loader.loadToVao(v, t, n, i);
        var texture = loader.loadTexture(texureName);
        texture.useFakeLight = fakelight;
        texture.isTransparent = transparent;

        var tex = new ModelTexture(texture);
        model = new TexturedModel(rawModel, tex, textureName);
        for (var i = 0; i < 100; i++) {
            this.entities.push(new Entity(model, vec3.fromValues(Math.random() * 800 - 400, 0, Math.random() * - 600), 0, 0, 0, scale));
        }

    });
}