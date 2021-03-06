
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


var FizzyText = function() {
    this.motorPhase = Math.PI / 150;
    this.crankLength = 0.7;
    this.bdLength = 1.5;
    this.cdLength = 1.4;
    this.angle = Math.PI / 3.0;
    this.length = 0.7;
};


var text = new FizzyText();

window.onload = function() {
    var gui = new dat.GUI();
    gui.add(text, 'motorPhase', 0.0, Math.PI / 10.0);
    gui.add(text, 'crankLength', 0.001, 5.0);
    gui.add(text, 'bdLength', 0.001, 5.0);
    gui.add(text, 'cdLength', 0.001, 5.0);
    gui.add(text, 'angle', 0.000, Math.PI / 2.0);
    gui.add(text, 'length', 0.000, 5);
};


var container;

var camera, cameraTarget, scene, renderer, controls;

var theta_2, phase_inc;
var lineGeom, lineMat, stockLines, couplerLine, couplerCurveLines;

init();
animate();

function init() {
    theta_2 = 0;
    //phase_inc = Math.PI / 150;

    lineGeom = new THREE.Geometry();
    couplerGeom = new THREE.Geometry();
    couplerCurveGeom = new THREE.Geometry();

    lineMat = new THREE.LineBasicMaterial({
	color: 0x000000
    });    

    couplerCurveMat = new THREE.LineBasicMaterial({
	color: 0xff00ff
    });    
    
    stockLines = new THREE.Line( lineGeom, lineMat );
    couplerLines = new THREE.Line( couplerGeom, lineMat );
    couplerCurveLines = new THREE.Line( couplerCurveGeom, couplerCurveMat );
    
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
    camera.position.set( 0, 0, 6 );

    scene = new THREE.Scene();

    scene.add(stockLines);
    scene.add(couplerLines);
    scene.add(couplerCurveLines);
    
    var fog_color = 0xfefefe;

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

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
    
}

function animate() {

    requestAnimationFrame( animate );

    addLine(scene, theta_2);
    theta_2 = theta_2 + text.motorPhase; //phase_inc;
    if (theta_2 > 2*Math.PI) {
	theta_2 = theta_2 - 2*Math.PI;
    }

    render();

}

function render() {

    renderer.render( scene, camera );

}

function addLine(sc, th) {

    var quad =
	new Quadrilateral(new THREE.Vector3(0, 0, 0),
			  new THREE.Vector3(1.0, 0, 0),
			  text.crankLength,
			  text.bdLength,
			  text.cdLength
			 );

    if (!isGreshof( quad ) ) {
	alert('Non greshof linkage!');
    }

    var fbl = new FourbarLinkage(quad, text.length, text.angle); //0.7, Math.PI / 3.0);
    
    var a = fbl.aPos();
    var b = fbl.bPos();

    var cde = fbl.solveCDEPos(th);
    var c = cde[0];
    var d = cde[1];
    var e = cde[2];


    //Initial curve
    if (couplerCurveLines.geometry.vertices.length == 0) {
	var tht = 0.0;
	var tht_inc = Math.PI / 30.0;
	while (tht < 2*Math.PI) {
    	    couplerCurveLines.geometry.vertices.push( fbl.solveCDEPos(tht)[2] );
    	    tht += tht_inc;
	}
    } else {
	var tht = 0.0;
	var tht_inc = Math.PI / 30.0;
	var i = 0;
	while (tht < 2*Math.PI) {
    	    couplerCurveLines.geometry.vertices[i] = fbl.solveCDEPos(tht)[2];
    	    tht += tht_inc;
	    i++;
	}
    }
    couplerCurveLines.geometry.verticesNeedUpdate = true;
    
    if (stockLines.geometry.vertices.length == 0) {
	stockLines.geometry.vertices.push(b, a, c, d, b);
    } else {
	stockLines.geometry.vertices[2] = c;
	stockLines.geometry.vertices[3] = d;
    }
    stockLines.geometry.verticesNeedUpdate = true;

    if (couplerLines.geometry.vertices.length == 0) {
	couplerLines.geometry.vertices.push(c, e);
    } else {
	couplerLines.geometry.vertices[0] = c;
	couplerLines.geometry.vertices[1] = e;
    }
    couplerLines.geometry.verticesNeedUpdate = true;

}
