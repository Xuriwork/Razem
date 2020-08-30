import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { withRouter } from 'react-router-dom';
import MoreIcon from '../assets/images/icons/more.svg';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ history }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { isAuthed, setUser } = useAuth();

	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

	const handleSignOut = async () => {
		await Auth.signOut()
			.then(() => {
				setUser(null);
				history.push('/sign-in');
			})
			.catch((error) => console.error('Error signing out: ', error));
	};

	return (
		<nav className='navbar'>
			<div className='more-button-container'>
				<button className='more-button' onClick={toggleDropdown}>
					<img src={MoreIcon} alt='' />
				</button>
			</div>
			{dropdownOpen && (
				<div className='more-items-dropdown'>
					<ul>
						{isAuthed && <li onClick={handleSignOut}>Sign Out</li>}
					</ul>
				</div>
			)}
		</nav>
	);
};

export default withRouter(Navbar);
