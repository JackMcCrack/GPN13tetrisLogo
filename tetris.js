var canvas, ctx;
var blocksize = 14;
var bordersize = 2;
var backgroundColor = "black";
var fieldWidth = 80;
var fieldHeight = 15;

var pieces = [
	[[0,0], [0,1], [1,0], [1,1]], // O

	[[-1,0], [0,0], [1,0], [-1,1]], // L
	[[-1,0], [0,0], [1,0], [1,1]], // J
	
	[[-1,0], [0,0], [1,0], [0,1]], // T
	[[-1,0], [0,0], [1,0], [2,0]], // I
	
	[[-1,0], [0,0], [0,1], [1,1]], // Z
	[[-1,1], [0,1], [0,0], [1,0]], // S

];
// O,L,J,T,I,Z,S
var col = [ "o", "l", "j", "t", "i", "z", "s" ];
var sources = {
	o:   "/img/Tetris_o_block14x14.png",
	l:   "/img/Tetris_l_block14x14.png",
	j:   "/img/Tetris_j_block14x14.png",
	t:   "/img/Tetris_t_block14x14.png",
	i:   "/img/Tetris_i_block14x14.png",
	z:   "/img/Tetris_z_block14x14.png",
	s:   "/img/Tetris_s_block14x14.png"
};
var images = {};

var tick = 0;
var updater;
var field;

var currentPiece, cr, cx, cy;

var xbase = 0;

var pieceCtr;
var offsetCtr;
var cmdCtr;
var cmd;
var newPieces;
var letterOffset;


function reset() {
	field = new Array(fieldWidth);
	for(var i = 0; i < fieldWidth; i++)
		field[i] = new Array(fieldHeight);

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	cmd = [
	    [0,0],[3,0],[-1,3],[0,1],[3,0],[1,0], // G
	    [0,0],[2,0],[1,0],[2,1],[0,3],[5,1],[4,1], // P
	    [0,1],[4,1],[2,0],[1,1],[-1,1],[-1,0],[4,1], // N
	    [0,0],[0,0],[0,0],[0,2], // 1
	    [0,0],[-1,0],[2,0],[0,0],[2,0],[1,0],[-1,0] // 3

	    //[0, 0], [2, 0], [-2, 3], [2,0], [2,0], [-1,1], [-2,3] // U
	];
	newPieces = [
		5,6,1,1,2,4, -1,
		0,4,1,5,2,2,1,-1,
		2,3,5,5,4,0,4,-1,
		4,0,0,1,-1,
		4,4,0,4,0,6,6
		//4, 0, 1, 0, 0, 4, 2
	];
	letterOffset = [
		6, 8, 7, 6, 8
	];
	pieceCtr = 1;
	offsetCtr = 0;
	cmdCtr = 0;
	xbase = 0;
	tick = 0;
	currentPiece = newPieces[0];
	cx = 10;
	cy = 0;
	cr = 0;

	updater = setInterval(update, 8);
}

$(function() {
	canvas = $("#tetris").get(0);
	ctx = canvas.getContext("2d");
	
	loadImages(sources, function(images){});
	reset();
});

function getAction(tick) {
	if(tick % 8 == 0) {
		if(cmd[cmdCtr][0] - 3) {
			var off = (cmd[cmdCtr][0] - 3 > 0) ? 1 : -1;
			cmd[cmdCtr][0] -= off;
			return [0, off, 0];
		} else if(cmd[cmdCtr][1]) {
			cmd[cmdCtr][1]--;
			return [0,0,1];
		} else 
			return [0,0,0];
	} else
		return [0,0,0];
}

function newPiece() {
	currentPiece = newPieces[pieceCtr++];

	if(currentPiece == -1) {
		currentPiece = newPieces[pieceCtr++];
		xbase += letterOffset[offsetCtr++];
	}

	cx = xbase + 10;
	cy = 0;
	cr = 0;

	if(cmd.length > 1 + cmdCtr)
		cmdCtr++;
	else {
		clearInterval(updater);
		setTimeout(reset, 30000);
	}
}

