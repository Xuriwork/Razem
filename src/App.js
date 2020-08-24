import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';
import Loading from './components/Loading';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

import './App.scss';
import 'notyf/notyf.min.css';

const App = () => {
	const { isLoading } = useAuth0();

	if (isLoading) return <Loading />;

	return (
		<Router>
			<div className='app-component'>
				<Navbar />
				<Route exact path='/' component={Home} />
				<Route path='/sign-in' component={SignIn} />
				<Route path='/sign-up' component={SignUp} />
			</div>
		</Router>
	);
};

export default App;
