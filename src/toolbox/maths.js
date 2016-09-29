
// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

var Maths = (function () {

    return {
        createTransformationMatrix: function (transformation, rx, ry, rz, scale) {
            var matrix = mat4.create();
            mat4.translate(matrix, matrix, transformation);
            mat4.rotateX(matrix, matrix, Math.radians(rx));
            mat4.rotateY(matrix, matrix, Math.radians(ry));
            mat4.rotateZ(matrix, matrix, Math.radians(rz));
            mat4.scale(matrix, matrix, vec3.fromValues(scale, scale, scale));
            return matrix;
        },

        createProjectionMatrix: function (fov, aspect, nearPlane, farPlane) {
            var y_scale = ((1 / Math.tan(Math.radians(fov / 2))) * aspect);
            var x_scale = y_scale / aspect;
            var frustrum_length = farPlane - nearPlane;

            var projectionMatrix = mat4.create();
            projectionMatrix.m00 = x_scale;
            projectionMatrix.m11 = y_scale;
            projectionMatrix.m22 = -((farPlane + nearPlane) / frustrum_length);
            projectionMatrix.m23 = -1;
            projectionMatrix.m32 = -((2 * nearPlane * farPlane) / frustrum_length);
            projectionMatrix.m33 = 0;

            return projectionMatrix;
        },

        createViewMatrix: function (camera) {
            var matrix = mat4.create();
            mat4.rotateX(matrix, matrix, Math.radians(camera.pitch));
            mat4.rotateY(matrix, matrix, Math.radians(camera.yaw));
            var cameraPos = camera.position;
            var negativeCameraPos = vec3.fromValues(-cameraPos[0], -cameraPos[1], -cameraPos[2]);
            mat4.translate(matrix, matrix, negativeCameraPos);
            return matrix;
        }
    }

})();
