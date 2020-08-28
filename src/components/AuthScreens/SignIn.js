import React from 'react';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import notyf from '../../utils/notyf';

const SignIn = ({ history }) => {
	const { register, handleSubmit, errors } = useForm();

	const handleSignIn = handleSubmit(async (data) => {
        const { email, password } = data;
		Auth.signIn(email, password).then(() => history.push('/'))
		.catch((error) => {
			if (error.code === "UserNotConfirmedException") {
				Auth.resendSignUp(email);
				setTimeout(() => history.push({ pathname: '/confirm-account', state: { email } }), 2500);
				return notyf.open({ 
					type: 'info', 
					message: 'User not confirmed, redirecting...' 
				});
			}
			notyf.error(error);
			console.error('Sign in error: ', error);
		});
	});

	return (
		<div className='sign-in-component'>
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
						ref={register({ required: { value: true, message: 'This field is required' } })}
					/>
					<span className='form-input-error'>{errors.password && errors.password.message}</span>
					<p style={{ marginTop: '5px', marginBottom: '6px' }}>
						Forgot password? <Link to='/forgot-password'>Reset password</Link>
					</p>
					<button onClick={handleSignIn} className='form-button'>Sign In</button>
					<p>
						New user? <Link to='/sign-up'>Create account</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
