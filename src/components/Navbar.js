import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import MoreIcon from '../assets/images/icons/more.svg';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { isAuthed } = useAuth();

	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

	const handleSignOut = async () => {
		try {
			await Auth.signOut();
		} catch (error) {
			console.log('Error signing out: ', error);
		}
	};

	return (
		<nav className='navbar'>
			{isAuthed && (
				<button className='sign-out-button' onClick={handleSignOut}>
					Sign Out
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
						<li></li>
					</ul>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
