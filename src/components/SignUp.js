import React from 'react';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const SignUp = () => {
	const { register, handleSubmit } = useForm();

	const handleSignUp = handleSubmit(async (data) => {
		const { email, password } = data;

		try {
			const { user } = await Auth.signUp({
				email,
				password,
			});

			console.log(user);
		} catch (error) {
			console.log('Sign up error:', error);
		}
	});

	return (
		<div className='sign-up-component'>
			<div>
				<form>
					<label>Username *</label>
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
					<button onClick={handleSignUp}>Sign Up</button>
					<p>
						Already have an account? <Link to='/sign-in'>Sign In</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
