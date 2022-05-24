let initialVirtualBoard = [];
let virtualBoard = [];
let hasConflictedVirtually = [];
let leftScore, rightScore, upScore, downScore, testScore, maxTestScore;
let isStop = true;

function stop1() {
    isStop = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function AI() {
    let k;
    let i;
// 总循环,AI会一直运行下去,直到游戏结束
    isStop = true;

    while (!isgameoverAI(board)) {
        if (isStop === false) {
            return;
        }
        // 先进行随机模拟,决定下一步的真实决策
        leftScore = rightScore = upScore = downScore = 0;
        if (canMoveLeft(board)) {
            for (i = 0; i < 4; i++) {
                initialVirtualBoard[i] = board[i].concat([]);
                hasConflictedVirtually[i] = hasConflicted[i].concat([]);
            }
            // 初始化向左移动一步之前总分为0,并向左移动一次
            testScore = 0;
            moveLeftInMemory(initialVirtualBoard);
            for (i = 0; i < 1000; i++) {
                // 向左移动一次之后,进行100场模拟游戏
                for (k = 0; k < 4; k++) {
                    virtualBoard[k] = initialVirtualBoard[k].concat([]);
                }
                randomGamePlay(virtualBoard);

            }
            leftScore = testScore
        }
        if (canMoveRight(board)) {
            for (i = 0; i < 4; i++) {
                initialVirtualBoard[i] = board[i].concat([]);
                hasConflictedVirtually[i] = hasConflicted[i].concat([]);
            }
            testScore = 0;
            moveRightInMemory(initialVirtualBoard);
            for (i = 0; i < 1000; i++) {
                for (k = 0; k < 4; k++) {
                    virtualBoard[k] = initialVirtualBoard[k].concat([]);
                }
                randomGamePlay(virtualBoard);
            }
            rightScore = testScore;
        }
        if (canMoveUp(board)) {
            for (i = 0; i < 4; i++) {
                initialVirtualBoard[i] = board[i].concat([]);
                hasConflictedVirtually[i] = hasConflicted[i].concat([]);
            }
            testScore = 0;
            moveUpInMemory(initialVirtualBoard);
            for (i = 0; i < 1000; i++) {
                for (k = 0; k < 4; k++) {
                    virtualBoard[k] = initialVirtualBoard[k].concat([]);
                }
                randomGamePlay(virtualBoard);
            }
            upScore = testScore;
        }
        if (canMoveDown(board)) {
            for (i = 0; i < 4; i++) {
                initialVirtualBoard[i] = board[i].concat([]);
                hasConflictedVirtually[i] = hasConflicted[i].concat([]);
            }
            testScore = 0;
            moveDownInMemory(initialVirtualBoard);
            for (i = 0; i < 1000; i++) {
                for (k = 0; k < 4; k++) {
                    virtualBoard[k] = initialVirtualBoard[k].concat([]);
                }
                randomGamePlay(virtualBoard);
            }
            downScore = testScore;
        }
        await move();
        await sleep(500);
        console.log(JSON.parse(JSON.stringify(board)));
        console.log("score = " + score);
    }
}


async function move() {
    maxTestScore = Math.max(leftScore, rightScore, upScore, downScore);
    switch (maxTestScore) {
        case leftScore:
            moveLeft();
            generateOneNumber();
            break;
        case rightScore:
            moveRight();
            generateOneNumber();
            break;
        case upScore:
            moveUp();
            generateOneNumber();
            break;
        case downScore:
            moveDown();
            generateOneNumber();
            break;
        default:
            break;
    }
}


function moveLeftInMemory(virtualBoard) {
    let i, j, k;
// 进入这个函数，说明当前状态下一定可以向左移动，该函数只处理虚拟数组，因此不必指定参数
    for (i = 0; i < 4; i++) {
        for (j = 1; j < 4; j++) {
            if (virtualBoard[i][j] !== 0) {
                for (k = 0; k < j; k++) {
                    if (virtualBoard[i][k] === 0 && noBlockHorizontal(i, k, j, virtualBoard)) {
                        virtualBoard[i][k] = virtualBoard[i][j];
                        virtualBoard[i][j] = 0;
                    } else if (virtualBoard[i][k] === virtualBoard[i][j] && noBlockHorizontal(i, k, j, virtualBoard) && !hasConflictedVirtually[i][k]) {
                        virtualBoard[i][k] += virtualBoard[i][j];
                        virtualBoard[i][j] = 0;
                        testScore += virtualBoard[i][k];
                        hasConflictedVirtually[i][k] = true;
                    }
                }
            }
        }
    }
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            hasConflictedVirtually[i][j] = false;
        }
    }
    // 由于在内存的虚拟数组中移动是AI自动执行的，与正常游戏的按键触发不同，因此移动之后还要自动生成新数字
    generateOneNumberVirtually(virtualBoard);
}

