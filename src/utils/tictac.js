export const generateBoard = (boardLength) => {
	const board = [];

	for (let i = 0; i < boardLength; i++) {
		const rows = Array.from({ length: boardLength });
		board.push(rows);
	}

	return board;
};

export const columnsToRows = (board) => {
	const newBoard = [];
	for (let column = 0; column < board.length; column++) {
		const currentColumn = board[column];
		const newRow = [];
		for (let row = 0; row < currentColumn.length; row++) {
			newRow.push(board[row][column]);
		}
		newBoard.push(newRow);
	}

	return newBoard;
};

const diagonalsToRows = (board) => {
	const newBoard = [[], []];
	let increment = 0;
	let decrement = board.length - 1;

	while (increment < board.length) {
		newBoard[0].push(board[increment][increment]);
		newBoard[1].push(board[increment][decrement]);

		increment++;
		decrement--;
	}

	return newBoard;
};

// check all rows the same
export const checkRow = (board) => {
	for (let i = 0; i < board.length; i++) {
		const row = board[i];
		const rowSet = new Set(row);

		if (rowSet.size === 1 && !rowSet.has(undefined)) return true;
	}

	return false;
};

export const checkBoard = (board) => {
	if (checkRow(board)) return true;
	if (checkRow(columnsToRows(board))) return true;
	if (checkRow(diagonalsToRows(board))) return true;

	return false;
};

export const getEmptyCells = (board) => {
	const emptyCells = [];
	board.forEach((column, colIndex) => {
		column.forEach((cell, rowIndex) => {
			if (!cell) {
				emptyCells.push([colIndex, rowIndex]);
			}
		});
	});
	return emptyCells;
};

export const findWinningMove = (board, player) => {
	const emptyCells = getEmptyCells(board);
	for (let i = 0; i < emptyCells.length; i++) {
		const [col, row] = emptyCells[i];
		const newBoard = board.map((row) => [...row]);
		newBoard[col][row] = player;
		if (checkBoard(newBoard)) {
			return [col, row];
		}
	}
	return null;
};
