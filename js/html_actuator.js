function HTMLActuator(images) {
  var self=this;

  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.Image=[];
  this.ImageSrc=[];
  this.score = 0;

  if(!!images[3].response ){
  	var i=0;
	while(!!images[3].response[++i])
	{
		if(!!images[3].response[i].src_big) this.ImageSrc.push(images[3].response[i].src_big);
	}
  }

  if(!!images[1].photos ){
  	var i=0;
	while(!!images[1].photos.photo[i++] && i<=2)
	{
		this.ImageSrc.push(src = "http://farm"+ images[1].photos.photo[i-1].farm +".static.flickr.com/"+ images[1].photos.photo[i-1].server +"/"+ images[1].photos.photo[i-1].id +"_"+ images[1].photos.photo[i-1].secret +"_m.jpg");
	}
  }

  if(!!images[0].data ){
  	var i=0;
	while(!!images[0].data[i++])
	{
		this.ImageSrc.push(images[0].data[i-1].images.original.url);
	}
  }

  if(!!images[2].query) {
	var i=0;
	while(!!images[2].query.allimages[i++]){
		this.ImageSrc.push(images[2].query.allimages[i-1].url)
	}
  }
  
  for(X=2; X<=16; X<<=1){
	if(!self.Image[X]) {
	var i=-1;
	while(self.ImageSrc[++i]==null);
	self.Image[X]=document.createElement("style");
	self.Image[X].innerHTML=
		".tile-class"+X +
		" { background: url('"+self.ImageSrc[i]+"') ! important;"+
		"background-size: auto 100%  ! important; "+
		"background-position: center center ! important;"+
		"background-repeat: no-repeat ! important; }";
	self.ImageSrc[i]=null;
	document.body.appendChild(self.Image[X]);

	var buffer=document.createElement("div");
	buffer.height=0;
	buffer.width=0;
	buffer.classList.add("tile-class"+ X);
	document.body.appendChild(buffer);
	}
  }
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  if(!self.Image[tile.value]) {
	var i=-1;
	while(self.ImageSrc[++i]==null);
	self.Image[tile.value]=document.createElement("style");
	self.Image[tile.value].innerHTML=
		".tile-class"+ (tile.value) +
		" { background: url('"+self.ImageSrc[i]+"') ! important;"+
		"background-size: auto 100%  ! important; "+
		"background-position: center center ! important;"+
		"background-repeat: no-repeat ! important; }";
	self.ImageSrc[i]=null;
	document.body.appendChild(self.Image[tile.value]);

	var buffer=document.createElement("div");
	buffer.height=0;
	buffer.width=0;
	buffer.classList.add("tile-class"+ (tile.value));
	document.body.appendChild(buffer);
  }
  
  if(!self.Image[tile.value<<1]) {
	var i=-1;
	while(self.ImageSrc[++i]==null);
	self.Image[tile.value<<1]=document.createElement("style");
	self.Image[tile.value<<1].innerHTML=
		".tile-class"+ (tile.value<<1) +
		" { background: url('"+self.ImageSrc[i]+"') ! important;"+
		"background-size: auto 100%  ! important; "+
		"background-position: center center ! important;"+
		"background-repeat: no-repeat ! important; }";
	self.ImageSrc[i]=null;
	document.body.appendChild(self.Image[tile.value<<1]);

	var buffer=document.createElement("div");
	buffer.height=0;
	buffer.width=0;
	buffer.classList.add("tile-class"+ (tile.value<<1));
	document.body.appendChild(buffer);
  }

  inner.classList.add("tile-inner");
  inner.classList.add("tile-class"+tile.value);

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
