

var objLoader = (function () {

    function processVertex(vertexdata, indices, textures, normals, texArray, normalsArray) {
        var vertexPointer = parseInt(vertexdata[0]) - 1;
        indices.push(vertexPointer);
        var texCoord = textures[parseInt(vertexdata[1]) - 1];
        texArray[vertexPointer * 2] = texCoord.x;
        texArray[vertexPointer * 2 + 1] = 1 - texCoord.y;
        var nCoord = normals[parseInt(vertexdata[2]) - 1];
        normalsArray[vertexPointer * 3] = nCoord.x;
        normalsArray[vertexPointer * 3 + 1] = nCoord.y;
        normalsArray[vertexPointer * 3 + 2] = nCoord.z;
    }

    return {
        loadObjModel(filename, texture, scale, callback) {
            var client = new XMLHttpRequest();
            client.open('GET', 'assets/' + filename + '.obj');
            client.onreadystatechange = function () {
                if (client.readyState == 4) {
                    var lines = client.responseText.split('\n');

                    var vertices = [];
                    var textures = [];
                    var normals = [];
                    var indices = [];

                    var textureArray = null;
                    var normalsArray = null;

                    lines.forEach(function (line) {

                        var currentLine = line.split(' ');

                        if (line.startsWith('v ')) {
                            vertices.push({
                                x: currentLine[1],
                                y: currentLine[2],
                                z: currentLine[3]
                            });
                        } else if (line.startsWith('vt ')) {
                            textures.push({
                                x: currentLine[1],
                                y: currentLine[2]
                            });
                        } else if (line.startsWith('vn ')) {
                            normals.push({
                                x: currentLine[1],
                                y: currentLine[2],
                                z: currentLine[3]
                            });
                        } else if (line.startsWith('f ')) {
                            textureArray = new Array(vertices.length * 2);
                            normalsArray = new Array(vertices.length * 3);
                            return;
                        }
                    });

                    lines.forEach(function (line) {
                        if (line.startsWith("f ")) {

                            var currentLine = line.split(' ');
                            var vertex1 = currentLine[1].split('/');
                            var vertex2 = currentLine[2].split('/');
                            var vertex3 = currentLine[3].split('/');

                            processVertex(vertex1, indices, textures, normals, textureArray, normalsArray);
                            processVertex(vertex2, indices, textures, normals, textureArray, normalsArray);
                            processVertex(vertex3, indices, textures, normals, textureArray, normalsArray);
                        }
                    });

                    var verticesArray = [];
                    vertices.forEach(function (vertex) {
                        verticesArray.push(vertex.x);
                        verticesArray.push(vertex.y);
                        verticesArray.push(vertex.z);
                    });

                    callback(verticesArray, textureArray, normalsArray, indices, texture, scale);
                }
            }
            client.send();

        }
    }

})();