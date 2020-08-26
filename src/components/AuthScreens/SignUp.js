import React from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import notyf from '../../utils/notyf';

const SignUp = ({ history }) => {
	const { register, handleSubmit } = useForm();

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
			history.push({ pathname: '/confirm-account', state: { email: email } });
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
				</form>
			</div>
		</div>
	);
};

export default SignUp;
