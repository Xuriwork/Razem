import React, { useState } from 'react';
import AgoraRTC from '../AgoraRTC';

const Home = () => {

	const [channelName, setChannelName] = useState('');

	const option = {
		appID: 'ea06c96d0a2945029805b5b5f7c7984b',
		channel: channelName,
		uid: null,
		token: null,
	};

	const handleOnChange = (e) => setChannelName(e.target.value);

	const handleJoinChannel = () => {
        if (!channelName.trim()) return;

		AgoraRTC.client.join(
			option.token,
			option.channel,
			option.uid,
			(uid) => {
				console.log(
					'join channel: ' + option.channel + ' success, uid: ' + uid
				);
				AgoraRTC.params.uid = uid;
			},
			(error) => {
				console.error('client join failed', error);
			}
		);
	};

	//const handleLeaveChannel = () => AgoraRTC.client.leave();

	return (
		<div className='home-component'>
			<div className='join-channel-container'>
				<div className='input-container'>
					<label>Channel Name</label>
					<input type='text' name='channelName' onChange={handleOnChange} />
				</div>
				<button onClick={handleJoinChannel}>Join</button>
			</div>
		</div>
	);
};

export default Home;
