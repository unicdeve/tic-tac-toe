import { useCallback, useState } from 'react';
import './Tictac.styles.css';

const generateBoard = (boardLength) => {
	const board = [];

	for (let i = 0; i < boardLength; i++) {
		const rows = Array.from({ length: boardLength });
		board.push(rows);
	}

	return board;
};

const columsToRows = (board) => {
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

const checkRow = (board) => {
	for (let i = 0; i < board.length; i++) {
		// check all rows the same
		const row = board[i];

		const rowSet = new Set(row);

		if (rowSet.size === 1 && !rowSet.has(undefined)) return true;
	}

	return false;
};

const checkBoard = (board) => {
	// check all rows the same
	if (checkRow(board)) return true;

	// check all columns are the same
	if (checkRow(columsToRows(board))) return true;

	console.log(diagonalsToRows(board));

	// check diagonals are the same
	if (checkRow(diagonalsToRows(board))) return true;

	return false;
};

export default function Tictac({ boardLength = 3 }) {
	const [board, setBoard] = useState(() => generateBoard(boardLength));
	const [currentPlayer, setCurrentPlayer] = useState('x');
	const [status, setStatus] = useState(null);

	const handleClick = useCallback(
		(column, row) => {
			const newBoard = [...board];

			if (newBoard[column][row] || status) return;

			newBoard[column][row] = currentPlayer;
			setBoard(newBoard);
			const wins = checkBoard(newBoard);

			if (wins) {
				setStatus(`${currentPlayer} has won the game`);
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
