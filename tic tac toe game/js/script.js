(function Game() {
    // ELEMENTS
    var game = document.getElementById('game');
    var boxes = document.querySelectorAll('li');
    var resetGame = document.getElementById('reset-game');
    var turnDisplay = document.getElementById('whos-turn');
    var gameMessages = document.getElementById('game-messages');
    var playerOneScoreCard = document.getElementById('player-one-score');
    var playerTwoScoreCard = document.getElementById('player-two-score');
    
    // VARIABLES
    var context = { 'player1' :'x', 'player2' : 'o' };
    var board = [];
    
    var playerOneScore = 0;
    var playerTwoScore = 0;
    
    var turns;
    var currentContext;
    
    // CONSTRUCTER
    var init = function() {
        turns = 0;
        
        // GIVE CURRENT CONTEXT
        currentContext = computeContext();
        
        // 3/3 SETUP BOARD
        board[0] = new Array(3);
        board[1] = new Array(3);
        board[2] = new Array(3);
        
        // EVENTS BINDING
        for(var i = 0; i < boxes.length; i++) {
            boxes[i].addEventListener('click', clickHandler, false);
        }
        
        resetGame.addEventListener('click', resetGameHandler, false);
    }
    
    //TO KEEP TRACK OF PLAYERS TURN
    var computeContext = function() {
        return (turns % 2 == 0) ? context.player1 : context.player2;
    }
    
    // DOM ELEMENT BINDING TO THE CLICK CALLBACK
    var clickHandler = function() {
        this.removeEventListener('click', clickHandler);
        
        this.className = currentContext;
        this.innerHTML = currentContext;
        
        var pos = this.getAttribute('data-pos').split(',');
        board[pos[0]][pos[1]] = computeContext() == 'x' ? 1 : 0;
        
        if(checkStatus()) {
            gameWon();
        }
        
        turns++;
        currentContext = computeContext();
        turnDisplay.className = currentContext;
    }
    
    
    //  CHECK TO SEE IF PLAYER HAS WON
    var checkStatus = function() {
        var used_boxes = 0;
        
        for(var rows = 0; rows < board.length; rows++ ) {
            var row_total = 0;
            var column_total = 0;
            
            for(var columns = 0; columns < board[rows].length; columns++) {
                row_total += board[rows][columns];
                column_total += board[columns][rows];
                
                if(typeof board[rows][columns] !== "undefined") {
                    used_boxes++;
                }
            }
            
            // WINNING COMBINATION FOR DIAGNOL SERIES [0,4,8], [2,4,6]
            var diagonal_tl_br = board[0][0] + board[1][1] + board[2][2]; // diagonal top left to bottom right
            var diagonal_tr_bl = board[0][2] + board[1][1] + board[2][0]; // diagonal top right bottom left
            
            if(diagonal_tl_br == 0 || diagonal_tr_bl == 0 || diagonal_tl_br == 3 || diagonal_tr_bl == 3) {
                return true;
            }
            
            // WINNING COMBINATION FOR ROW  [0,1,2], [3,4,5], [6,7,8]
            // WINNING COMBINATION FOR COLUMN [0,3,6], [1,4,7], [2,5,8]
            // ONLY ONE WAY TO WIN IF TOTAL IS 0 OR IF THE TOTAL IS 3. X ARE WORTH 1 POINT AND O ARE WORTH 0 POINT
            if(row_total == 0 || column_total == 0 || row_total == 3 || column_total == 3) {
                return true;
            }
            
            // AFTER ALL BOXES FILL THEN ITS DRAW
            if(used_boxes == 9) {
                gameDraw();
            }
        }
    }
    var gameWon = function() {
        clearEvents();
        
        // TO SHOW WHO WINS
        gameMessages.className = 'player-' + computeContext() + '-win';
        
        // PLAYER SCORE UPDATING
        switch(computeContext()) {
            case 'x':
                 playerOneScoreCard.innerHTML = ++playerOneScore;
                break;
            case 'o':
                playerTwoScoreCard.innerHTML = ++playerTwoScore;
        }
    }
    // GIVE MESSAGE AS GAME IS DRAW
    var gameDraw = function() {
        gameMessages.className = 'draw';
        clearEvents();
    }
    
    // STOPS CLICK RESPONSE WHEN GAME IS DONE
    var clearEvents = function() {
        for(var i = 0; i < boxes.length; i++) {
            boxes[i].removeEventListener('click', clickHandler);
        }
    }
    // TO RESET THE GAME
    var resetGameHandler = function() {
        clearEvents();
        init();
        
        // REMOVE ALL X AND O CLASS NAMES 
        // TO CLEAR INNERHTML
        for(var i = 0; i < boxes.length; i++) {
            boxes[i].className = '';
            boxes[i].innerHTML = '';
        }
        
        // CHANGE WHOIS TURN OPTION TO PLAYER ONE OR X
        turnDisplay.className = currentContext;
        gameMessages.className = '';
    }
    
    game && init();
})();