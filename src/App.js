import React from 'react';

import Home from './components/Home';
import Navbar from './components/Navbar';
import Loading from './components/Loading';

import './App.scss';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return <Loading />
  
  return (
		<div className='app-component'>
			<Navbar />
			<Home />
		</div>
	);
}

export default App;
