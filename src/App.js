import React from 'react';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { ProtectedRoute, PublicRoute } from './components/Routes/Routes';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ForgotPassword from './components/AuthScreens/ForgotPassword';
import ConfirmAccount from './components/AuthScreens/ConfirmAccount';
import SignIn from './components/AuthScreens/SignIn';
import SignUp from './components/AuthScreens/SignUp';
import NotFound from './components/NotFound';

import './App.scss';
import 'notyf/notyf.min.css';

const App = () => {
	return (
		<Router>
			<div className='app-component'>
				<Navbar />
				<Switch>
					<ProtectedRoute exact path='/' component={Home} />
					<PublicRoute path='/sign-up' component={SignUp} restricted={true} />
					<PublicRoute path='/sign-in' component={SignIn} restricted={true} />
					<PublicRoute path='/confirm-account' component={ConfirmAccount} restricted={true} />
					<PublicRoute path='/forgot-password' component={ForgotPassword} restricted={true} />
					<Route component={NotFound} />
				</Switch>
			</div>
		</Router>
	);
};

export default App;
