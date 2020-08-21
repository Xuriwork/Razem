import React from 'react';
import StreamPlayer from 'agora-stream-player';

export const Stream = ({ localStream, remoteStreamList }) => {
    console.log(localStream);
    console.log(remoteStreamList);
    
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
                    className='stream-player'
				/>
			))}
		</div>
	);
};

export default Stream;