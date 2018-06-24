
function onLoad() {

    var canvas = setUpCanvas();

    var engine = new BABYLON.Engine(canvas, true);

    var scene = createScene(engine, canvas);
    scene.clearColor = new BABYLON.Color3(0.39, 0.58, 0.93);

    // engine.runRenderLoop(function () {
    //     scene.render();
    // });

    window.addEventListener('resize', function () {
        setUpCanvas();
        engine.resize();
        scene.render();
    });
}

function createScene(engine, canvas) {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 1, -30), scene);

    camera.setTarget(BABYLON.Vector3.Zero());

    camera.attachControl(canvas, false);

    var light = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(-0.3, -1, 1), scene);
    light.position = new BABYLON.Vector3(10, 10, -20);

    var customMesh = new BABYLON.Mesh("custom", scene);
    var material = new BABYLON.StandardMaterial("myMaterial", scene);
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    customMesh.material = material;
    customMesh.specularColor = new BABYLON.Color3(0, 0, 0);
    customMesh.receiveShadows = true;
    var terrainData = createTerrainData();
    var vertexData = new BABYLON.VertexData();
    var normals = [];
    BABYLON.VertexData.ComputeNormals(terrainData.positions, terrainData.indices, normals);
    vertexData.positions = terrainData.positions;
    vertexData.indices = terrainData.indices;
    vertexData.colors = terrainData.colors;
    vertexData.normals = normals;

    vertexData.applyToMesh(customMesh);

    loadModels(vertexData, scene, light);

    return scene;
}

function createTerrainData() {
    var i = 0;
    var positions = [];
    var indices = [];
    for (var x = -15; x < 15; x++) {
        for (var z = -30; z < 20; z++) {
            var face = createFace([x, 0, z + 1], [x, 0, z], [x + 1, 0, z], [x + 1, 0, z + 1], i);
            positions = positions.concat(face.verts);
            indices = indices.concat(face.indices);
            i = face.i;
        }
    }

    var hills = [
        new Hill(3, 20, 9, 10),
        new Hill(-10, 20, 11, 12),
        new Hill(15, 20, 5, 5),
        new Hill(10, 10, 2, 10),
        new Hill(8, 20, 15, 5)
    ];

    var green = [0.37, 0.7, 0.22, 1];
    var brown = [0.6, 0.3, 0, 1];
    var grey = [0.5, 0.5, 0.5];
    var white = [1, 1, 1, 1];

    var colors = [];
    for (var i = 0; i <= positions.length; i += 3) {
        var x = positions[i];
        var y = positions[i + 1];
        var z = positions[i + 2];

        for (var j = 0; j < hills.length; j++) {
            var hill = hills[j];
            if (hill.height > y) {
                var distance = Math.pow(x - hill.x, 2) + Math.pow(z - hill.z, 2);
                if (distance <= hill.distSqr) {
                    var newY = hill.height * (1 - distance / hill.distSqr);
                    if (newY > hill.height) {
                        newY = hill.height;
                    }

                    if (newY < positions[i + 1]) {
                        continue;
                    }

                    positions[i + 1] = newY;
                }
            }
        }
    }

    for (var i = 0; i <= positions.length; i += 9) {
        var y1 = positions[i + 1];
        var y2 = positions[i + 4];
        var y3 = positions[i + 7];

        var yAverage = (y1 + y2 + y3) / 3;

        var color = green.slice();
        if (yAverage > 0.5 && yAverage < 6) {
            color = brown;
        } else if (yAverage >= 6) {
            color = white;
        }

        for (var j = 0; j < 3; j++) {
            colors.push(color[0]);
            colors.push(color[1]);
            colors.push(color[2]);
            colors.push(color[3]);
        }
    }

    return {
        positions: positions,
        indices: indices,
        colors: colors
    }
}

function createMaterials(scene) {

    var leafeMaterial = new BABYLON.StandardMaterial("pineTrunkMaterial", scene);
    leafeMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.3, 0.3);

    var trunkMaterial = new BABYLON.StandardMaterial("pineLeafeMaterial", scene);
    trunkMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);

    return {
        pineTrunk: trunkMaterial,
        pineLeafes: leafeMaterial
    }
}

