import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import MoreIcon from '../assets/images/icons/more.svg';

const Navbar = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

	console.log(isAuthenticated);

	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
	
	return (
		<nav className='navbar'>
			{isAuthenticated ? (
				<button onClick={logout}>Sign Out</button>
			) : (
				<button className='sign-in-button' onClick={loginWithRedirect}>
					Sign In
				</button>
			)}
			<div className='more-button-container'>
				<button className='more-button' onClick={toggleDropdown}>
					<img src={MoreIcon} alt='' />
				</button>
			</div>
			{dropdownOpen && (
				<div className='more-items-dropdown'>
					<ul>
						<li>

						</li> 
					</ul>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