function moveUpInMemory(virtualBoard) {
    let i, j, k;
    for (i = 1; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (virtualBoard[i][j] !== 0) {
                for (k = 0; k < i; k++) {
                    if (virtualBoard[k][j] === 0 && noBlockVertical(k, i, j, virtualBoard)) {
                        virtualBoard[k][j] = virtualBoard[i][j];
                        virtualBoard[i][j] = 0;
                    } else if (virtualBoard[k][j] === virtualBoard[i][j] && noBlockVertical(k, i, j, virtualBoard) && !hasConflictedVirtually[k][j]) {
                        virtualBoard[k][j] += virtualBoard[i][j];
                        virtualBoard[i][j] = 0;
                        testScore += virtualBoard[k][j];
                        hasConflictedVirtually[k][j] = true;
                    }
                }
            }
        }
    }
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            hasConflictedVirtually[i][j] = false;
        }
    }
    generateOneNumberVirtually(virtualBoard);
}

function moveRightInMemory(virtualBoard) {
    let i, j, k;
    for (i = 0; i < 4; i++) {
        for (j = 3; j >= 0; j--) {
            if (virtualBoard[i][j] !== 0) {
                for (k = 3; k > j; k--) {
                    if (virtualBoard[i][k] === 0 && noBlockHorizontal(i, j, k, virtualBoard)) {
                        virtualBoard[i][k] = virtualBoard[i][j];
                        virtualBoard[i][j] = 0;
                    } else if (virtualBoard[i][k] === virtualBoard[i][j] && noBlockHorizontal(i, j, k, virtualBoard) && !hasConflictedVirtually[i][k]) {
                        virtualBoard[i][k] += virtualBoard[i][j];
                        virtualBoard[i][j] = 0;
                        testScore += virtualBoard[i][k];
                        hasConflictedVirtually[i][k] = true;
                    }
                }
            }
        }
    }
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            hasConflictedVirtually[i][j] = false;
        }
    }
    generateOneNumberVirtually(virtualBoard);
}

function moveDownInMemory(virtualBoard) {
    let i, j, k;
    for (i = 3; i >= 0; i--) {
        for (j = 0; j < 4; j++) {
            if (virtualBoard[i][j] !== 0) {
                for (k = 3; k > i; k--) {
                    if (virtualBoard[k][j] === 0 && noBlockVertical(i, k, j, virtualBoard)) {
                        virtualBoard[k][j] = virtualBoard[i][j];
                        virtualBoard[i][j] = 0;
                    } else if (virtualBoard[k][j] === virtualBoard[i][j] && noBlockVertical(i, k, j, virtualBoard) && !hasConflictedVirtually[k][j]) {
                        virtualBoard[k][j] += virtualBoard[i][j];
                        virtualBoard[i][j] = 0;
                        testScore += virtualBoard[k][j];
                        hasConflictedVirtually[k][j] = true;
                    }
                }
            }
        }
    }
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            hasConflictedVirtually[i][j] = false;
        }
    }
    generateOneNumberVirtually(virtualBoard);
}

function generateOneNumberVirtually(virtualBoard) {
    if (nospace(virtualBoard)) {
        return false;
    }

    let randx = Math.floor(Math.random() * 4);
    let randy = Math.floor(Math.random() * 4);
    let times = 0;

    // 随机一个位置
    while (times < 50) {
        if (virtualBoard[randx][randy] === 0) {
            break;
        }
        randx = Math.floor(Math.random() * 4);
        randy = Math.floor(Math.random() * 4);
        times++;
    }
    let i, j;
    if (times === 50) {
        outer:for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                if (virtualBoard[i][j] === 0) {
                    randx = i;
                    randy = j;
                    break outer;
                }
            }
        }
    }

    // 随机一个数字,其中人为规定出2的概率为0.9,出4的概率为0.1
    // 在随机位置显示随机数字
    virtualBoard[randx][randy] = Math.random() < 0.9 ? 2 : 4;

    return true;
}

function randomGamePlay(virtualBoard) {
    // randomChoice:采用随机数生成,0为left，1为right，2为up，3为down
    let randomChoice;
    // 本函数是一次完整的模拟游戏过程，由当前状态开始不断地随机移动，直至游戏结束
    while (!isgameoverAI(virtualBoard)) {
        randomChoice = Math.floor(Math.random() * 4);
        switch (randomChoice) {
            // 已经进行随机尝试了，针对的都是内存中的虚拟数组
            case 0:
                if (canMoveLeft(virtualBoard)) {
                    moveLeftInMemory(virtualBoard);
                }
                break;
            case 1:
                if (canMoveRight(virtualBoard)) {
                    moveRightInMemory(virtualBoard);
                }
                break;
            case 2:
                if (canMoveUp(virtualBoard)) {
                    moveUpInMemory(virtualBoard);
                }
                break;
            case 3:
                if (canMoveDown(virtualBoard)) {
                    moveDownInMemory(virtualBoard);
                }
                break;
        }
    }
}