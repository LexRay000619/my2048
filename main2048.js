var board = new Array();
var score = 0;
var hasConflicted=new Array();

$(document).ready(function(){
    newgame();
});
function AII() { 
    window.requestAnimationFrame(function () {
    AIbutton.click(function () { 
         AI();
    })
  });
}


function newgame(){
    // 初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber(board);
    generateOneNumber(board);
}

function init(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            // gridCell用于获取小格子元素,通过id来依次获取不同格子
            var gridCell=$('#grid-cell-'+i+"-"+j);
            // 根据i和j的值,计算小格子相应的top和left值
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    
    updateBoardView();
    score=0;
    updateScore(score);

}

function updateBoardView(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j)

            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+50);
                theNumberCell.css('left',getPosLeft(i,j)+50);
            }
            else{
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }
}

function generateOneNumber(){
    if(nospace(board)){
        return false;
    }

    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    var times=0;

    // 随机一个位置
    while(times<50){
        if(board[randx][randy]==0){
            break;
        }
        randx=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if(times==50){
        outer:for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                    break outer;
                }
            }
        }
    }

    // 随机一个数字,其中人为规定出2的概率为0.9,出4的概率为0.1
    var randNumber=Math.random()<0.9?2:4;

    // 在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);

    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37:
            if(moveLeft()){
                setTimeout(generateOneNumber(),210);
                setTimeout(isgameover(board),300);
            }
            break;
        case 38:
            if(moveUp()){
                setTimeout(generateOneNumber(),210);
                setTimeout(isgameover(board),300);
            }
            break;
        case 39:
            if(moveRight()){
                setTimeout(generateOneNumber(),210);
                setTimeout(isgameover(board),300);
            }
            break;
        case 40:
            if(moveDown()){
                setTimeout(generateOneNumber(),210);
                setTimeout(isgameover(board),300);
            }
            break;
        default:
            break;
    }
});

function isgameover(board){
    if(!(canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board))){
        // gameover();
        return true;
    }
    return false;
}

function gameover(){
    alert('gameover!');
}

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    // moveLeft
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        // move
                        showMoveAnimation(i,j,i,k);
                        // add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;

                    }
                }
            }
        }
    }
    updateBoardView();
    setTimeout(updateBoardView(), 1000/60);
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    // moveUp
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical(k,i,j,board)){
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(k,i,j,board) && !hasConflicted[k][j]){
                        // move
                        showMoveAnimation(i,j,k,j);
                        // add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);

                        hasConflicted[k][j]=true;
                        continue;

                    }
                }
            }
        }
    }
    updateBoardView();
    setTimeout(updateBoardView(), 1000/60);
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    // moveRight
    for(var i=0;i<4;i++){
        for(var j=3;j>=0;j--){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        // move
                        showMoveAnimation(i,j,i,k);
                        // add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);

                        hasConflicted[i][k]=true;
                        continue;

                    }
                }
            }
        }
    }
    updateBoardView();
    setTimeout(updateBoardView(), 1000/60);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    // moveDown
    for(var i=3;i>=0;i--){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(i,k,j,board)){
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(i,k,j,board) && !hasConflicted[k][j]){
                        // move
                        showMoveAnimation(i,j,k,j);
                        // add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);

                        hasConflicted[k][j]=true;
                        continue;

                    }
                }
            }
        }
    }
    updateBoardView();
    setTimeout(updateBoardView(), 1000/60);
    return true;
}

