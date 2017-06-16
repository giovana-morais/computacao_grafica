var container;
var scene, camera_1, camera_2, controls, renderer;
var group = new THREE.Group();
var ambient;
var keyboard = new THREEx.KeyboardState();
var theta = 0, radius = 70;

function init(){
	container = document.createElement('div');
	document.body.appendChild(container);

    scene = new THREE.Scene();

    camera_1 = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
	group.add(camera_1);
	camera_1.position.set(100, 0, 100);
	camera_1.lookAt(scene.position);

	camera_2 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
	group.add(camera_2);
	camera_2.position.set(-10, 15, 10);
	camera_2.lookAt(scene.position);

	camera_3 = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
	group.add(camera_3);


	ambient = new THREE.AmbientLight(0xffffff, 1.0);
	group.add(ambient);

	keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
	keyLight.position.set(-100, 0, 100);
	fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
	fillLight.position.set(100, 0, 100);
	backLight = new THREE.DirectionalLight(0xffffff, 1.0);
	backLight.position.set(100, 0, -100).normalize();

    var obj_pos;
    var objLoader = new THREE.OBJLoader();
	objLoader.setPath('imgs/Robot/');
	objLoader.load('robot.obj',function (object){
		object.position.x = 0;
		object.position.y = 0;
		//object.position.z = 0;
		//obj_pos = objLoader.parse(text);						
		//console.log("object ", typeof(object))
		group.add(object);
		});
	console.log("objLoader ", typeof(objLoader));
	//console.log("oi", obj_pos);
	
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setTexturePath('imgs/Robot/');
	mtlLoader.setPath('imgs/Robot/');
	mtlLoader.load('robot.mtl', function (materials) {
		materials.preload();
		objLoader.setMaterials(materials);
	});


	inserePlano(10, 10);
	criaCurva();

	// TODO: inserir qualquer outro objeto que não seja nativo do three.js pra testar o posicionamento
	//insereCubo(5, 0, 0);
	//insereCubo(0, 4, 0);
	//insereEsfera(-5, 0, 0);
	scene.add(group);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

	container.appendChild(renderer.domElement);

	control_1 = new THREE.OrbitControls(camera_1, renderer.domElement);
	control_1.enableDamping = true;
	control_1.dampingFactor = 0.25;
	control_1.enableZoom = false;

	control_2 = new THREE.OrbitControls(camera_2, renderer.domElement);
	control_2.enableDamping = true;
	control_2.dampingFactor = 0.25;
	control_2.enableZoom = false;
	renderer.render(scene, camera_1);

    }

function animate(){
	requestAnimationFrame(animate);
	render();
	// TWEEN.update();
}


function move(object){
	object.translateX(3);
}

function insereCubo(x,y,z){
	var geom_cubo = new THREE.BoxBufferGeometry(1, 1, 1);
	var mat_cubo = new THREE.MeshNormalMaterial();
	var cubo = new THREE.Mesh(geom_cubo, mat_cubo);
	cubo.position.set(x, y, z);
	group.add(cubo);
}

// TODO: esssa esfera nem é uma esfera. tentar consertar
function insereEsfera(x,y,z){
	var geom_esf = new THREE.SphereGeometry(1, 1, 1);
	var mat_esf = new THREE.MeshNormalMaterial();
	var esf = new THREE.Mesh(geom_esf, mat_esf);
	esf.position.set(x, y, z);
	group.add(esf);
}

function inserePlano(x, y){
	var geom_plano = new THREE.PlaneBufferGeometry(x, y);
	var mat_plano = new THREE.MeshNormalMaterial();
	var plano = new THREE.Mesh(geom_plano, mat_plano);
	plano.position.set(0, -3, 0);
	plano.rotation.x = 1.5;
	group.add(plano);
}

// curva quadrática de bezier
// TODO: tentar inserir depois a curva cúbica
function criaCurva(){
	var curva = new THREE.QuadraticBezierCurve(
		new THREE.Vector2( -10, 0 ),
		new THREE.Vector2( 20, 15 ),
		new THREE.Vector2( 10, 0 )
	);

	var path = new THREE.Path( curva.getPoints( 50 ) );

	var geometry = path.createPointsGeometry( 50 );
	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

	var curveObject = new THREE.Line( geometry, material );

	group.add(curveObject);
}

function render(){
	control_1.update();
	control_2.update();
	if(keyboard.pressed("1")){
		renderer.render(scene, camera_1);
		control_1.update();
	}
	if(keyboard.pressed("2")) {
		renderer.render(scene, camera_2);
		control_2.update();
	}

	theta += 1;
  	camera_1.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
  	camera_1.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera_1.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera_1.lookAt( scene.position );
}

