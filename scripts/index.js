var time = 3.0;
function onLoad() {

    var canvas = setUpCanvas();
    var postProcessEffect = null,
        sceneInstrumentation = null;


    var engine = new BABYLON.Engine(canvas, true);

    var scene = createScene(engine, canvas);
    scene.clearColor = new BABYLON.Color3(0., 0, 0.);

    engine.runRenderLoop(function () {
        scene.clearColor = new BABYLON.Color3(0., 0, 0.);
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
            float d = length(uv - pos);
            return r / d;
        }

        float random(vec2 uv){
            return fract(sin(dot(vec2(100., 522.), uv)) * 51251.);
        }

        float mask(vec2 uv){
            uv -= .5;
            float d = length(uv - vec2(.45,0.2));
            return  1. / d;
        }

        void main(void) 
        {

            // voronoi
           vec2 uv = vUV;
            uv.x *= screenSize.x / screenSize.y;
            float m = mask(uv);
            uv *= 15.;

            vec2 i = floor(uv);
            vec2 f = fract(uv) - .5;

            float minDist = 1.1;
            for(float y = -1.; y <= 1.; y++){
                for(float x = -1.; x <= 1.; x++){
                    vec2 o = vec2(x,y);
                    vec2 rv = vec2(random(i + o), random( i+ o));
                    vec2 p = o + sin(rv * time + 0.5) * 0.5;

                    float d = length(f - p);
                    if(d < minDist){
                        minDist = d;
                    }
                }
            }

            vec3 vorCol  =  vec3(.6, 0.85, 1.75) *  minDist;

            // metaballs
            uv = vUV;
            uv -= .5;
            uv.y += .4;
            uv.x += .4;
            uv.x *= screenSize.x / screenSize.y;

            float r = .05;

          
            vec4 col = vec4(vorCol,1.);
            gl_FragColor = col * (1. - m * 0.5);
    
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
    $(canvas).css('position', 'absolute');
    $(canvas).css('background-color', 'black');

    return canvas;
}