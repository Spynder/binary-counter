$(document).ready(function() {
	$("#game").hide();
	$("#start").click(function() {
		$("#firstPage").hide();
		$("#game").show();
		collectSettings();
		startGame();
	});

	let settings = {};
	function collectSettings() {
		settings["binaryDigits"] = parseInt($("#optionBinaryDigits").val());
		settings["maxCorrectAnswers"] = parseInt($("#optionMaxCorrectAnswers").val());
		settings["penalty"] = parseInt($("#optionPenalty").val());
		settings["backwards"] = $("#optionBackwards").is(":checked");
		settings["speedrunner"] = $("#optionSpeedrunner").is(":checked");
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	let start;
	let timer;
	let running = false;
	function startGame() {
		running = true;
		showNumber();
		start = Date.now();
		timer = setInterval(function() {
			let passed = Date.now() - start + (total-correct)*settings["penalty"]*1000;
			let milliseconds = (passed%1000).toString().padStart(3, '0');
			let seconds = (Math.floor(passed/1000) % 60).toString().padStart(2, '0');
			let minutes = (Math.floor(passed/60000)).toString().padStart(2, '0');
			$("#timer").text(`${minutes}:${seconds}.${milliseconds}`);
		}, 1./60.);
		$("#input").focus();
	}

	function stopGame() {
		clearInterval(timer);
		running = false;
	}

	let currNumber = -1;
	let total = 0;
	let correct = 0;
	function showNumber() {
		currNumber = getRandomInt(Math.pow(2, settings["binaryDigits"]));
		if(settings["backwards"] && getRandomInt(2) == 1) {
			$("#number").text(currNumber);
			$("#number").addClass("decimal");
			currNumber = currNumber.toString(2).padStart(settings["binaryDigits"], '0');
		} else {
			$("#number").text(currNumber.toString(2).padStart(settings["binaryDigits"], '0'));
			$("#number").removeClass("decimal");
		}
	}

	function pressedNumber(num) {
		total+=1;
		if(num == currNumber || parseInt(num) == currNumber) {
			$("#hint").text("Correct!");
			$("#hint").addClass("correct");
			$("#hint").removeClass("wrong");
			correct++;
		} else {
			$("#hint").text("Wrong!");
			$("#hint").addClass("wrong");
			$("#hint").removeClass("correct");
		}
		$("#counter").text(`${correct}/${total}`);
		if(correct >= settings["maxCorrectAnswers"]) {
			if(correct == total) {
				$("#hint").text("PERFECT!");
				$("#hint").addClass("correct");
				$("#hint").removeClass("wrong");
				$("#hint").addClass("perfect");
			}
			stopGame();
			return;
		}
		showNumber();
	}

	function isNumeric(value) {
		return /^-?\d+$/.test(value);
	}
	function isBlank(str) {
		return (!str || /^\s*$/.test(str));
	}
	

	$("#input").on("change keyup paste", function(e) {
		if(!running) return;
		let text = e.target.value;
		if(isBlank(text)) {
			$("#input").val(text.replace(/\s/g,"")); 
			return;
		}
		//alert("?")
		if(text.indexOf("\n") != -1 || text.indexOf(" ") != -1) {
			pressedNumber(text);
			$("#input").val("");
			return;
		}
		if(settings["speedrunner"]) {
			text = text.replace(/\s/g,"");
			if(typeof(currNumber) == "number" && text.length >= Math.pow(2, settings["binaryDigits"]).toString().length) {
				pressedNumber(text);
				$("#input").val("");
				return;
			}
			else if(typeof(currNumber) == "string" && text.length >= settings["binaryDigits"]) {
				pressedNumber(text);
				$("#input").val("");
				return;
			}
		}
		$("#input").val(text.replace(/\s/g,"")); 
	});
});