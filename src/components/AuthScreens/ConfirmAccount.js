import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import notyf from '../../utils/notyf';

const ConfirmAccount = () => {
    const [username,] = useState('vajogi7636@sanizr.com');
    const [confirmationCode, setConfirmationCode] = useState(null);

	const handleOnChangeCode = (e) => setConfirmationCode(e.target.value);

	const handleConfirmSignUp = async (e) => {
		e.preventDefault();
		try {
			await Auth.confirmSignUp(username, confirmationCode)
			notyf.success('User confirmed')
		} catch (error) {
			console.log('Error confirming sign up', error);
		}
	};

	const handleResendConfirmationCode = async () => {
		try {
			await Auth.resendSignUp(username);
			notyf.open({ type: 'info', message: 'Confirmation code sent' });
		} catch (err) {
			console.log('error resending code: ', err);
		}
	};
    return (
<div className='sign-up-component'>
			<div style={{ height: '200px' }}>
				<form>
							<label>Confirmation Code</label>
							<input
								type='number'
								name='confirmation_code'
								onChange={handleOnChangeCode}
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
    )
}

export default ConfirmAccount;
