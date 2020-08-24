import React from 'react';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const SignIn = () => {
	const { register, handleSubmit } = useForm();

	const handleSignIn = handleSubmit(async (data) => {
        console.log(data);
        const { username, password } = data;

        try {
            const user = await Auth.signIn(username, password);
            console.log(user);
        } catch (error) {
            console.log('error signing in', error);
        }
	});

	return (
		<div className='sign-in-component'>
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
					<p>
						Forget your password? <Link to='/reset-password'>Reset password</Link>
					</p>
					<button onClick={handleSignIn}>Sign In</button>
					<p>
						No account? <Link to='/sign-up'>Create account</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignIn;