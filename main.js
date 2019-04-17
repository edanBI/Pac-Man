var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;

class UserData {
	constructor(username, password, firstname, lastname, email, birthday){
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.birthday = birthday;
	}
}

const game = document.getElementById("game");
const welcome = document.getElementById("welcome");
const register = document.getElementById("register");
const login = document.getElementById("login");
let users = [new UserData('a', 'a','a','a','a@asdf','1-3-1991')]; // holds the users. username 'a' with password 'a' as mentioned in the instructions



function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) ||
				(i === 6 && j === 2)) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= 1.0 * food_remain / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener("keydown", function (e) {
		keysDown[e.code] = true;
	}, false);
	addEventListener("keyup", function (e) {
		keysDown[e.code] = false;
	}, false);
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor((Math.random() * 9) + 1);
	var j = Math.floor((Math.random() * 9) + 1);
	while (board[i][j] !== 0) {
		i = Math.floor((Math.random() * 9) + 1);
		j = Math.floor((Math.random() * 9) + 1);
	}
	return [i, j];
}

/**
 * @return {number}
 */
function GetKeyPressed() {
	if (keysDown['ArrowUp']) {
		return 1;
	}
	if (keysDown['ArrowDown']) {
		return 2;
	}
	if (keysDown['ArrowLeft']) {
		return 3;
	}
	if (keysDown['ArrowRight']) {
		return 4;
	}
}

function Draw() {
	context.clearRect(0, 0, canvas.width, canvas.height); //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] === 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] === 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] === 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x === 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
			shape.j--;
		}
	}
	if (x === 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
			shape.j++;
		}
	}
	if (x === 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
			shape.i--;
		}
	}
	if (x === 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] === 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score === 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

function displayRegister() {
	welcome.style.display = 'none';
	register.style.display = 'unset';
}

function displayLogin() {
	welcome.style.display = 'none';
	login.style.display = 'unset';
}

function submitRegister() {
	var formInputs = document.getElementsByClassName('regform');
	var data = Array.prototype.filter.call(formInputs, e => e.value.value);
	//alert(userData[0].value);
	
}

function validateDetails(details) {
	// details.substring(0, details.indexOf(':'))
	// details.substring(details.indexOf(':')+1)
	let usrFound = false;
	for(var i=0; i < users.length; i++){
		if(users[i] === details)
			usrFound = true;
	}
	return usrFound;
}

$(document).ready(function () {
	$("#registerform").validate({
		rules: {
			username: "required",
			password: {
				required: true,
				minlength: 8,
				alphanumeric: true
			},
			firstname: {
				required: true,
				lettersonly: true
			},
			lastname: {
				required: true,
				lettersonly: true
			},
			email: "required",
			birthday: "required"
		},
		messages: {
			username: " Please Enter Username.",
			password: {
				required: " Enter Password",
				minlength: " Password length should me at least 8 characters.",
				alphanumeric: " no symbols allowed!"
			},
			firstname: {
				required: "Enter First Name",
				lettersonly: "name should contain ONLY letters."
			},
			lastname: {
				required: "Enter Last Name",
				lettersonly: "name should contain ONLY letters."
			},
			email: " Enter a valid email address.",
			birthday: "enter your birthday"
		}
	})
});

//Start();
game.style.display = 'none';
register.style.display = 'none';
login.style.display = 'none';
