import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute = ({ component: Component, ...rest }) => {
	const { isAuthed } = useAuth();

	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthed ? (
					<Component auth={isAuthed} {...props} />
				) : (
					<Redirect to={{ pathname: '/' }} />
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
