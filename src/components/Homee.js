import React, { useReducer, useState } from "react";

// Declarative Stream Player for React 
// Wrapped around native HTML video and audio tag with added Agora features
import StreamPlayer from "agora-stream-player";

import { SnackbarProvider, useSnackbar } from "notistack";

// These customs hooks let any components in the application 
// to directly use the required parameters and create clean functional components.
// useCamera hook returns a list of cameras when the hook is called
// useMicrophone hook returns a list of microphones when the hook is called
// useMediaStream hook returns localStream, a list of remote streams and 
// a contatenated list of localstream and remote streams when the hook is called
import { useCamera, useMicrophone, useMediaStream } from "./hooks";

// This is an enhanced Web SDK. The enhancement basically converts the callback syntax into promises.
// Rest of the code will use async/await syntax in conjuction with these promises.
import AgoraRTC from "./utils/AgoraEnhancer";

const defaultState = {
  appId: "",
  channel: "",
  uid: "",
  token: undefined,
  cameraId: "",
  microphoneId: "",
  mode: "rtc",
  codec: "h264"
};

const reducer = (
  state: typeof defaultState,
  action: { type: string; [propName: string]: any }
) => {
  switch (action.type) {
    default:
      return state;
    case "setAppId":
      return {
        ...state,
        appId: action.value
      };
    case "setChannel":
      return {
        ...state,
        channel: action.value
      };
    case "setUid":
      return {
        ...state,
        uid: action.value
      };
    case "setToken":
      return {
        ...state,
        token: action.value
      };
    case "setMicrophone":
      return {
        ...state,
        microphoneId: action.value
      };
    case "setMode":
      return {
        ...state,
        mode: action.value
      };
    case "setCodec":
      return {
        ...state,
        codec: action.value
      };
  }
};

function App() {
  // Declaring different states used by our application.
  const [isJoined, setisJoined] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [agoraClient, setClient] = useState(undefined)
  // const agoraClient = AgoraRTC.createClient({ mode: state.mode, codec: state.codec });

  // All hooks are called to get the necessary data
  const cameraList = useCamera();
  const microphoneList = useMicrophone();
  let [localStream, remoteStreamList, streamList] = useMediaStream(agoraClient);

  const { enqueueSnackbar } = useSnackbar();

  const update = (actionType) => (e) => {
    return dispatch({
      type: actionType,
      value: e.target.value
    });
  };

  // Starts the video call
  const join = async () => {
    // Creates a new agora client with given parameters.
    // mode can be 'rtc' for real time communications or 'live' for live broadcasting.
    const client = AgoraRTC.createClient({ mode: state.mode, codec: state.codec })
    // Loads client into the state
    setClient(client)
    setIsLoading(true);
    try {
      const uid = isNaN(Number(state.uid)) ? null : Number(state.uid);
      
      // initializes the client with appId
      await client.init(state.appId);

      // joins a channel with a token, channel, user id
      await client.join(state.token, state.channel, uid);
      
      // create a ne stream
      const stream = AgoraRTC.createStream({
        streamID: uid || 12345,
        video: false,
        audio: true,
        screen: false
      });

      // stream.setVideoProfile('480p_4')

      // Initalize the stream
      await stream.init();

      // Publish the stream to the channel.
      await client.publish(stream);

      // Set the state appropriately
      setIsPublished(true);
      setisJoined(true);
      enqueueSnackbar(`Joined channel ${state.channel}`, { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to join, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Publish function to publish the stream to Agora. No need to invoke this after join.
  // This is to be invoke only after an unpublish
  const publish = async () => {
    setIsLoading(true);
    try {
      if (localStream) {
        // Publish the stream to the channel.
        await agoraClient.publish(localStream);
        setIsPublished(true);
      }
      enqueueSnackbar("Stream published", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to publish, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Leaves the channel on invoking the function call.
  const leave = async () => {
    setIsLoading(true);
    try {
      if (localStream) {
        // Closes the local stream. This de-allocates the resources and turns off the camera light
        localStream.close();
        // unpublish the stream from the client
        agoraClient.unpublish(localStream);
      }
      // leave the channel
      await agoraClient.leave();
      setIsPublished(false);
      setisJoined(false);
      enqueueSnackbar("Left channel", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to leave, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Used to unpublish the stream.
  const unpublish = () => {
    if (localStream) {
      // unpublish the stream from the client
      agoraClient.unpublish(localStream);
      setIsPublished(false);
      enqueueSnackbar("Stream unpublished", { variant: "info" });
    }
  };

  const JoinLeaveBtn = () => {
    return (
      <button
        color={isJoined ? "secondary" : "primary"}
        onClick={isJoined ? leave : join}
        disabled={isLoading}
      >
        {isJoined ? "Leave" : "Join"}
      </button>
    );
  };

  const PubUnpubBtn = () => {
    return (
      <button
        onClick={isPublished ? unpublish : publish}
        disabled={!isJoined || isLoading}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </button>
    );
  };

  return (
    <React.Fragment>
     
      <Toolbar className={classes.divider} />
      <Container>
        <Grid container spacing={3}>
          {/* form */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <form noValidate autoComplete="off">
                  <TextField
                    required
                    value={state.appId}
                    onChange={update("setAppId")}
                    id="appId"
                    label="App ID"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    required
                    value={state.channel}
                    onChange={update("setChannel")}
                    id="channel"
                    label="Channel"
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    value={state.token}
                    onChange={update("setToken")}
                    id="token"
                    label="Token"
                    fullWidth
                    margin="normal"
                  />
                </form>
              </CardContent>
              <CardActions className={classes.buttonContainer}>
                <JoinLeaveBtn />
                <PubUnpubBtn />
              </CardActions>
            </Card>

            {/* advanced settings */}
            <ThemeProvider
              theme={createMuiTheme({
                palette: {
                  type: "dark"
                }
              })}
            >
              <ExpansionPanel className={classes.advanceSettings}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Advanced Settings</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <form noValidate autoComplete="off">
                    <TextField
                      value={state.uid}
                      id="uid"
                      onChange={update("setUid")}
                      label="UID"
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      id="cameraId"
                      value={state.cameraId}
                      onChange={update("setCamera")}
                      select
                      label="Camera"
                      helperText="Please select your camera"
                      fullWidth
                      margin="normal"
                    >
                      {cameraList.map(item => (
                        <MenuItem key={item.deviceId} value={item.deviceId}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      id="microphoneId"
                      value={state.microphoneId}
                      onChange={update("setMicrophone")}
                      select
                      label="Microphone"
                      helperText="Please select your microphone"
                      fullWidth
                      margin="normal"
                    >
                      {microphoneList.map(item => (
                        <MenuItem key={item.deviceId} value={item.deviceId}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <FormControl fullWidth component="fieldset" margin="normal">
                      <FormLabel>Mode</FormLabel>
                      <RadioGroup
                        row
                        value={state.mode}
                        onChange={update("setMode")}
                      >
                        <FormControlLabel
                          value="live"
                          control={<Radio color="primary" />}
                          label="live"
                        />
                        <FormControlLabel
                          value="rtc"
                          control={<Radio color="primary" />}
                          label="rtc"
                        />
                      </RadioGroup>
                    </FormControl>

                    <FormControl fullWidth component="fieldset" margin="normal">
                      <FormLabel>Codec</FormLabel>
                      <RadioGroup
                        row
                        value={state.codec}
                        onChange={update("setCodec")}
                      >
                        <FormControlLabel
                          value="vp8"
                          control={<Radio color="primary" />}
                          label="vp8"
                        />
                        <FormControlLabel
                          value="h264"
                          control={<Radio color="primary" />}
                          label="h264"
                        />
                      </RadioGroup>
                    </FormControl>
                  </form>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </ThemeProvider>
          </Grid>

          {/* display area */}
          <Grid item xs={12} md={8}>
            {localStream && (
              <StreamPlayer stream={localStream} fit="contain" label="local" />
            )}
            {remoteStreamList.map((stream: any) => (
              <StreamPlayer
                key={stream.getId()}
                stream={stream}
                fit="contain"
                label={stream.getId()}
              />
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}