function update() {
	var action = getAction(tick);

	if(action[0] == 0) {
		clearPiece(cx, cy, currentPiece, cr);
		if(!collides(cx + action[1], cy, currentPiece, cr + action[2])) {
			cx += action[1];
			cr += action[2];
		}
	} else if(action[0] == 1) {
		currentPiece = action[1];
		cx = action[2];
		cy = 0;
		cr = 0;
	} else if(action[0] == 2) {
		clearInterval(updater);
	}

	var collision = 0;
	if(collides(cx, cy+1, currentPiece, cr)) {
		collision = 1;
	} else {
		if(tick % 10 == 0)
			cy++;
	}

	drawPiece(cx, cy, currentPiece, cr);

	tick++;
	if(collision) {
		newPiece();
	}
}

function drawBlock(x, y, c) {
	//var o, l, j, t, i, z, s;
	if(c == backgroundColor) {
		field[x][y] = 0;
		ctx.fillStyle = c;
		ctx.fillRect(x * (blocksize + bordersize),
			     y * (blocksize + bordersize),
			     blocksize, blocksize);
	}
	else {
//var o, l, j, t, i, z, s;
		field[x][y] = 1;
		switch (c)
		{
		case "o":
			ctx.drawImage(images.o, x * (blocksize + bordersize), y * (blocksize + bordersize));
			break;
		case "l":
			ctx.drawImage(images.l, x * (blocksize + bordersize), y * (blocksize + bordersize));
			break;
		case "j":
			ctx.drawImage(images.j, x * (blocksize + bordersize), y * (blocksize + bordersize));
			break;
		case "t":
			ctx.drawImage(images.t, x * (blocksize + bordersize), y * (blocksize + bordersize));
			break;
		case "i":
			ctx.drawImage(images.i, x * (blocksize + bordersize), y * (blocksize + bordersize));
			break;
		case "z":
			ctx.drawImage(images.z, x * (blocksize + bordersize), y * (blocksize + bordersize));
			break;
		case "s":
			ctx.drawImage(images.s, x * (blocksize + bordersize), y * (blocksize + bordersize));
			break;
		}
	}	
}

function collides(x, y, p, r) {
	var piece = pieces[p];

	var f = new Array(4);

	r = r % 4;

	if(p == 4) { // I
		r = r % 2;
	}

	if(p == 0) { // O
		r = 0;
	}

	f[0] = Math.cos(Math.PI/2.0*r);
	f[1] = -Math.sin(Math.PI/2.0*r);
	f[2] = Math.sin(Math.PI/2.0*r);
	f[3] = Math.cos(Math.PI/2.0*r);

	var coll = 0;
	piece.forEach(function(val, idx) {
			var myX, myY;

			myX = x + f[0] * val[0] + f[1] * val[1];
			myY = y + f[2] * val[0] + f[3] * val[1];

			if(myY >= fieldHeight)
				coll = 1;

			if(field[myX][myY] == 1)
				coll = 1;
			});

	return coll;
}

function _drawPiece(x, y, p, r, c) {
	var piece = pieces[p];

	var f = new Array(4);

	r = r % 4;

	if(p == 4) { // I
		r = r % 2;
	}

	if(p == 0) { // O
		r = 0;
	}

	f[0] = Math.cos(Math.PI/2.0*r);
	f[1] = -Math.sin(Math.PI/2.0*r);
	f[2] = Math.sin(Math.PI/2.0*r);
	f[3] = Math.cos(Math.PI/2.0*r);

	piece.forEach(function(val, idx) {
			var myX, myY;

			myX = x + f[0] * val[0] + f[1] * val[1];
			myY = y + f[2] * val[0] + f[3] * val[1];

			drawBlock(myX,  	  myY, c);
			});
}

function drawPiece(x, y, p, r) {
	_drawPiece(x, y, p, r, col[p]);
}

function clearPiece(x, y, p, r) {
	_drawPiece(x, y, p, r, backgroundColor);
}

function loadImages(sources, callback) {
  var loadedImages = 0;
  var numImages = 0;
  for(var src in sources) {
    numImages++;
  }
  for(var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if(++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}
