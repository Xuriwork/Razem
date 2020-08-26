import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import notyf from '../../utils/notyf';

const ForgotPassword = ({ history }) => {
	const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

	const handleOnEmailChange = (e) => setEmail(e.target.value);

	const handleConfirmSignUp = async (e) => {
		e.preventDefault();
		try {
			await Auth.confirmSignUp(email, verificationCode, newPassword);
			setTimeout(history.push('/'), 2500);
			notyf.success('Password reset successful, redirecting...');
		} catch (error) {
			console.log('Error confirming sign up', error);
		}
	};

	const handleSendResetPasswordVerificationCode = async () => {
		try {
			await Auth.forgotPassword(email);
			notyf.open({ type: 'info', message: 'Verification code sent' });
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
						type='email'
						name='email'
						onChange={handleOnEmailChange}
						style={{ marginTop: '2px', marginBottom: 0 }}
					/>
					<button onClick={handleSendResetPasswordVerificationCode} className='form-button'>
                        Send email
					</button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
