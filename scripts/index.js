var time = 0.0;
function onLoad() {

    var canvas = setUpCanvas();
    var postProcessEffect = null,
        sceneInstrumentation = null;


    var engine = new BABYLON.Engine(canvas, true);

    var scene = createScene(engine, canvas);
    scene.clearColor = new BABYLON.Color3(0.39, 0.58, 0.93);

    engine.runRenderLoop(function () {

        scene.render();
    });

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

    sceneInstrumentation = new BABYLON.SceneInstrumentation(scene);
    sceneInstrumentation.captureFrameTime = true;

    postProcessEffect = postProcess(camera, canvas);
    setUpCanvas();
    postProcessEffect.onApply = function (effect) {
        effect.setFloat2("screenSize", canvas.width, canvas.height);
        effect.setFloat("time", time);
        if(window.location.pathname === "/"){
            time += 0.02;
        }else{
            time += 0.005;
        }
       
    };

    return scene;
}


function postProcess(camera, canvas) {
    if(window.location.pathname === "/"){
        BABYLON.Effect.ShadersStore["customFragmentShader"] = `
        #ifdef GL_ES
            precision highp float;
        #endif

        // Samplers
        varying vec2 vUV;
        uniform sampler2D textureSampler;

        // Parameters
        uniform vec2 screenSize;
        uniform float time;
        uniform float toneColor;

        float Circle(vec2 uv, vec2 pos, float r){
            float d = length(uv - pos);
            return r / d;
        }

        void main(void) 
        {
            vec2 uv = vUV;
            uv -= .5;
            uv.x *= screenSize.x / screenSize.y;


            float r = .02;
            float c = Circle(uv, vec2(sin(time * .66) * .25,  cos(time * .25) * .25), r);
            c += Circle(uv, vec2(sin(time * .5) * .25, cos(time * .7) * .25), r);
            c += Circle(uv, vec2(sin(time * .7) * .25, cos(time * .8) * .25), r);
            c += Circle(uv, vec2(sin(time * .2) * .25, cos(time * .3) * .25), r);
            c += Circle(uv, vec2(sin(time * .3) * .25, cos(time * .4) * .25), r);
            c += Circle(uv, vec2(sin(time * .6) * .25, cos(time * .6) * .25), r);
            c += Circle(uv, vec2(sin(time * .5) * .25, cos(time * .2) * .25), r);
            c += Circle(uv, vec2(sin(time * .3) * .25, cos(time * .6) * .25), r);
            c += Circle(uv, vec2(sin(time * .7) * .25, cos(time * .3) * .25), r);
            c += Circle(uv, vec2(sin(time * .9) * .25, cos(time * .1) * .25), r);

            gl_FragColor = vec4(vec3(-.5), 1.)  + vec4(.25 * c, 0.5 * c, 1., .1) * c;
    
        }
        `;
    }else{
        BABYLON.Effect.ShadersStore["customFragmentShader"] = `
        #ifdef GL_ES
            precision highp float;
        #endif

        // Samplers
        varying vec2 vUV;
        uniform sampler2D textureSampler;

        // Parameters
        uniform vec2 screenSize;
        uniform float time;
        uniform float toneColor;

        float Circle(vec2 uv, vec2 pos, float r){
            float d = length(uv - pos - vec2(-.25, .25));
            return r / d;
        }

        void main(void) 
        {
            vec2 uv = vUV;
            uv -= .5;
            uv.x *= screenSize.x / screenSize.y;


            float r = .005;
            float c = Circle(uv, vec2(sin(time * 2.) * .1,  sin(time * .4) * .1), r);
            c += Circle(uv, vec2(sin(time * -.5) * .1, sin(time * -.7) * .1), r);
            c += Circle(uv, vec2(sin(time * -.7) * .1, sin(time * .8) * .1), r);
            c += Circle(uv, vec2(sin(time * -.2) * .1, sin(time * -.3) * .1), r);
            c += Circle(uv, vec2(sin(time * .3) * .1, sin(time * .4) * .1), r);
            c += Circle(uv, vec2(sin(time * -.6) * .1, sin(time * -.6) * .1), r);
            c += Circle(uv, vec2(sin(time * .5) * .1, sin(time * .2) * .1), r);
            c += Circle(uv, vec2(sin(time * -.3) * .1, sin(time * -.6) * .1), r);
            c += Circle(uv, vec2(sin(time * .7) * .1, sin(time * .3) * .1), r);
            c += Circle(uv, vec2(sin(time * -.2) * .1, sin(-time) * .1), r);
            c += Circle(uv, vec2(sin(time * -.5) * .1, sin(time * -.51) * .1), r);
            c += Circle(uv, vec2(sin(time * -.3) * .1, sin(time * .2) * .1), r);
            c += Circle(uv, vec2(sin(time * .3) * .1, sin(time * .4) * .1), r);
            c += Circle(uv, vec2(sin(time * -.6) * .1, sin(time * -.5) * .1), r);
            c += Circle(uv, vec2(sin(time * -.3) * .1, sin(time * .52) * .1), r);
            c += Circle(uv, vec2(sin(time * .6) * .1, sin(time * -.3) * .1), r);
            c += Circle(uv, vec2(sin(time * .76) * .1, sin(time * -.3) * .1), r);
            c += Circle(uv, vec2(sin(time * .96) * .1, sin(-time * .2) * .1), r);

           
            gl_FragColor = vec4(vec3(1., 0.5, 0.5) * c * .2, 1.);
    
        }
        `;
    }

    return new BABYLON.PostProcess("My custom post process", "custom", ["screenSize", "time", "toneColor"], null, 1, camera);
}

function setUpCanvas() {

    var header = $('header');
    var canvas = document.getElementById('render-canvas');
    canvas.width = header.outerWidth();
    canvas.height = header.outerHeight();

    return canvas;
}