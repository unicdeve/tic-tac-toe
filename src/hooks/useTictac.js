import { useCallback, useEffect, useState } from 'react';
import {
	checkBoard,
	findWinningMove,
	generateBoard,
	getEmptyCells,
} from '../utils/tictac';

export const useTictac = (boardLength) => {
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
				setStatus(`${player === 'x' ? 'You' : 'Computer'} has won the game`);
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

		let computerMove = null;

		// 70% chance to make a smart move
		if (Math.random() > 0.3) {
			const winningMove = findWinningMove(board, 'o');
			const blockingMove = findWinningMove(board, 'x');
			computerMove = winningMove || blockingMove;
		}

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

	return { board, handleClick, reset, status };
};
