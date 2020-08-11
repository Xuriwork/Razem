import AgoraRTC from 'agora-rtc-sdk';

const rtc = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    params: {}
};

const option = {
    appID: "ea06c96d0a2945029805b5b5f7c7984b",
    channel: "Channel name",
    uid: null,
    token: null
};

rtc.client = AgoraRTC.createClient({mode: 'rtc', codec: "h264"});

rtc.client.init(option.appID, () => {
    console.log("AgoraRTC client initialized");
}, (error) => console.log("AgoraRTC client init failed", error));

export default rtc;