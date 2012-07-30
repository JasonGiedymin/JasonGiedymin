function createWorld() {
	init();
	animate();

	for(var i=0; i<9; i++) {
		setTimeout(addParticles, i*250);
	}
}

function clearWorld() {
	console.log("Clearing")
	window.location.reload(); // cheap
}

function moveBackAvatar() {
	move('#avatar')
  	.set('opacity', 0)
  	.x(0)
  	.then()
  		.duration('1s')
  		//.set('background-color', 'white')
  		.pop()
  	.end();
 }

function moveAvatar() {
	var currAvatar = ENGINE.getNextAvatar();

	$('#avatar-img').attr('src', 'img/' + currAvatar[1]);

	move('#avatar')
		.set('opacity', 1)
		.set('background-color', getRandomColor(true))
		.set('-webkit-box-shadow', '0px 5px 25px -5px rgba(100, 100, 100, 1)')
		//.set('background', ENGINE.asUrl(currAvatar[1]) + ' no-repeat top center' )
		.x(-300)
		//.delay('1s')
		//.end(moveBack);
		.end()

	move('#snippet')
		.set('opacity', 1)
		//.set('background-color', 'red')
		.x(1000)
		//.delay('1s')
		//.end(moveBack);
		.end()

	$('#snippet').text(currAvatar[0]);

	setTimeout(moveBackAvatar, 3000);
	setTimeout(moveAwaySnippet, 3000);	
}

function moveBackSnippet() {
	move('#snippet')
  	.x(0)
  	.then()
  		.duration('1s')
  		//.set('background-color', 'white')
  		.pop()
  	.end();
 }

 function moveAwaySnippet() {
	move('#snippet')
  	.set('opacity', 0)
  	.x(1200)
  	.then()
  		.duration('1s')
  		//.set('background-color', 'white')
  		.pop()
  	.end();
  	setTimeout(moveBackSnippet, 750);
 }

function moveSnippet() {
	
}

function fillScreen() {
	move('#banner-title')
		.set('opacity', 1)
		//.duration('1s')
		.end();

	if ($('#coder').text() != 'Software Engineer')
		$('#coder').text('Software Engineer');
	else
		$('#coder').html('<a href="http://paulgraham.com/gba.html" target="_blank">Hacker</a>');
}

function clearBanner() {
	move('#banner-title')
		.set('opacity', 0)
		//.duration('1s')
		.end();

	setTimeout(fillScreen, 1250);
}

function cameraTrack() {
	var track2 = Math.floor(Math.random() * 1000) - 1000;
	//console.log(track2);

	var time = Date.now() ;
	var track = Math.sin(time) * 1100
	console.log(track)
	//camera.position.x = track;
	camera.position.x += ( track - camera.position.x );
	camera.position.y += ( - track - camera.position.y );
}

function cameraBurst() {
	//var track = Math.floor(Math.random() * 1000) - 1000;
	//console.log(track);
	track = 100000;
	camera.position.x += ( track - camera.position.x ) * 0.05;
	camera.position.y += ( - track - camera.position.y ) * 0.05;
}

function addLotsOfParticles() { 
	addParticles();
	var particles = getParticleCount();
	if (particles % 25000 === 0) {
		console.log("Particles: " + particles);
	}
}
//setInterval(addLotsOfParticles, 10);

setTimeout(createWorld, 100);
setInterval(moveAvatar, 5000)
//setInterval(moveSnippet, 5000)
setInterval(clearBanner, 12500)
//setInterval(cameraTrack, 12500) Good for display
setInterval(cameraTrack, 8500)
setInterval(cameraBurst, (1.5*60)*1000)
setTimeout(clearWorld, (10*60)*1000);