function Hill(x, z, height, distance) {
    this.x = x;
    this.z = z;
    this.height = height;
    this.distance = distance;
    this.distSqr = distance * distance;
}

function TreeZone(minX, maxX, minZ, maxZ, amount) {
    this.minX = minX;
    this.maxX = maxX;
    this.minZ = minZ;
    this.maxZ = maxZ;
    this.amount = amount;
}

function createFace(topLeft, bottomLeft, bottomRight, topRight, i) {

    var v1 = topLeft;
    var v2 = bottomLeft;
    var v3 = bottomRight;
    var v4 = bottomRight;
    var v5 = topRight;
    var v6 = topLeft;

    var indices = [i++, i++, i++, i++, i++, i++];
    var c = [0, 1, 0, 1];

    return {
        verts: v1.concat(v2, v3, v4, v5, v6),
        indices: indices,
        colors: c.concat(c, c, c, c, c),
        i: i
    }
}

function lerp(start, destination, amount) {
    return start + amount * (destination - start);
}

function loadModels(terrainVertexData, scene, light) {
    BABYLON.SceneLoader.LoadAssetContainer("./", "../../../../models/PineTree.obj", scene, function (container) {
        var meshes = container.meshes;
        var materials = createMaterials(scene);
        var pineTrunkMesh = meshes[0];
        var pineLeafMesh = meshes[1];
        pineTrunkMesh.material = materials.pineTrunk;
        pineLeafMesh.material = materials.pineLeafes;

        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

        var treeZones = [
            // middle
            new TreeZone(-15, 15, -5, 5, 0.05),
            // hills
            new TreeZone(-15, 15, 5, 11, 0.02),
            // close to camera
            new TreeZone(-15, 15, -23, 5, 0.05),

        ];

        for (var i = 0; i < terrainVertexData.positions.length; i += 9) {

            for (var j = 0; j < treeZones.length; j++) {

                var v1 = new BABYLON.Vector3(terrainVertexData.positions[i], terrainVertexData.positions[i + 1], terrainVertexData.positions[i + 2]);
                var v2 = new BABYLON.Vector3(terrainVertexData.positions[i + 3], terrainVertexData.positions[i + 4], terrainVertexData.positions[i + 5]);
                var v3 = new BABYLON.Vector3(terrainVertexData.positions[i + 6], terrainVertexData.positions[i + 7], terrainVertexData.positions[i + 8]);
                if (v1.x >= treeZones[j].minX && v1.x <= treeZones[j].maxX && v1.z >= treeZones[j].minZ && v1.z <= treeZones[j].maxZ) {

                    var shouldCreate = Math.random();
                    if (shouldCreate >= treeZones[j].amount) {
                        continue;
                    }
                    var x = ((v1.x + v2.x + v3.x) / 3) - 0.5 + Math.random();
                    var y = (v1.y + v2.y + v3.y) / 3;
                    var z = ((v1.z + v2.z + v3.z) / 3) - 0.5 + Math.random();
                    var pine = new BABYLON.TransformNode("pine" + i + "zone" + j);
                    var trunk = pineTrunkMesh.createInstance("pineTrunkMeshInstance" + i + "zone" + j);
                    var leafes = pineLeafMesh.createInstance("pineLeafMeshInstance" + i + "zone" + j);
                    shadowGenerator.getShadowMap().renderList.push(trunk);
                    shadowGenerator.getShadowMap().renderList.push(leafes);
                    trunk.parent = pine;
                    leafes.parent = pine;
                    var scale = Math.random() * 0.3 - 0.15;
                    pine.scaling = new BABYLON.Vector3(0.5 + scale, 0.5 + scale, 0.5 + scale);
                    pine.position = new BABYLON.Vector3(x, y + scale, z);
                    pine.rotation.y = Math.random() * Math.PI;
                }
            }
        }
        scene.render();
    });

}

function setUpCanvas() {

    var header = $('header');
    var canvas = document.getElementById('render-canvas');
    canvas.width =  header.outerWidth();
    canvas.height = header.outerHeight();

    return canvas;
}