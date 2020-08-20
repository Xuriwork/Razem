import React, { useReducer, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk';
import { Notyf } from 'notyf';
import StreamPlayer from 'agora-stream-player';
import useMediaStream from '../hooks/useMediaStream';
import useMicrophone from '../hooks/useMicrophone';

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

const Video = ({ localStream, remoteStreamList }) => {
	return (
		<div>
			{localStream && (
				<StreamPlayer stream={localStream} fit='contain' label='local' />
			)}
			{remoteStreamList.map((stream) => (
				<StreamPlayer
					key={stream.getId()}
					stream={stream}
					fit='contain'
					label={stream.getId()}
				/>
			))}
		</div>
	);
};

const Home = () => {
	const [isJoined, setisJoined] = useState(false);
	const [isPublished, setIsPublished] = useState(false);
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

	// Starts the video call
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

			setIsPublished(true);
			setisJoined(true);
			notyf.success(`Joined channel ${state.channel}`);
		} catch (error) {
			notyf.error(`Failed to join, ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const publish = async () => {
		setIsLoading(true);
		try {
			if (localStream) {
				// Publish the stream to the channel.
				await agoraClient.publish(localStream);
				setIsPublished(true);
			}
			notyf.open({ type: 'info', message: 'Stream published' });
		} catch (err) {
			notyf.error(`Failed to publish, ${err}`);
		} finally {
			setIsLoading(false);
		}
	};

	const leave = async () => {
		setIsLoading(true);
		try {
			if (localStream) {
				// Closes the local stream. This de-allocates the resources and turns off the camera light
				localStream.close();
				// unpublish the stream from the client
				agoraClient.unpublish(localStream);
			}
			await agoraClient.leave();
			setIsPublished(false);
			setisJoined(false);
			notyf.open({ type: 'info', message: 'Left channel' });
		} catch (error) {
			notyf.error(`Failed to leave, ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const unpublish = () => {
		if (localStream) {
			// unpublish the stream from the client
			agoraClient.unpublish(localStream);
			setIsPublished(false);
			notyf.open({ type: 'info', message: 'Stream unpublished' });
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

	const PubUnpubButton = () => {
		return (
			<button
				onClick={isPublished ? unpublish : publish}
				variant='contained'
				disabled={!isJoined || isLoading}
			>
				{isPublished ? 'Unpublish' : 'Publish'}
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
			<Video localStream={localStream} remoteStreamList={remoteStreamList} />
		</div>
	);
};

export default Home;
