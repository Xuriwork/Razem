import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
	const { isAuthed } = useAuth();

	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthed ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: '/sign-in' }} />
				)
			}
		/>
	);
};

export const PublicRoute = ({ component: Component, restricted, ...rest }) => {
	const { isAuthed } = useAuth();

	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthed && restricted ? <Redirect to='/' /> : <Component {...props} />
			}
		/>
	);
};
