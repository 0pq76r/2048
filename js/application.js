// Wait till the browser is ready to render the game (avoids glitches)

function RandomImages(images)
{
	window.requestAnimationFrame(function () {
		new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, images);
	});
}

var imgsrc=document.createElement("script");
imgsrc.src="http://commons.wikimedia.org/w/api.php?action=query&format=json&list=allimages&aiprop=url&aifrom="+encodeURIComponent(prompt("Enter something"))+"&ailimit=50&callback=RandomImages"
document.body.appendChild(imgsrc);


