import { useCallback, useEffect, useState } from 'react';
import './Tictac.styles.css';

const generateBoard = (boardLength) => {
	const board = [];

	for (let i = 0; i < boardLength; i++) {
		const rows = Array.from({ length: boardLength });
		board.push(rows);
	}

	return board;
};

const columnsToRows = (board) => {
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
const checkRow = (board) => {
	for (let i = 0; i < board.length; i++) {
		const row = board[i];
		const rowSet = new Set(row);

		if (rowSet.size === 1 && !rowSet.has(undefined)) return true;
	}

	return false;
};

const checkBoard = (board) => {
	if (checkRow(board)) return true;
	if (checkRow(columnsToRows(board))) return true;
	if (checkRow(diagonalsToRows(board))) return true;

	return false;
};

const getEmptyCells = (board) => {
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

const findWinningMove = (board, player) => {
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

export default function Tictac({ boardLength = 3 }) {
	const [board, setBoard] = useState(() => generateBoard(boardLength));
	const [currentPlayer, setCurrentPlayer] = useState('x');
	const [status, setStatus] = useState(null);

	const handleClick = useCallback(
		(column, row, player = currentPlayer) => {
			const newBoard = board.map((row) => [...row]);

			if (newBoard[column][row] || status) return;

			newBoard[column][row] = player;
			setBoard(newBoard);
			const wins = checkBoard(newBoard);

			if (wins) {
				setStatus(`${player} has won the game`);
			} else {
				setCurrentPlayer((prev) => (prev === 'x' ? 'o' : 'x'));
			}
		},
		[board, currentPlayer, status]
	);

	const reset = () => {
		setBoard(generateBoard(boardLength));
		setCurrentPlayer('x');
		setStatus(null);
	};

	useEffect(() => {
		if (currentPlayer === 'x' || status) return;

		const winningMove = findWinningMove(board, 'o');
		const blockingMove = findWinningMove(board, 'x');
		let computerMove = winningMove || blockingMove;

		if (!computerMove) {
			const emptyCells = getEmptyCells(board);
			computerMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
		}

		if (computerMove) {
			setTimeout(() => {
				handleClick(computerMove[0], computerMove[1], 'o');
			}, 200);
		}
	}, [currentPlayer, status, board, handleClick]);

	return (
		<div className='tictac-board'>
			{board.map((columns, i) => (
				<div key={i} className='columns'>
					{columns.map((row, j) => (
						<div key={j} className='row' onClick={() => handleClick(i, j)}>
							{row}
						</div>
					))}
				</div>
			))}

			<p className='status'>{status}</p>

			<button className='reset-btn' onClick={reset}>
				Reset
			</button>
		</div>
	);
}
