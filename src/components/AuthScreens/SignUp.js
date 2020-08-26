import React from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import notyf from '../../utils/notyf';

const SignUp = ({ history }) => {
	const { register, handleSubmit, watch, errors } = useForm();

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
			setTimeout(
				history.push({ pathname: '/confirm-account', state: { email: email } }),
				2500
			);
			notyf.open({
				type: 'info',
				message: 'User not confirmed, redirecting...',
			});
		} catch (error) {
			console.error('Sign up error:', error);
			notyf.error(error);
		}
	});

	return (
		<div className='sign-up-component'>
			<div>
				<form>
					<label>Email *</label>
					<input
						type='email'
						name='email'
						placeholder='Enter your email'
						ref={register({ required: { value: true, message: 'This field is required' } })}
					/>
					<span className='form-input-error'>{errors.email && errors.email.message}</span>
					<label>Password *</label>
					<input
						type='password'
						name='password'
						placeholder='Enter your password'
						ref={register({
							required: { value: true, message: 'This field is required' },
							minLength: { value: 8, message: 'Password should be at least 8 characters' },
						})}
					/>
					<span className='form-input-error'>{errors.password && errors.password.message}</span>
					<label>Confirm Password *</label>
					<input
						type='password'
						name='confirm_password'
						placeholder='Confirm password'
						ref={register({
							required: { value: true, message: 'This field is required' },
							validate: (value) => value === watch('password') || 'Passwords do not match'
						})}
					/>
					<span className='form-input-error'>{errors.confirm_password && errors.confirm_password.message}</span>
					<button onClick={handleSignUp} className='form-button'>
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
