/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import notyf from '../../utils/notyf';

const SignUp = ({ history }) => {
	const [focus, setFocus] = useState(false);
	const { register, handleSubmit, watch, errors } = useForm();
	const password = watch('password') || '';
	const passwordRequirements = {
		hasLowercaseLetters: password.search(/[a-z]/) > -1,
		hasUppercaseLetters: password.search(/[A-Z]/) > -1,
		hasNumbers: password.search(/\d/) > -1,
		hasSpecialCharacters: password.search(/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/) > -1,
		isAtLeast8Characters: password.length >= 8,
	};

	const handleInputFocus = () => setFocus(true);
	const handleInputBlur = () => setFocus(false);

	const handleSignUp = async (data) => {
		const { email, password } = data;

		const meetsAllRequirements = Object.keys(passwordRequirements).every((key) => passwordRequirements[key]);

		if (!meetsAllRequirements) return;

		await Auth.signUp({
			username: email,
			email,
			password,
			attributes: {
				email,
			},
		})
		.then(() => {
			setTimeout(() => history.push({ pathname: '/confirm-account', state: { email } }), 2500);
			notyf.open({
				type: 'info',
				message: 'User not confirmed, redirecting...',
			});
		})
		.catch((error) => {
			console.error('Error at Sign up:', error);
			notyf.error(error);
		});
	};

	return (
		<div className='sign-up-component'>
			<div>
				<form>
					<label>Email *</label>
					<input
						type='email'
						name='email'
						placeholder='Enter your email'
						ref={register({
							required: { value: true, message: 'This field is required' },
						})}
					/>
					<span className='form-input-error'>
						{errors.email && errors.email.message}
					</span>
					<label>Password *</label>
					<div className='password-input-container'>
						<input
							type='password'
							name='password'
							placeholder='Enter your password'
							onFocus={handleInputFocus}
							onBlur={handleInputBlur}
							ref={register({
								required: { value: true, message: 'This field is required' },
								pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*].{8,}$/,
							})}
						/>
						{focus && (
							<div className='password-requirments'>
								<h4>Password must meet the following requirements:</h4>
								<ul>
									<li>
										{passwordRequirements.hasLowercaseLetters ? (
											<span
												role='img'
												aria-label='Password contains at least one lowercase letter'
											>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label='Password does not contain any lowercase letters'
											>
												❌
											</span>
										)}{' '}
										At least <strong>one lowercase</strong>
									</li>
									<li>
										{passwordRequirements.hasUppercaseLetters ? (
											<span
												role='img'
												aria-label='Password has uppercase letter'
											>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label='Password does not contain any uppercase letters'
											>
												❌
											</span>
										)}{' '}
										At least <strong>one uppercase letter</strong>
									</li>
									<li>
										{passwordRequirements.hasNumbers ? (
											<span role='img' aria-label='Password contains a number'>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label='Password does not contain any numbers'
											>
												❌
											</span>
										)}{' '}
										At least <strong>one number</strong>
									</li>
									<li>
										{passwordRequirements.hasSpecialCharacters ? (
											<span
												role='img'
												aria-label='Password contains special characters'
											>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label="Password doesn't contain any special characters"
											>
												❌
											</span>
										)}{' '}
										At least <strong>one special characters</strong>
									</li>
									<li>
										{passwordRequirements.isAtLeast8Characters ? (
											<span
												role='img'
												aria-label='Password is at least 8 characters'
											>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label="Password isn't at least 8 characters"
											>
												❌
											</span>
										)}{' '}
										At least <strong>8 characters</strong>
									</li>
								</ul>
							</div>
						)}
					</div>
					<span className='form-input-error'>
						{errors.password && errors.password.message}
					</span>
					<label>Confirm Password *</label>
					<input
						type='password'
						name='confirm_password'
						placeholder='Confirm password'
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						ref={register({
							required: { value: true, message: 'This field is required' },
							validate: (value) =>
								value === watch('password') || 'Passwords do not match',
						})}
					/>
					<span className='form-input-error'>
						{errors.confirm_password && errors.confirm_password.message}
					</span>
					<button onClick={handleSubmit(handleSignUp)} className='form-button'>
						Sign Up
					</button>
					<p>
						Already have an account? <Link to='/sign-in'>Sign In</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
