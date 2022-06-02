function showNumberWithAnimation(i,j,randNumber){
    let numberCell = $('#number-cell-' + i + "-" + j);

    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({//动画效果
        width:"100px",
        height:"100px",
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);//50ms时间内完成
}
//格子移动的动画
function showMoveAnimation(fromx,fromy,tox,toy){
    let numberCell=$('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

function updateScore(score){
    $('#score').text(score);
}