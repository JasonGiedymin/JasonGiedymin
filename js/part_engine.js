

// TODO:
// + postprocessing
//
// What to simulate:
//	- svn commits
//	+ response time
//	+ source code analyzer 

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var clock = new THREE.Clock();
var ENGINE = {}

var MARGIN = 0;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], i, h, color;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var particleMap = {};

// effects
var composer, effectFXAA, hblur, vblur;
var bluriness = 2;
effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "fxaa" ] );
hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalTiltShift" ] );
vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalTiltShift" ] );
hblur.uniforms[ 'h' ].value = bluriness / (SCREEN_WIDTH );
vblur.uniforms[ 'v' ].value = bluriness / (SCREEN_HEIGHT);
hblur.uniforms[ 'r' ].value = vblur.uniforms[ 'r' ].value = .5;
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / SCREEN_WIDTH, 1 / SCREEN_HEIGHT );

renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
renderTarget = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters );

// [ [HSV_color], size]
var parameters = [ 
	[ [1.00, 1.0, 1.0], 5 ],
	[ [0.95, 1.0, 1.0], 4 ],
	[ [0.90, 1.0, 1.0], 3 ],
	[ [0.85, 1.0, 1.0], 2 ],
	[ [0.80, 1.0, 1.0], 1 ] ];

var attributes = {
	size: {	type: 'f', value: [] },
	customColor: { type: 'c', value: [] }
};

var uniforms = {
	amplitude: { type: "f", value: 1.0 },
	color:     { type: "c", value: new THREE.Color( 0xffffff ) }, //0x99FF00
	texture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "textures/sprites/spark1.png" ) },
};

var shaderMaterial = new THREE.ShaderMaterial( {
	uniforms: 		uniforms,
	attributes:     attributes,
	vertexShader:   document.getElementById( 'vertexshader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

	blending: 		THREE.AdditiveBlending,
	depthTest: 		false,
	transparent:	true
});

function getRandomColor(doHex) {
	if(null!=doHex && doHex) {
		var letter_space = '0123456789ABCDEF';
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * letter_space.length)];
	    }
	    return color;
	}
    return Math.round(0xffffff * Math.random());
}

function generateUniform() {
	return {
		amplitude: { type: "f", value: 1.0 },
		color:     { type: "c", value: new THREE.Color( getRandomColor() ) },
		texture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "textures/sprites/spark1.png" ) },
	};
};

function generateShader() {
	return new THREE.ShaderMaterial( {
		uniforms: 		generateUniform(),
		attributes:     attributes,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

		blending: 		THREE.AdditiveBlending,
		depthTest: 		false,
		transparent:	true
	});
};


function doit(_particles, attribs) {
	var vertices = _particles.geometry.vertices;
	var values_size = attribs.size.value;
	var values_color = attribs.customColor.value;

	for( var v = 0; v < vertices.length; v++ ) {
		values_size[ v ] = 10;
		values_color[ v ] = new THREE.Color( 0xffaa00 );

		if ( vertices[ v ].x < 0 )
			values_color[ v ].setHSV( 0.5 + 0.1 * ( v / vertices.length ), 0.7, 0.9 );
		else
			values_color[ v ].setHSV( 0.0 + 0.1 * ( v / vertices.length ), 0.9, 0.9 );

	}
}

