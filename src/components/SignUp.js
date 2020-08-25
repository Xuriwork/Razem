import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import notyf from '../utils/notyf';

const SignUp = () => {
	const { register, handleSubmit } = useForm();
	const [confirmSignUpForm, setConfirmSignUpForm] = useState(false);
	const [username, setUsername] = useState('vajogi7636@sanizr.com');
	const [code, setCode] = useState(null);

	const handleOnChangeCode = (e) => setCode(e.target.value);

	const handleConfirmSignUp = async (e) => {
		e.preventDefault();
		try {
			await Auth.confirmSignUp(username, code)
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

	const handleSignUp = handleSubmit(async (data) => {
		const { email, password } = data;
		console.log(email);

		try {
			const { user } = await Auth.signUp({
				username: email,
				email,
				password,
				attributes: {
					email,
				},
			});
			console.log(user);
			setUsername(user.username);
			setConfirmSignUpForm(true);
		} catch (error) {
			console.error('Sign up error:', error);
			notyf.error(error);
		}
	});

	return (
		<div className='sign-up-component'>
			<div style={{ height: confirmSignUpForm ? '200px' : null }}>
				<form>
					{confirmSignUpForm ? (
						<>
							<label>Verification Code</label>
							<input
								type='number'
								name='verification_code'
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
						</>
					) : (
						<>
							<label>Email *</label>
							<input
								type='email'
								name='email'
								placeholder='Enter your email'
								ref={register({ required: true })}
							/>
							<label>Password *</label>
							<input
								type='password'
								name='password'
								placeholder='Enter your password'
								ref={register({ required: true })}
							/>
							<label>Confirm Password *</label>
							<input
								type='password'
								name='confirmPassword'
								placeholder='Confirm password'
								ref={register({ required: true })}
							/>
							<p>
								Forget your password?{' '}
								<Link to='/reset-password'>Reset password</Link>
							</p>
							<button onClick={handleSignUp} className='form-button'>
								Sign Up
							</button>
							<p>
								Already have an account? <Link to='/sign-in'>Sign In</Link>
							</p>
						</>
					)}
				</form>
			</div>
		</div>
	);
};

export default SignUp;
