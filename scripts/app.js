var constants = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    FPS: 120,
    GAME_SPEED: 5,
    BALL_SIZE: 10,
    PADDLE_WIDTH: 10,
    PADDLE_HEIGHT: 125,
    SOUNDS: {
        BALL_BOUNCE: new Audio("sounds/paddle.wav")
    },
    CENTER_LINE_WIDTH: 2
};

(function ($) {

    var canvas, canvasDOM, canvasContext, renderingLoop, gameStateLoop;
    var mousePosition;
    var player1PaddleTop, player2PaddleTop;
    var ballX,
        ballY,
        ballSpeedX,
        ballSpeedY;

    function initCanvas() {

        canvas = $('#game-canvas')
            .attr("width", constants.CANVAS_WIDTH)
            .attr("height", constants.CANVAS_HEIGHT);

        canvasDOM = canvas.get(0);
        canvasContext = canvasDOM.getContext("2d");
    }


    function initGameState() {
        ballX = ballY = constants.BALL_SIZE / 2;
        ballSpeedX = ballSpeedY = 3.5;
        player1PaddleTop = player2PaddleTop = 10;
        mousePosition = {x: 0, y: 0};
        canvas.on("mousemove", function (event) {
            mousePosition = {
                x: event.pageX - canvas.parent().offset().left,
                y: event.pageY - canvas.parent().offset().top
            };
        });
        renderAll();
    }

    function drawCenterLine() {
        var dashSize = 75,
            spaceSize = 25
        dashes = constants.CANVAS_HEIGHT / 100;
        for (var i = 0; i < dashes; i++) {
            canvasContext.fillRect(constants.CANVAS_WIDTH / 2 - constants.CENTER_LINE_WIDTH / 2,
                i ? (dashSize + spaceSize) * i + spaceSize / 2 : spaceSize / 2, constants.CENTER_LINE_WIDTH, dashSize);
        }
    }

    function updateBallState() {
        var xChanged = false;
        var yChanged = false;
        if (ballX + (constants.BALL_SIZE / 2) + ballSpeedX > constants.CANVAS_WIDTH) { // right
            ballX = constants.CANVAS_WIDTH - (constants.BALL_SIZE / 2);
            ballSpeedX *= -1;
            xChanged = true;
        } else if ((ballX - constants.BALL_SIZE / 2) + ballSpeedX <= 0) { // left
            ballX = constants.BALL_SIZE / 2;
            ballSpeedX *= -1;
            xChanged = true;
        }

        if (ballY + (constants.BALL_SIZE / 2) + ballSpeedY > constants.CANVAS_HEIGHT) { // bottom
            ballY = constants.CANVAS_HEIGHT - ( constants.BALL_SIZE / 2);
            ballSpeedY *= -1;
            yChanged = true;
        } else if ((ballY - constants.BALL_SIZE / 2) + ballSpeedY <= 0) { // top
            ballY = constants.BALL_SIZE / 2;
            ballSpeedY *= -1;
            yChanged = true;
        }

        if (!xChanged) ballX += ballSpeedX;
        if (!yChanged) ballY += ballSpeedY;
    }

    function updatePaddleState() {
        player1PaddleTop = mousePosition.y - constants.PADDLE_HEIGHT / 2;
        player2PaddleTop = mousePosition.y - constants.PADDLE_HEIGHT / 2;
    }

    function updateGameState() {
        updateBallState();
        updatePaddleState();
        if (ballX == constants.BALL_SIZE / 2) {
            console.log("left-edge: " + ballX);
        }
        if (ballX + constants.BALL_SIZE / 2 == constants.CANVAS_WIDTH) {
            console.log("right-edge: " + (ballX + constants.BALL_SIZE));
        }
        if (ballY < 6) {
            console.log("top: " + ballY);
        }
        if (ballY + constants.BALL_SIZE / 2 == constants.CANVAS_HEIGHT) {
            console.log("bottom: " + (ballY + constants.BALL_SIZE));
        }
    }

    function drawCircle(centerX, centerY, radius, fillColor) {
        var tmpColor = canvasContext.fillStyle;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        canvasContext.fillStyle = fillColor;
        canvasContext.fill();
        canvasContext.fillStyle = tmpColor;
    }

    function renderAll() {
        canvasContext.fillStyle = "black";
        canvasContext.fillRect(0, 0, canvas.attr('width'), canvas.attr('height'));

        canvasContext.fillStyle = "white";
        drawCenterLine();
        drawCircle(ballX, ballY, constants.BALL_SIZE / 2, "white");


        canvasContext.fillRect(5, player1PaddleTop, constants.PADDLE_WIDTH, constants.PADDLE_HEIGHT);
        canvasContext.fillRect(constants.CANVAS_WIDTH - 5 - constants.PADDLE_WIDTH, player2PaddleTop, constants.PADDLE_WIDTH, constants.PADDLE_HEIGHT);
    }

    function getRenderingLoop() {
        return setInterval(function () {
            renderAll();
        }, 1000 / constants.FPS);
    }

    function getGameStateLoop() {
        return setInterval(function () {
            updateGameState();
        }, 20 * (constants.GAME_SPEED / 10));
    }

    function pauseGame() {
        window.gameStatus = false;
        clearInterval(gameStateLoop);
        clearInterval(renderingLoop);
    }

    function startGame() {
        window.gameStatus = true;
        gameStateLoop = getGameStateLoop();
        renderingLoop = getRenderingLoop();
    }

    $(window).keydown(function (event) {
        if (event.keyCode == 27) {
            window.gameStatus ? pauseGame() : startGame();
        }
    });

    initCanvas();
    initGameState();
    startGame();

})(jQuery);