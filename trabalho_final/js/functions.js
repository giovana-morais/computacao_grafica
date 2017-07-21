var clock, container, camera,camera_2, scene, renderer, controls, listener;
var id, i=0;
var ground, storminho, yoda, cloneyoda, cloneyoda2, cloneyoda3;
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var keyboard = new THREEx.KeyboardState();
var isLoaded = false;
var action = {}, mixer_storminho, mixer_yoda, mixer_clone, mixer_clone2, mixer_clone3;

// arrumar os nomes qnd der certo
var arrAnimations = [
  'danca',
  'dancayoda'
];
var actualAnimation = 0;

init();

function init () {
  if(!Detector.webgl){
    Detector.addGetWebGLMessage();
  }
  clock = new THREE.Clock();

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 10);
  listener = new THREE.AudioListener();
  camera.add(listener);

  camera_2 = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera_2.position.set(0, 2, 6);
  listener2 = new THREE.AudioListener();
  camera.add(listener2);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0.6, 0);
  // Lights
  light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0.25, 100, -0.2);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);

    /* plano de fundo
     * OBS: com certeza deve ter um jeito mais simples de fazer isso usando só
     * um plano, mas não sou capaz de pensar no momento, então vai ser usando
     * esse baita cubo mesmo.
     */
    var urls = [
        "texturas/background1.png",
        "texturas/background1.png",
        "texturas/background1.png",
        "texturas/background1.png",
        "texturas/background1.png",
        "texturas/background1.png",
    ];

    scene.background = new THREE.CubeTextureLoader().load(urls);

    /* chão */
    ground_textura = THREE.ImageUtils.loadTexture('texturas/ground.png');
    ground_textura.wrapS = THREE.RepeatWrapping;
    ground_textura.wrapT = THREE.RepeatWrapping;
    ground_textura.repeat.x = 256;
    ground_textura.repeat.y = 256;

    var ground_material = new THREE.MeshBasicMaterial({map: ground_textura, transparent: true});

    var ground_geometria = new THREE.PlaneGeometry(400, 400);

    ground = new THREE.Mesh(ground_geometria, ground_material);
    ground.position.y = -1;
    ground.rotation.x = -Math.PI/2;
    ground.doubleSided = true;
    scene.add(ground);


    // o r2 tem que aparecer sozinho e depois os outros têm que aparecer
