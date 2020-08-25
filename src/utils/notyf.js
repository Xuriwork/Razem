import { Notyf } from 'notyf';

export const notyf = new Notyf({
	position: { x: 'right', y: 'top' },
	duration: 4500,
	types: [
		{
			type: 'info',
			background: '#40514e',
		},
	],
});

export default notyf;