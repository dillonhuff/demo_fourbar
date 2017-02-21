
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

// NOTE: cameraTarget will not be needed once trackball controls are used
var camera, cameraTarget, scene, renderer, controls;

var theta_2, phase_inc;

init();
animate();

function init() {
    theta_2 = 0;
    phase_inc = Math.PI / 30;

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
    camera.position.set( 0, 0, 3 );

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.0;
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );

    scene = new THREE.Scene();

    var fog_color = 0xfefefe;


    // Lights

    scene.add( new THREE.HemisphereLight( 0x000000, 0xdddddd ) );

    addShadowedLight( 10, 10, 10, 0xffffff, 1.35 );
    addShadowedLight( 5, 10, -10, 0xffffff);

    // Line
    addLine(scene, theta_2);

    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( fog_color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = false;

    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function addShadowedLight( x, y, z, color, intensity ) {

    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    var d = 1;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.bias = -0.005;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
    render();
    
}

function animate() {

    requestAnimationFrame( animate );

    render();
    controls.update();

}

function render() {

    // var timer = Date.now() * 0.0005;

    // camera.position.x = Math.cos( timer ) * 3;
    // camera.position.z = Math.sin( timer ) * 3;

    // camera.lookAt( cameraTarget );

    renderer.render( scene, camera );

}

function addLine(sc, th) {
    var a = new THREE.Vector3(0, 0, 0);
    var b = new THREE.Vector3(Math.sin(th), Math.cos(th), 0);

    var lineMat = new THREE.LineBasicMaterial({
	color: 0x000000
    });    

    var lineGeom = new THREE.Geometry();
    lineGeom.vertices.push(a, b);

    var stockLines = new THREE.Line( lineGeom, lineMat );
    sc.add(stockLines);

    var bb = new THREE.Box3();
    bb.setFromObject( stockLines );
    bb.center(controls.target);

}
