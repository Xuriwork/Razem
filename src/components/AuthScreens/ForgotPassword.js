import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import notyf from '../../utils/notyf';

const ForgotPassword = ({ history }) => {
	const [email, setEmail] = useState('');
	const [emailSent, setEmailSent] = useState(false);
	const [verificationCode, setVerificationCode] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const handleOnEmailChange = (e) => setEmail(e.target.value);
	const handleOnVerificationCodeChange = (e) => setVerificationCode(e.target.value);
	const handleOnNewPasswordChange = (e) => setNewPassword(e.target.value);

	const handleSendResetPasswordVerificationCode = async () => {
		try {
			await Auth.forgotPassword(email);
			notyf.open({ type: 'info', message: 'Verification code sent' });
			setEmailSent(true);
		} catch (error) {
			console.log('Error resending code: ', error);
		}
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();
		try {
			await Auth.forgotPasswordSubmit(email, verificationCode, newPassword);
			setTimeout(history.push('/'), 2500);
			notyf.success('Password reset successful, redirecting...');
		} catch (error) {
			console.log('Error confirming sign up', error);
		}
	};

	return (
		<div className='forgot-password-component'>
			<div>
				<h2>Reset your Password</h2>
				<form>
					{emailSent ? (
						<>
							<label>Verification Code</label>
							<input
								type='text'
								name='verification_code'
								onChange={handleOnVerificationCodeChange}
								style={{ marginTop: '2px', marginBottom: 0 }}
							/>
							<label>New Password</label>
							<input
								type='text'
								name='new_password'
								onChange={handleOnNewPasswordChange}
								style={{ marginTop: '2px', marginBottom: 0 }}
							/>
							<button onClick={handleChangePassword} className='form-button'>
								Change Password
							</button>
						</>
					) : (
						<>
							<label>Email Address</label>
							<input
								type='email'
								name='email'
								onChange={handleOnEmailChange}
								style={{ marginTop: '2px', marginBottom: 0 }}
							/>
							<button
								onClick={handleSendResetPasswordVerificationCode}
								className='form-button'
							>
								Send email
							</button>
						</>
					)}
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
