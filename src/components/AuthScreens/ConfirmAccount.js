import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import notyf from '../../utils/notyf';

const ConfirmAccount = ({ history }) => {
	const [confirmationCode, setConfirmationCode] = useState('');
	const email = history.state.email;

	const handleOnCodeChange = (e) => setConfirmationCode(e.target.value);

	const handleConfirmSignUp = async (e) => {
		e.preventDefault();

		try {
			await Auth.confirmSignUp(email, confirmationCode);
			notyf.success('User confirmed');
			history.push('/');
		} catch (error) {
			console.log('Error confirming sign up', error);
		}
	};

	const handleResendConfirmationCode = async () => {
		try {
			await Auth.resendSignUp(email);
			notyf.open({ type: 'info', message: 'Confirmation code sent' });
		} catch (error) {
			console.log('Error resending code: ', error);
		}
	};
	return (
		<div className='confirm-account-component'>
			<div>
				<h2>Check your email</h2>
				<p>We've sent you a 6 digit confirmation code</p>
				<form>
					<label>Confirmation Code</label>
					<input
						type='number'
						name='confirmation_code'
						onChange={handleOnCodeChange}
						style={{ marginTop: '2px', marginBottom: 0 }}
					/>
					<button onClick={handleConfirmSignUp} className='form-button'>
						Confirm
					</button>
					<p
						onClick={handleResendConfirmationCode}
						className='resend-confirmation-code-button'
					>
						Resend Confirmation Code
					</p>
				</form>
			</div>
		</div>
	);
};

export default ConfirmAccount;
