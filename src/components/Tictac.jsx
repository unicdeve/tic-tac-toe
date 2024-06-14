import './Tictac.styles.css';
import { useTictac } from '../hooks/useTictac';

export default function Tictac({ boardLength = 3 }) {
	const { board, handleClick, reset, status } = useTictac(boardLength);

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
