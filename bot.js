// File: public/bot.js

function getBestMove(board, size, player) {
    const opponent = player === 'X' ? 'O' : 'X';

    // Ưu tiên thắng nếu có thể
    const winMove = findWinningMove(board, size, player);
    if (winMove) return winMove;

    // Chặn nếu đối phương sắp thắng
    const blockMove = findWinningMove(board, size, opponent);
    if (blockMove) return blockMove;

    // Chặn nếu đối phương có 3 liên tiếp (mối đe dọa tiềm ẩn)
    const threatMove = findThreatMove(board, size, opponent, 3);
    if (threatMove) return threatMove;

    // Nếu không thì chọn ngẫu nhiên ô trống gần nhất
    return findRandomNearbyMove(board, size, player);
}

function findWinningMove(board, size, player) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === '') {
                board[row][col] = player;
                if (checkWin(board, row, col, player)) {
                    board[row][col] = '';
                    return { row, col };
                }
                board[row][col] = '';
            }
        }
    }
    return null;
}

function findThreatMove(board, size, player, threatLength) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === '') {
                board[row][col] = player;
                if (countMaxConsecutive(board, row, col, player) >= threatLength) {
                    board[row][col] = '';
                    return { row, col };
                }
                board[row][col] = '';
            }
        }
    }
    return null;
}

function countMaxConsecutive(board, row, col, player) {
    const directions = [
        { dx: 1, dy: 0 },   // Ngang
        { dx: 0, dy: 1 },   // Dọc
        { dx: 1, dy: 1 },   // Chéo xuôi
        { dx: 1, dy: -1 }   // Chéo ngược
    ];
    let maxCount = 0;

    for (let dir of directions) {
        let count = 1;

        // Trái/lên
        let x = row - dir.dy;
        let y = col - dir.dx;
        while (isInBounds(x, y, board.length) && board[x][y] === player) {
            count++;
            x -= dir.dy;
            y -= dir.dx;
        }

        // Phải/xuống
        x = row + dir.dy;
        y = col + dir.dx;
        while (isInBounds(x, y, board.length) && board[x][y] === player) {
            count++;
            x += dir.dy;
            y += dir.dx;
        }

        maxCount = Math.max(maxCount, count);
    }

    return maxCount;
}

function checkWin(board, row, col, player) {
    const directions = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 }
    ];

    for (let { dx, dy } of directions) {
        let count = 1;

        let r = row + dy, c = col + dx;
        while (isInBounds(r, c, board.length) && board[r][c] === player) {
            count++;
            r += dy;
            c += dx;
        }

        r = row - dy, c = col - dx;
        while (isInBounds(r, c, board.length) && board[r][c] === player) {
            count++;
            r -= dy;
            c -= dx;
        }

        if (count >= 5) return true;
    }

    return false;
}

function isInBounds(row, col, size) {
    return row >= 0 && row < size && col >= 0 && col < size;
}

function findRandomNearbyMove(board, size, player) {
    // Tìm các ô trống xung quanh nước đã đánh
    let possibleMoves = [];

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === '' && hasNeighbor(board, row, col, size)) {
                possibleMoves.push({ row, col });
            }
        }
    }

    if (possibleMoves.length === 0) return { row: Math.floor(size / 2), col: Math.floor(size / 2) };

    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}

function hasNeighbor(board, row, col, size) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let r = row + i, c = col + j;
            if (isInBounds(r, c, size) && board[r][c] !== '') return true;
        }
    }
    return false;
}