function addParticles() {
	var new_geometry = new THREE.Geometry();

	for ( i = 0; i < 500; i ++ ) {

		var vertex = new THREE.Vector3();
		//vertex.x = Math.random() * 2000 - 1000;
		// vertex.y = Math.random() * 2000 - 1000;
		// vertex.z = Math.random() * 2000 - 1000;

		// Small Area
		//var distance = 520
		var distance = 1000
		vertex.x = Math.random() * 2000 - distance;
		vertex.y = Math.random() * 2000 - distance;
		vertex.z = Math.random() * 2000 - distance;
		
		//lazers, make sure particle rotation not set
		//vertex.x = Math.random() * 2000 - 500;
		//vertex.x = Math.random() * 2000 - 1000;
		//vertex.y = Math.random() * 1000 - 500;
		//vertex.z = Math.random() * 2000 - 5000;
		// var radius = 1;
		// vertex.multiplyScalar( radius );

		new_geometry.vertices.push( vertex );
	}

	// for ( i = 0; i < parameters.length; i ++ ) {

	// 	size  = parameters[i][1];
	// 	color = parameters[i][0];

	// 	// new material of size and HSV color
	// 	materials[i] = new THREE.ParticleBasicMaterial( { size: size } );
	// 	materials[i].color.setHSV( color[0], color[1], color[2] );

	// 	//particles = new THREE.ParticleSystem( new_geometry, materials[i] );
	// 	particles = new THREE.ParticleSystem( new_geometry, shaderMaterial );

	// 	particles.dynamic = true;

	// 	particles.rotation.x = Math.random() * 10;
	// 	particles.rotation.y = Math.random() * 10;
	// 	particles.rotation.z = Math.random() * 10;

	// 	doit(particles, attributes);

	// 	scene.add( particles );
	// }

	var new_particles = new THREE.ParticleSystem( new_geometry, generateShader() );
	new_particles.dynamic = true;
	new_particles.rotation.x = Math.random() * 10;
	new_particles.rotation.y = Math.random() * 10;
	new_particles.rotation.z = Math.random() * 10;
	doit(new_particles, attributes);
	scene.add( new_particles );
}

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	var old_density = 0.0007;
	scene.fog = new THREE.FogExp2( 0x000000, 0.0017 );

	camera = new THREE.PerspectiveCamera( 120, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000 );
	camera.position.z = 1000;
	scene.add( camera );

	geometry = new THREE.Geometry();

	for ( i = 0; i < 1000; i ++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 2000 - 1000;
		vertex.z = Math.random() * 2000 - 1000;
		// var radius = 1;
		// vertex.multiplyScalar( radius );

		geometry.vertices.push( vertex );

	}

	//parameters = [ [ 0xff0000, 5 ], [ 0xff3300, 4 ], [ 0xff6600, 3 ], [ 0xff9900, 2 ], [ 0xffaa00, 1 ] ];
	//parameters = [ [ 0xffffff, 5 ], [ 0xdddddd, 4 ], [ 0xaaaaaa, 3 ], [ 0x999999, 2 ], [ 0x777777, 1 ] ];

	// for ( i = 0; i < parameters.length; i ++ ) {
	// 	size  = parameters[i][1];
	// 	color = parameters[i][0];

	// 	// new material of size and HSV color
	// 	materials[i] = new THREE.ParticleBasicMaterial( { size: size } );
	// 	materials[i].color.setHSV( color[0], color[1], color[2] );

	// 	//particles = new THREE.ParticleSystem( geometry, materials[i] );
	// 	particles = new THREE.ParticleSystem( geometry, shaderMaterial );
	// 	particles.dynamic = true;

	// 	particles.rotation.x = Math.random() * 6;
	// 	particles.rotation.y = Math.random() * 6;
	// 	particles.rotation.z = Math.random() * 6;

	// 	doit(particles, attributes);

	// 	scene.add( particles );
	// }

	var new_particles = new THREE.ParticleSystem( geometry, generateShader() );
	new_particles.dynamic = true;
	new_particles.rotation.x = Math.random() * 6;
	new_particles.rotation.y = Math.random() * 6;
	new_particles.rotation.z = Math.random() * 6;
	doit(new_particles, attributes);

	scene.add( new_particles );

	renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1 } );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( renderer.domElement );

	// stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.top = '0px';
	// container.appendChild( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'click', onDocumentClick, false );


	var renderModel = new THREE.RenderPass( scene, camera );
	composer = new THREE.EffectComposer( renderer, renderTarget );
	vblur.renderToScreen = true;
	composer.addPass( renderModel );
	composer.addPass( effectFXAA );
	composer.addPass( hblur );
	composer.addPass( vblur );
}

function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}
}

function onDocumentClick( event ) {
	addParticles();
	console.log("Particles: " + getParticleCount());

	var particleIndex = Math.random(10) + 1;

	//camera.position.x = 1200;
	//camera.position.y = 1200;
	//camera.position.y = ( - mouseY - camera.position.y ) * 0.05;
}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	//stats.update();

}

function getParticleCount() {
	// Global three object count is: THREE.Object3DCount
	// console.log(THREE.Object3DCount);

	var particleCount = 0;
	for ( i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ];
		if ( object instanceof THREE.ParticleSystem ) {
			particleCount += object.geometry.vertices.length;
		}
	}
	return particleCount;
}

function render() {

	var attribSizeTime = Date.now() * 0.020;
	var time = Date.now() * 0.00005;
	var sizeShiftTime = Date.now() * 0.000005;

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	for ( i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ];
		if ( object instanceof THREE.ParticleSystem ) {
			//object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
			object.rotation.y = sizeShiftTime * ( i < 4 ? i + 1 : - ( i + 1 ) );
		}
	}

	// for ( i = 0; i < materials.length; i ++ ) {
	// 	color = parameters[i][0];

	// 	h = ( 360 * ( color[0] + time ) % 360 ) / 360;
	// 	materials[i].color.setHSV( h, color[1], color[2] );
	// }

	for( var i = 0; i < attributes.size.value.length; i++ ) {
		//attributes.size.value[ i ] = 14 + 13 * Math.sin( 0.1 * i + time );
		attributes.size.value[ i ] = 50 + 13 * Math.sin( 0.1 * i + attribSizeTime );
	}

	attributes.size.needsUpdate = true;

	var delta = clock.getDelta();
	//composer.render( delta );
	renderer.render( scene, camera );

}