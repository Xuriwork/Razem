import { Auth } from 'aws-amplify';
import Loading from '../components/Loading';
import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const isAuthed = !!user;

	useEffect(() => {
		Auth.currentAuthenticatedUser()
		.then((user) => {
			setUser(user);
			setLoading(false);
		})
		.catch(() => {
			setUser(null);
			setLoading(false);
		});
	}, []);

	if (loading) return <Loading />;

	return (
		<AuthContext.Provider value={{ user, isAuthed, setUser, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