/*    loader.load('r2.json', function(geometry, materials){
        materials.forEach(function (material){
            material.skinning = true;
        });

        r2 = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
        mixer_r2 = new THREE.AnimationMixer(r2);
        action.movimento = mixer_r2.clipAction(geometry.animations[0]);
        action.movimento.clampWhenFinished = true;
        action.movimento.play();
        mixer_r2.addEventListener('finished', function(e){
            console.log("acabou, yesssss! agora temos que mudar de cena");
//        animate();
//       isLoaded = true;
        });
        window.addEventListener('resize', onWindowResize, false);
        scene.add(r2);
    }); */


  loader.load('Stormtrooper.json', function (geometry, materials) {

    materials.forEach(function (material) {
      material.skinning = true;
    });
    storminho = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );

    storminho.position.x = 0;
    storminho.position.y = 0;
    storminho.updateMatrix();

    mixer_storminho = new THREE.AnimationMixer(storminho);
    action.danca = mixer_storminho.clipAction(geometry.animations[ 2 ]);
    action.danca.setEffectiveWeight(1);
    action.danca.enabled = true;
    scene.add(storminho);

    window.addEventListener('resize', onWindowResize, false);
     window.addEventListener('click', onDoubleClick, false);
    animate();

    isLoaded = true;
    action.danca.play();
  });


  loader.load('yoda.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    yoda = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );

    yoda.position.x = -4;
    yoda.position.y = -0.5;
    yoda.updateMatrix();

    mixer_yoda = new THREE.AnimationMixer(yoda);

    action.dancayoda = mixer_yoda.clipAction(geometry.animations[ 0 ]);
    action.dancayoda.setEffectiveWeight(1);
    action.dancayoda.enabled = true;
        scene.add(yoda);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onDoubleClick, false);
    animate();

    isLoaded = true;
    action.dancayoda.play();

  });


  loader.load('yoda.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    cloneyoda = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );

    cloneyoda.position.x = 4;
    cloneyoda.position.y = -0.5;
    cloneyoda.updateMatrix();

    mixer_clone = new THREE.AnimationMixer(cloneyoda);

    action.dancayoda = mixer_clone.clipAction(geometry.animations[ 0 ]);
    action.dancayoda.setEffectiveWeight(1);
    action.dancayoda.enabled = true;
        scene.add(cloneyoda);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onDoubleClick, false);
    animate();

    isLoaded = true;
    action.dancayoda.play();

  });

  loader.load('yoda.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    cloneyoda2 = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );

    cloneyoda2.position.x = 2;
    cloneyoda2.position.y = -0.5;
    cloneyoda2.position.z = -2;
    cloneyoda.updateMatrix();

    mixer_clone2 = new THREE.AnimationMixer(cloneyoda2);

    action.dancayoda = mixer_clone2.clipAction(geometry.animations[ 0 ]);
    action.dancayoda.setEffectiveWeight(1);
    action.dancayoda.enabled = true;
        scene.add(cloneyoda2);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onDoubleClick, false);
    animate();

    isLoaded = true;
    action.dancayoda.play();

  });
  loader.load('yoda.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    cloneyoda3 = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );

    cloneyoda3.position.x = -2;
    cloneyoda3.position.y = -0.5;
    cloneyoda3.position.z = -2;
    cloneyoda.updateMatrix();

    mixer_clone3 = new THREE.AnimationMixer(cloneyoda3);

    action.dancayoda = mixer_clone3.clipAction(geometry.animations[ 0 ]);
    action.dancayoda.setEffectiveWeight(1);
    action.dancayoda.enabled = true;
        scene.add(cloneyoda3);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onDoubleClick, false);
    animate();

    isLoaded = true;
    action.dancayoda.play();

  });

// Tentativa de colocar um outro obj na cena
/*  var objLoader = new THREE.OBJLoader();
  objLoader.setPath('imgs/JAWA/');
  objLoader.load('Star_wars_JAWA.obj',function (object){
    object.position.x = 4;
    object.position.y = -0.5;
    //object.position.z = 0;

    scene.add(object);
    });


  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath('imgs/JAWA/');
  mtlLoader.setPath('imgs/JAWA/');
  mtlLoader.load('Star_wars_JAWA.mtl', function (materials) {
    materials.preload();
    objLoader.setMaterials(materials);
  }); */
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDoubleClick(){
  cancelAnimationFrame( id );
}

function animate () {
  id = requestAnimationFrame(animate);
  controls.update();
  render();

}

// Pode mover um de cada vez ou combinação de até 3 teclas (mais que isso não consegui combinar)

function render () {
    var delta = clock.getDelta();
    var cam;
    if(keyboard.pressed("c")) {
      cam = camera_2;
    }
    else {
      cam = camera;
    }

    // Pressionar 1 pra animação principal aka storminho
    if(keyboard.pressed("1")) {
      renderer.render(scene, cam);
        mixer_storminho.update(delta);
    }

    // Como mexer nos yodinhas : da esquerda pra direita A,Q,W,S;
    //ou seja, os dois mais pra cima são Q e W e os de baixo A e S

    if(keyboard.pressed("a")) {
      renderer.render(scene, cam);
        mixer_yoda.update(delta);
    }
    if(keyboard.pressed("q")) {
      renderer.render(scene, cam);
        mixer_clone3.update(delta);
    }
    if(keyboard.pressed("w")) {
      renderer.render(scene, cam);
        mixer_clone2.update(delta);
    }
    if(keyboard.pressed("s")) {
      renderer.render(scene, cam);
        mixer_clone.update(delta);
    }

    renderer.render(scene, cam);
}
