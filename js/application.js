// Wait till the browser is ready to render the game (avoids glitches)
var img=[];

function jsonGiphyApi()
{
	var self=this;
	if(this.readyState==4 && this.status==200) {
		img[0]=JSON.parse(self.responseText);
	}
	if(!!img[0]&&!!img[1]&&!!img[2]) start();
}

function jsonFlickrApi(images)
{
	img[1]=images;
	if(!!img[0]&&!!img[1]&&!!img[2]) start();
}

function RandomImages(images)
{
	img[2]=images;
	if(!!img[0]&&!!img[1]&&!!img[2]) start();
}

function start()
{
	window.requestAnimationFrame(function () {
		new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, img);
	});
}

var str=encodeURIComponent(prompt("Enter something"));

var imgsrc=document.createElement("script");
imgsrc.src="http://commons.wikimedia.org/w/api.php?action=query&format=json&list=allimages&aiprop=url&aifrom="+str+"&ailimit=50&callback=RandomImages";
document.body.appendChild(imgsrc);

imgsrc=document.createElement("script");
imgsrc.src="https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=287810755d780a427e5babb046a4c2a9&tags="+str+"&format=json";
document.body.appendChild(imgsrc);

var invocation = new XMLHttpRequest();
var url = "http://api.giphy.com/v1/gifs/search?q="+str+"&api_key=dc6zaTOxFJmzC";
invocation.open('GET', url, true);
invocation.onreadystatechange = jsonGiphyApi;
invocation.send(); 

