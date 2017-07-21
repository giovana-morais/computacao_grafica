var clock, container, camera, scene, renderer, controls, listener;
var i;
var ground, storminho, yoda;
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var isLoaded = false;
var action = {}, mixer_storminho, mixer_yoda;

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
  camera.position.set(0, 2, 8);
  listener = new THREE.AudioListener();
  camera.add(listener);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0.6, 0);
  // Lights
  light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

    /* plano de fundo 
     * OBS: com certeza deve ter um jeito mais simples de fazer isso usando só
     * um plano, mas não sou capaz de pensar no momento, então vai ser usando
     * esse baita cubo mesmo.
     */
    
    // obs2: vamos ter que mudar a imagem pq ela precisa ser quadrada. mas isso
    // eu faço quando eu acordar
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
    loader.load('r2.json', function(geometry, materials){
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
    });
        

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
    //scene.add(storminho);

    window.addEventListener('resize', onWindowResize, false);
    animate();

    isLoaded = true;
  //  action.danca.play();
  });

/*
    adicionaYoda(-4, -0.5);
    adicionaYoda(4, 0,5);

    // aqui temos que dar um jeito de retornar o mixer_yoda. talvez colocar um
    // retorno na função? sei lá. 
    action.dancayoda = mixer_yoda.clipAction(geometry.animations[ 0 ]);
    action.dancayoda.setEffectiveWeight(1);
    action.dancayoda.enabled = true;

    window.addeventlistener('resize', onwindowresize, false);
    animate();

    isLoaded = true;
//    action.dancayoda.play();

*/
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate () {
  requestAnimationFrame(animate);
  controls.update();
  render();

}

function render () {
    var delta = clock.getDelta();
//  mixer_storminho.update(delta);
//  mixer_yoda.update(delta);
//    mixer_r2.update(delta);
    renderer.render(scene, camera);
}
/*
function adicionaYoda(x, y){
    // TODO: adicionar aqui o negócio do animation group lá pra gente conseguir
    // fazer eles fazerem todos a mesma dancinha
  loader.load('yoda.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    yoda = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );

    yoda.position.x = x; 
    yoda.position.y = y;
    yoda.updateMatrix();

    mixer_yoda = new THREE.AnimationMixer(yoda);

    //scene.add(yoda);
  });
}

*/
