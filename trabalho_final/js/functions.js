var clock, container, camera, scene, renderer, controls, listener;
var i;
var ground, character;
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var isLoaded = false;
var action = {}, mixer;

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
  scene.background = new THREE.Color(  0xffffff );

/*  textureLoader.load('texturas/ground.png', function (texture) {
    var geometry = new THREE.PlaneBufferGeometry(2, 2);
    geometry.rotateX(-Math.PI / 2);
    var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    ground = new THREE.Mesh(geometry, material);
    scene.add(ground);

  }); */
  loader.load('Stormtrooper.json', function (geometry, materials) {

    materials.forEach(function (material) {
      material.skinning = true;
    });
    character = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );

    // seta a posição inicial do personagem
    character.position.x = -2;
    character.position.y = -2;
    character.updateMatrix();

    mixer = new THREE.AnimationMixer(character);

    action.danca = mixer.clipAction(geometry.animations[ 2 ]);

    action.danca.setEffectiveWeight(1);

    action.danca.enabled = true;

    scene.add(character);

    window.addEventListener('resize', onWindowResize, false);
    animate();

    isLoaded = true;

    action.danca.play();
  });


  /*loader.load('yoda.json', function (geometry, materials) {
    materials.forEach(function (material) {
      material.skinning = true;
    });
    character = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );

    // seta a posição inicial do personagem
    character.position.x = -2;
    character.position.y = -2;
    character.updateMatrix();

    mixer = new THREE.AnimationMixer(character);


    action.dancayoda = mixer.clipAction(geometry.animations[ 2 ]);

    action.dancayoda.setEffectiveWeight(1);

    action.dancayoda.enabled = true;

    scene.add(character);

    window.addEventListener('resize', onWindowResize, false);
    animate();

    isLoaded = true;

    action.danca.play();
  });
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
  mixer.update(delta);
  renderer.render(scene, camera);
}
