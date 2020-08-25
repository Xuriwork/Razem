import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import App from './App';
import Auth0ProviderWithHistory from './utils/auth0-provider-with-history';
import * as serviceWorker from './serviceWorker';
import './index.css';
import '@aws-amplify/ui/dist/style.css';

Amplify.configure(config);

ReactDOM.render(
	<React.StrictMode>
		<Auth0ProviderWithHistory>
			<App />
		</Auth0ProviderWithHistory>
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.unregister();
