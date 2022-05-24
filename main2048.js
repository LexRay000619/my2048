let board = [];//游戏数据
let score = 0;//游戏分数
//用于记录每一个小格子是否发生过合并
let hasConflicted=[];

$(document).ready(function(){
    newGame();
});

function newGame(){
    // 初始化棋盘格
    init();
    // 停止函数AI()的运行
    isStop = false;
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            //对16个格子进行赋值
            let gridCell=$('#grid-cell-'+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));  //获取位置信息
            gridCell.css('left',getPosLeft(i,j));
        }
    }
    //将board变成二维数组
    for(let i=0;i<4;i++){
        board[i]=[];
        hasConflicted[i]=[];
        for(let j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    
    updateBoardView();
    score=0;
    updateScore(score);

}

function updateBoardView(){
    //删除当前的
    $(".number-cell").remove();
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            let theNumberCell = $('#number-cell-'+i+'-'+j)

            if(board[i][j]===0){
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
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));//背景色
                theNumberCell.css('color',getNumberColor(board[i][j]));//文字的前景色
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }
}
//生产一个数字
function generateOneNumber(){
    if(nospace(board)){
        return false;
    }

    let randx=Math.floor(Math.random()*4);//x坐标上的随机数
    let randy=Math.floor(Math.random()*4);//y位置上的随机数
    let times=0;

    // 随机一个位置，防止生成数字时间过久
    while(times<50){
        if(board[randx][randy]===0){
            break;
        }
        randx=Math.floor(Math.random()*4);
        randy=Math.floor(Math.random()*4);
        times++;
    }
    if(times===50){
        outer:for(let i=0;i<4;i++){
            for(let j=0;j<4;j++){
                if(board[i][j]===0){
                    randx=i;
                    randy=j;
                    break outer;
                }
            }
        }
    }

    // 随机一个数字,其中人为规定出2的概率为0.9,出4的概率为0.1
    let randNumber=Math.random()<0.9?2:4;

    // 在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);

    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37:
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38:
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39:
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40:
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;
    }
});

function isgameover(){
    if(!(canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board))){
        gameover();
    }
}

function isgameoverAI(board){
    return !(canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board));

}

function gameover(){
    alert('gameover!');
}

function moveLeft(){
    //判断当前是否可以向左移动
    if(!canMoveLeft(board)){
        return false;
    }
    // moveLeft
    for(let i=0;i<4;i++){
        for(let j=1;j<4;j++){
            //对于所有不是0的数都有可能进行移动，所以都要进行判断
            if(board[i][j]!==0){
                //对待定数据的左侧进行一一判断
                for(let k=0;k<j;k++){
                    //如果i，k位置为0并且i，k和i，j之间没有障碍物则可以移动
                    if(board[i][k]===0 && noBlockHorizontal(i,k,j,board)){
                        // move
                        if(!isStop) {
                            showMoveAnimation(i, j, i, k);
                        }
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                    }
                    //如果ik位置和ij位置数字相同并且之间没有障碍物则移动，并且ik位置只能添加一次数字
                    else if(board[i][k]===board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        // move
                        if(!isStop) {
                            showMoveAnimation(i, j, i, k);
                        }
                        // add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        //合并过一次就设置为true
                        hasConflicted[i][k]=true;
                        continue;

                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    // moveUp
    for(let i=1;i<4;i++){
        for(let j=0;j<4;j++){
            if(board[i][j]!==0){
                for(let k=0;k<i;k++){
                    if(board[k][j]===0 && noBlockVertical(k,i,j,board)){
                        // move
                        if(!isStop) {
                            showMoveAnimation(i, j, k, j);
                        }
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                    }
                    else if(board[k][j]===board[i][j] && noBlockVertical(k,i,j,board) && !hasConflicted[k][j]){
                        // move
                        if(!isStop) {
                            showMoveAnimation(i, j, k, j);
                        }
                        // add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);

                        hasConflicted[k][j]=true;

                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    // moveRight
    for(let i=0;i<4;i++){
        for(let j=3;j>=0;j--){
            if(board[i][j]!==0){
                for(let k=3;k>j;k--){
                    if(board[i][k]===0 && noBlockHorizontal(i,j,k,board)){
                        // move
                        if(!isStop) {
                            showMoveAnimation(i, j, i, k);
                        }
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                    }
                    else if(board[i][k]===board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        // move
                        if(!isStop) {
                            showMoveAnimation(i, j, i, k);
                        }
                        // add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);

                        hasConflicted[i][k]=true;

                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    // moveDown
    for(let i=3;i>=0;i--){
        for(let j=0;j<4;j++){
            if(board[i][j]!==0){
                for(let k=3;k>i;k--){
                    if(board[k][j]===0 && noBlockVertical(i,k,j,board)){
                        // move
                        if(!isStop) {
                            showMoveAnimation(i, j, k, j);
                        }
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                    }
                    else if(board[k][j]===board[i][j] && noBlockVertical(i,k,j,board) && !hasConflicted[k][j]){
                        // move
                        if(!isStop) {
                            showMoveAnimation(i, j, k, j);
                        }
                        // add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);

                        hasConflicted[k][j]=true;

                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}