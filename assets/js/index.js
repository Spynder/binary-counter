$(document).ready(function() {
    $("#game").hide();
    $("#start").click(function() {
        $("#firstPage").hide();
        $("#game").show();
        startGame();
    });

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
            let passed = Date.now() - start;
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
        currNumber = getRandomInt(16);
        $("#number").text(currNumber.toString(2).padStart(4, '0'));
    }

    function pressedNumber(num) {
        if(num == -1) return;
        total+=1;
        if(num == currNumber) {
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
        if(correct == 16) {
            stopGame();
            return;
        }
        showNumber();
    }

    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    $("#input").on("change keyup paste", function(e) {
        if(!running) return;
        let text = e.target.value;
        //alert("?")
        if(text.indexOf("\n") != -1 || text.indexOf(" ") != -1 && isNumeric(text)) {
            pressedNumber(parseInt(text));
            $("#input").val("");
        }
    });
});