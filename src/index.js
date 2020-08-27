import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';
import { AuthProvider } from './context/AuthContext';

Amplify.configure(config);

ReactDOM.render(
	<React.StrictMode>
	<AuthProvider>
		<App />
	</AuthProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.unregister();
