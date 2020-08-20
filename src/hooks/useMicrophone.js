import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk';
import enhanceAgoraRTC from 'agoran-awe';

const enhancedAgoraRTC = enhanceAgoraRTC(AgoraRTC);

const fakeClient = enhancedAgoraRTC.createClient({
	mode: 'live',
	codec: 'vp8',
});

const useMicrophone = (client = fakeClient) => {
	const [microphoneList, setMicrophoneList] = useState([]);

	useEffect(() => {
		let mounted = true;

		const onChange = () => {
			if (!client) {
				return;
			}
			client
				.getRecordingDevices()
				.then((microphones) => {
					if (mounted) {
						setMicrophoneList(microphones);
					}
				})
				.catch(() => {});
		};

		client && client.on('recording-device-changed', onChange);
		onChange();

		return () => {
			mounted = false;
			client.gatewayClient.removeEventListener('recordingDeviceChanged', onChange);
		};
	}, [client]);

	return microphoneList;
};

export default useMicrophone;
