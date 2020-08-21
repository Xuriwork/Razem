import React, { useReducer, useState } from 'react';
import AgoraRTC from '../utils/AgoraEnchancer';
import { Notyf } from 'notyf';
import useMediaStream from '../hooks/useMediaStream';
import useMicrophone from '../hooks/useMicrophone';
import Stream from './Stream';

const notyf = new Notyf({
	position: { x: 'right', y: 'top' },
	duration: 2000,
	types: [
		{
			type: 'info',
			background: '#40514e',
		},
	],
});

const defaultState = {
	appId: 'ea06c96d0a2945029805b5b5f7c7984b',
	channel: '',
	uid: '',
	token: undefined,
	cameraId: '',
	microphoneId: '',
	mode: 'rtc',
	codec: 'h264',
};

const reducer = (state = defaultState, action) => {
	switch (action.type) {
		default:
			return state;
		case 'setAppId':
			return {
				...state,
				appId: action.value,
			};
		case 'setChannel':
			return {
				...state,
				channel: action.value,
			};
		case 'setUid':
			return {
				...state,
				uid: action.value,
			};
		case 'setToken':
			return {
				...state,
				token: action.value,
			};
		case 'setMicrophone':
			return {
				...state,
				microphoneId: action.value,
			};
		case 'setMode':
			return {
				...state,
				mode: action.value,
			};
		case 'setCodec':
			return {
				...state,
				codec: action.value,
			};
	}
};

const Home = () => {
	const [isJoined, setisJoined] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [agoraClient, setClient] = useState(undefined);

	const [state, dispatch] = useReducer(reducer, defaultState);

	const microphoneList = useMicrophone();
	let [localStream, remoteStreamList] = useMediaStream(agoraClient);

	const update = (actionType) => (e) => {
		return dispatch({
			type: actionType,
			value: e.target.value,
		});
	};
	
	const handleJoin = async () => {
		const client = AgoraRTC.createClient({
			mode: state.mode,
			codec: state.codec,
		});
		setClient(client);
		setIsLoading(true);
		try {
			const uid = isNaN(Number(state.uid)) ? null : Number(state.uid);
			await client.init(state.appId);
			await client.join(state.token, state.channel, uid);

			const stream = AgoraRTC.createStream({
				streamID: uid || 12345,
				video: false,
				audio: true,
				screen: false,
			});

			await stream.init();
			await client.publish(stream);

			setisJoined(true);
			notyf.success(`Joined channel ${state.channel}`);
		} catch (error) {
			notyf.error(`Failed to join, ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const leave = async () => {
		setIsLoading(true);
		try {
			if (localStream) {
				localStream.close();
				agoraClient.unpublish(localStream);
			}
			await agoraClient.leave();
			setisJoined(false);
			notyf.open({ type: 'info', message: 'Left channel' });
		} catch (error) {
			notyf.error(`Failed to leave, ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const JoinLeaveButton = () => {
		return (
			<button
				color={isJoined ? 'secondary' : 'primary'}
				onClick={isJoined ? leave : handleJoin}
				disabled={isLoading}
			>
				{isJoined ? 'Leave' : 'Join'}
			</button>
		);
	};

	return (
		<div className='home-component'>
			<div className='join-channel-container'>
				<div className='input-container'>
					<label>Channel Name</label>
					<input
						type='text'
						name='channelName'
						onChange={update('setChannel')}
					/>
				</div>
				<h4>Microphone</h4>
				<select onChange={update('setMicrophone')}>
					{microphoneList.map((item) => (
						<option key={item.deviceId} value={item.deviceId}>
							{item.label}
						</option>
					))}
				</select>
				<JoinLeaveButton onClick={handleJoin}>Join</JoinLeaveButton>
			</div>
			<Stream localStream={localStream} remoteStreamList={remoteStreamList} />
		</div>
	);
};

export default Home;
