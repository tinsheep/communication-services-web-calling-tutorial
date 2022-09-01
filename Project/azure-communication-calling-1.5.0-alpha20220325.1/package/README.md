# Azure Communication Calling client library for JavaScript

Get started with Azure Communication Services by using the Communication Services calling client library to add voice and video calling to your app.
Read more about Azure Communication Services [here](https://docs.microsoft.com/azure/communication-services/overview)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens)
- Optional: Complete the quickstart to [add voice calling to your application](https://docs.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/getting-started-with-calling)

## Install the SDK

Use the `npm install` command to install the Azure Communication Services calling and common SDKs for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```
The Communication Services Web Calling SDK must be used through `https`. For local development, use `localhost` or local 'file:'

## Documentation support
- [Submit issues/bugs on github](https://github.com/Azure/Communication/issues)
- [Sample Applications](https://docs.microsoft.com/azure/communication-services/samples/overview)
- [API Reference](https://docs.microsoft.com/javascript/api/azure-communication-services/@azure/communication-calling/?view=azure-communication-services-js&preserve-view=true)

## Models
### Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                | Description                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `CallClient`                        | The main entry point to the Calling SDK.                                                                                                 |
| `AzureCommunicationTokenCredential` | Implements the `CommunicationTokenCredential` interface, which is used to instantiate `callAgent`.                                       |
| `CallAgent`                         | Used to start and manage calls.                                                                                                          |
| `DeviceManager`                     | Used to manage media devices.                                                                                                            |
| `Call`                              | Used for representing a Call                                                                                                              |
| `LocalVideoStream`                  | Used for creating a local video stream for a camera device on the local system.                                                          |
| `RemoteParticipant`                 | Used for representing a remote participant in the Call                                                                                   |
| `RemoteVideoStream`                 | Used for representing a remote video stream from a Remote Participant.                                                                  |

> [!NOTE]
> The Calling SDK object instances shouldn't be considered to be a plain JavaScript objects. These are actual instances of various classes and therefore can't be serialized.

### Events model
Each object in the calling sdk, has properties and collections values of which, change throughout the lifetime of the object.
Use the `on()` method to subscribe to objects' events, and use the `off()` method to unsubscribe from objects' events.

#### Properties
- You must inspect their initial values, and subscribe to the `'<property>Changed'` event for future value updates.

#### Collections
- You must inspect their initial values, and subscribe to the `'<collection>Updated'` event for future value updates.
- The `'<collection>Updated'` event's payload, has an `added` array that contains values that were added to the collection.
- The `'<collection>Updated'` event's payload also has a `removed` array that contains values that were removed from the collection.

```js
/************************************************
 * Example quickstart code - client.js          *
 * Convert this script into a                   *
 * bundle.js that your html index               *
 * page can use.                                *
 ************************************************/

// Make sure to install the necessary dependencies
const { CallClient, VideoStreamRenderer, LocalVideoStream } = require('@azure/communication-calling');
const { AzureCommunicationTokenCredential } = require('@azure/communication-common');
const { AzureLogger, setLogLevel } = require("@azure/logger");
// Set the log level and output
setLogLevel('verbose');
AzureLogger.log = (...args) => {
    console.log(...args);
};

// Calling web sdk objects
let callAgent;
let deviceManager;
let call;
let incomingCall;
let localVideoStream;
let localVideoStreamRenderer;

// UI widgets
let userAccessToken = document.getElementById('user-access-token');
let calleeAcsUserId = document.getElementById('callee-acs-user-id');
let initializeCallAgentButton = document.getElementById('initialize-call-agent');
let startCallButton = document.getElementById('start-call-button');
let acceptCallButton = document.getElementById('accept-call-button');
let startVideoButton = document.getElementById('start-video-button');
let stopVideoButton = document.getElementById('stop-video-button');
let connectedLabel = document.getElementById('connectedLabel');
let remoteVideoContainer = document.getElementById('remoteVideoContainer');
let localVideoContainer = document.getElementById('localVideoContainer');

// Instantiate the Call Agent.
initializeCallAgentButton.onclick = async () => {
    try {
        const callClient = new CallClient(); 
        tokenCredential = new AzureCommunicationTokenCredential(userAccessToken.value.trim());
        callAgent = await callClient.createCallAgent(tokenCredential)
        // Set up a camera device to use.
        deviceManager = await callClient.getDeviceManager();
        await deviceManager.askDevicePermission({ video: true });
        await deviceManager.askDevicePermission({ audio: true });
        // Listen for an incoming call to accept.
        callAgent.on('incomingCall', async (args) => {
            try {
                incomingCall = args.incomingCall;
                acceptCallButton.disabled = false;
                startCallButton.disabled = true;
            } catch (error) {
                console.error(error);
            }
        });

        startCallButton.disabled = false;
        initializeCallAgentButton.disabled = true;
    } catch(error) {
        console.error(error);
    }
}

// Start an out-going call.
startCallButton.onclick = async () => {
    try {
        const localVideoStream = await createLocalVideoStream();
        const videoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
        call = callAgent.startCall([{ communicationUserId: calleeAcsUserId.value.trim() }], { videoOptions });
        // Subscribe to the call's properties and events.
        subscribeToCall(call);
    } catch (error) {
        console.error(error);
    }
}

// Accept the incoming call.
acceptCallButton.onclick = async () => {
    try {
        const localVideoStream = await createLocalVideoStream();
        const videoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
        call = await incomingCall.accept({ videoOptions });
        // Subscribe to the call's properties and events.
        subscribeToCall(call);
    } catch (error) {
        console.error(error);
    }
}

// Subscribe to a call obj.
// Listen for property changes and collection udpates.
subscribeToCall = (call) => {
    try {
        // Inspect the initial call.id value.
        console.log(`Call Id: ${call.id}`);
        //Subsribe to call's 'idChanged' event for value changes.
        call.on('idChanged', () => {
            console.log(`Call Id changed: ${call.id}`); 
        });

        // Inspect the initial call.state value.
        console.log(`Call state: ${call.state}`);
        // Subscribe to call's 'stateChanged' event for value changes.
        call.on('stateChanged', async () => {
            console.log(`Call state changed: ${call.state}`);
            if(call.state === 'Connected') {
                connectedLabel.hidden = false;
                acceptCallButton.disabled = true;
                startCallButton.disabled = true;
                startVideoButton.disabled = false;
                stopVideoButton.disabled = false
            } else if (call.state === 'Disconnected') {
                connectedLabel.hidden = true;
                startCallButton.disabled = false;
                console.log(`Call ended, call end reason={code=${call.callEndReason.code}, subCode=${call.callEndReason.subCode}}`);
            }   
        });

        call.localVideoStreams.forEach(async (lvs) => {
            localVideoStream = lvs;
            await displayLocalVideoStream();
        });
        call.on('localVideoStreamsUpdated', e => {
            e.added.forEach(async (lvs) => {
                localVideoStream = lvs;
                await displayLocalVideoStream();
            });
            e.removed.forEach(lvs => {
               removeLocalVideoStream();
            });
        });
        
        // Inspect the call's current remote participants and subscribe to them.
        call.remoteParticipants.forEach(remoteParticipant => {
            subscribeToRemoteParticipant(remoteParticipant);
        })
        // Subscribe to the call's 'remoteParticipantsUpdated' event to be
        // notified when new participants are added to the call or removed from the call.
        call.on('remoteParticipantsUpdated', e => {
            // Subscribe to new remote participants that are added to the call.
            e.added.forEach(remoteParticipant => {
                subscribeToRemoteParticipant(remoteParticipant)
            });
            // Unsubscribe from participants that are removed from the call
            e.removed.forEach(remoteParticipant => {
                console.log('Remote participant removed from the call.');
            })
        });
    } catch (error) {
        console.error(error);
    }
}

// Subscribe to a remote participant obj.
// Listen for property changes and collection udpates.
subscribeToRemoteParticipant = (remoteParticipant) => {
    try {
        // Inspect the initial remoteParticipant.state value.
        console.log(`Remote participant state: ${remoteParticipant.state}`);
        // Subscribe to remoteParticipant's 'stateChanged' event for value changes.
        remoteParticipant.on('stateChanged', () => {
            console.log(`Remote participant state changed: ${remoteParticipant.state}`);
        });

        // Inspect the remoteParticipants's current videoStreams and subscribe to them.
        remoteParticipant.videoStreams.forEach(remoteVideoStream => {
            subscribeToRemoteVideoStream(remoteVideoStream)
        });
        // Subscribe to the remoteParticipant's 'videoStreamsUpdated' event to be
        // notified when the remoteParticiapant adds new videoStreams and removes video streams.
        remoteParticipant.on('videoStreamsUpdated', e => {
            // Subscribe to new remote participant's video streams that were added.
            e.added.forEach(remoteVideoStream => {
                subscribeToRemoteVideoStream(remoteVideoStream)
            });
            // Unsubscribe from remote participant's video streams that were removed.
            e.removed.forEach(remoteVideoStream => {
                console.log('Remote participant video stream was removed.');
            })
        });
    } catch (error) {
        console.error(error);
    }
}

// Subscribe to a remote participant's remote video stream obj.
// Listen for property changes and collection udpates.
// When their remote video streams become available, display them in the UI.
subscribeToRemoteVideoStream = async (remoteVideoStream) => {
    // Create a video stream renderer for the remote video stream.
    let videoStreamRenderer = new VideoStreamRenderer(remoteVideoStream);
    let view;
    const renderVideo = async () => {
        try {
            // Create a renderer view for the remote video stream.
            view = await videoStreamRenderer.createView();
            // Attach the renderer view to the UI.
            remoteVideoContainer.hidden = false;
            remoteVideoContainer.appendChild(view.target);
        } catch (e) {
            console.warn(`Failed to createView, reason=${e.message}, code=${e.code}`);
        }	
    }
    
    remoteVideoStream.on('isAvailableChanged', async () => {
        // Participant has switched video on.
        if (remoteVideoStream.isAvailable) {
            await renderVideo();

        // Participant has switched video off.
        } else {
            if (view) {
                view.dispose();
                view = undefined;
            }
        }
    });

    // Participant has video on initially.
    if (remoteVideoStream.isAvailable) {
        await renderVideo();
    }
}

// Start your local video stream.
// This will send your local video stream to remote participants so they can view it.
startVideoButton.onclick = async () => {
    try {
        const localVideoStream = await createLocalVideoStream();
        await call.startVideo(localVideoStream);
    } catch (error) {
        console.error(error);
    }
}

// Stop your local video stream.
// This will stop your local video stream from being sent to remote participants.
stopVideoButton.onclick = async () => {
    try {
        await call.stopVideo(localVideoStream);
    } catch (error) {
        console.error(error);
    }
}

// Create a local video stream for your camera device
createLocalVideoStream = async () => {
    const camera = (await deviceManager.getCameras())[0];
    if (camera) {
        return new LocalVideoStream(camera);
    } else {
        console.error(`No camera device found on the system`);
    }
}

// Display your local video stream preview in your UI
displayLocalVideoStream = async () => {
    try {
        localVideoStreamRenderer = new VideoStreamRenderer(localVideoStream);
        const view = await localVideoStreamRenderer.createView();
        localVideoContainer.hidden = false;
        localVideoContainer.appendChild(view.target);
    } catch (error) {
        console.error(error);
    } 
}

// Remove your local video stream preview from your UI
removeLocalVideoStream = async() => {
    try {
        localVideoStreamRenderer.dispose();
        localVideoContainer.hidden = true;
    } catch (error) {
        console.error(error);
    } 
}
```

An HTML example code that can use a bundle generated from the above JavaScript example (`client.js`).
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <title>Azure Communication Services - Calling Web SDK</title>
    </head>
    <body>
        <h4>Azure Communication Services - Calling Web SDK</h4>
        <input id="user-access-token"
            type="text"
            placeholder="User access token"
            style="margin-bottom:1em; width: 500px;"/>
        <button id="initialize-call-agent" type="button">Initialize Call Agent</button>
        <br>
        <br>
        <input id="callee-acs-user-id"
            type="text"
            placeholder="Enter callee's ACS user identity in format: '8:acs:resourceId_userId'"
            style="margin-bottom:1em; width: 500px; display: block;"/>
        <button id="start-call-button" type="button" disabled="true">Start Call</button>
        <button id="accept-call-button" type="button" disabled="true">Accept Call</button>
        <button id="start-video-button" type="button" disabled="true">Start Video</button>
        <button id="stop-video-button" type="button" disabled="true">Stop Video</button>
        <br>
        <br>
        <div id="connectedLabel" style="color: #13bb13;" hidden>Call is connected!</div>
        <br>
        <div id="remoteVideoContainer" style="width: 40%;" hidden>Remote participants' video streams:</div>
        <br>
        <div id="localVideoContainer" style="width: 30%;" hidden>Local video stream:</div>
        <!-- points to the bundle generated from client.js -->
        <script src="./bundle.js"></script>
    </body>
</html>
```
Note that after starting call, joining call, or accepting call, you can also use
the callAgent's 'callsUpdated' event to be notified of the new Call object and
start subscribing to it.
```js
callAgent.on('callsUpdated', e => {
    // New Call object is added to callAgent.calls collection
    e.added.forEach(call => {
        call.remoteParticipants.forEach(remoteParticipant => {
            subscribeToRemoteParticipant(remoteParticipant);
        })
        call.on('remoteParticipantsUpdated', e => {
            e.added.forEach(remoteParticipant => {
                subscribeToRemoteParticipant(remoteParticipant)
            });
            e.removed.forEach(remoteParticipant => {
                console.log('Remote participant removed from the call.');
            })
        });
    })
})
```

## Initialize a CallClient instance, create a CallAgent instance, and access deviceManager

Create a new `CallClient` instance. You can configure it with custom options like a Logger instance.

When you have a `CallClient` instance, you can create a `CallAgent` instance by calling the `createCallAgent` method on the `CallClient` instance. This method asynchronously returns a `CallAgent` instance object.

The `createCallAgent` method uses `CommunicationTokenCredential` as an argument. It accepts a [user access token](../../../access-tokens.md).

You can use the `getDeviceManager` method on the `CallClient` instance to access `deviceManager`.

```js
const { CallClient } = require('@azure/communication-calling');
const { AzureCommunicationTokenCredential} = require('@azure/communication-common');
const { AzureLogger, setLogLevel } = require("@azure/logger");
// Set the logger's log level
setLogLevel('verbose');
// Redirect log output to wherever desired. To console, file, buffer, REST API, etc...
AzureLogger.log = (...args) => {
    console.log(...args); // Redirect log output to console
};
const userToken = '<USER_TOKEN>';
callClient = new CallClient(options);
const tokenCredential = new AzureCommunicationTokenCredential(userToken);
const callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'optional ACS user name'});
/***
 * Display name field maximum char length is 256. 
***/
const deviceManager = await callClient.getDeviceManager()
```

## Place a call

To create and start a call, use one of the APIs on `callAgent` and provide a user that you've created through the Communication Services identity SDK.

Call creation and start are synchronous. The `call` instance allows you to subscribe to call events.

> [!IMPORTANT]
> If `callAgent` is initialized with `MicrosoftTeamsUser`, then `thread ID` is required when placing a call.

### Place a 1:n call to a user or PSTN

To call another Communication Services user, use the `startCall` method on `callAgent` and pass the recipient's `CommunicationUserIdentifier` that you [created with the Communication Services administration library](../../../access-tokens.md).

For a 1:1 call to a user, use the following code:

```js
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const oneToOneCall = callAgent.startCall([userCallee]);
```

For a 1:1 call to a Microsoft Teams user, use the following code:

> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

```js
const msTeamsCallee = { microsoftTeamsUserId: '<MICROSOFT_TEAMS_USER_ID>' }
const oneToOneCall = callAgent.startCall([msTeamsCallee], {threadId: '<THREAD_ID>'});
```

To place a call to a public switched telephone network (PSTN), use the `startCall` method on `callAgent` and pass the recipient's `PhoneNumberIdentifier`. Your Communication Services resource must be configured to allow PSTN calling.

When you call a PSTN number, specify your alternate caller ID. An alternate caller ID is a phone number (based on the E.164 standard) that identifies the caller in a PSTN call. It's the phone number the call recipient sees for an incoming call.

> [!NOTE]
> PSTN calling is currently in private preview. For access, [apply to the early adopter program](https://aka.ms/ACS-EarlyAdopter).

For a 1:1 call to a PSTN number, use the following code:
```js
const pstnCalee = { phoneNumber: '<ACS_USER_ID>' }
const alternateCallerId = {alternateCallerId: '<ALTERNATE_CALLER_ID>'};
const oneToOneCall = callAgent.startCall([pstnCallee], {alternateCallerId});
```

For a 1:n call to a user and a PSTN number, use the following code:

```js
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const pstnCallee = { phoneNumber: '<PHONE_NUMBER>'};
const alternateCallerId = {alternateCallerId: '<ALTERNATE_CALLER_ID>'};
const groupCall = callAgent.startCall([userCallee, pstnCallee], {alternateCallerId});

```

### Place a 1:1 call with video camera

> [!IMPORTANT]
> There can currently be no more than one outgoing local video stream.

To place a video call, you have to  enumerate local cameras by using the `getCameras()` method in `deviceManager`.

After you select a camera, use it to construct a `LocalVideoStream` instance. Pass it within `videoOptions` as an item within the `localVideoStream` array to the `startCall` method.

```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
localVideoStream = new LocalVideoStream(camera);
const placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};
const userCallee = { communicationUserId: '<ACS_USER_ID>' }
const call = callAgent.startCall([userCallee], placeCallOptions);
```

- When your call connects, it automatically starts sending a video stream from the selected camera to the other participant. This also applies to the `Call.Accept()` video options and `CallAgent.join()` video options.
- To get the size of the local video stream, please use MediaStats Call feature API (MediaStats.stats.videoSendFrameWidthSent and MediaStats.stats.videoSendFrameHeightSent).



### Join a group call

> [!NOTE]
> The `groupId` parameter is considered system metadata and may be used by Microsoft for operations that are required to run the system. Don't include personal data in the `groupId` value. Microsoft doesn't treat this parameter as personal data and its content may be visible to Microsoft employees or stored long-term.
>
> The `groupId` parameter requires data to be in GUID format. We recommend using randomly generated GUIDs that aren't considered personal data in your systems.
>

To start a new group call or join an ongoing group call, use the `join` method and pass an object with a `groupId` property. The `groupId` value has to be a GUID.

```js

const context = { groupId: '<GUID>'}
const call = callAgent.join(context);

```

### Join a Teams Meeting
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

To join a Teams meeting, use the `join` method and pass a meeting link or a meeting's coordinates.

Join by using a meeting link:

```js
const locator = { meetingLink: '<MEETING_LINK>'}
const call = callAgent.join(locator);
```

Join by using meeting coordinates:

```js
const locator = {
    threadId: <thread id>,
    organizerId: <organizer id>,
    tenantId: <tenant id>,
    messageId: <message id>
}
const call = callAgent.join(locator);
```

### Join a rooms call
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK.

To join a rooms call, use the `join` method and pass an object with room coordinate as `roomId` property.

```js
const context = { roomId: '<ROOMID>' }
const call = callAgent.join(context);
```

## Receive an incoming call

The `callAgent` instance emits an `incomingCall` event when the logged-in identity receives an incoming call. To listen to this event, subscribe by using one of these options:

```js
const incomingCallHander = async (args: { incomingCall: IncomingCall }) => {
    const incomingCall = args.incomingCall;	

    // Get incoming call ID
    var incomingCallId = incomingCall.id

    // Get information about this Call. This API is provided as a preview for developers
    // and may change based on feedback that we receive. Do not use this API in a production environment.
    // To use this api please use 'beta' release of ACS Calling Web SDK
    var callInfo = incomingCall.info;

    // Get information about caller
    var callerInfo = incomingCall.callerInfo

    // Accept the call
    var call = await incomingCall.accept();

    // Reject the call
    incomingCall.reject();

    // Subscribe to callEnded event and get the call end reason
     incomingCall.on('callEnded', args => {
        console.log(args.callEndReason);
    });

    // callEndReason is also a property of IncomingCall
    var callEndReason = incomingCall.callEndReason;
};
callAgentInstance.on('incomingCall', incomingCallHander);
```

The `incomingCall` event includes an `incomingCall` instance that you can accept or reject.

When starting/joining/accepting a call with video on, if the specified video camera device is being used by another process or if it is disabled in the system, the call will start with video off, and a cameraStartFailed: true call diagnostic will be raised.

See Call Diagnostics section to see how to handle this call diagnostic.

## Manage calls

During a call, you can access call properties and manage video and audio settings.

### Check call properties

Get the unique ID (string) for a call:

   ```js
    const callId: string = call.id;
   ```
Get information about the call:
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK
   ```js
   const callInfo = call.info;
   ```

Learn about other participants in the call by inspecting the `remoteParticipants` collection on the 'call' instance:

   ```js
   const remoteParticipants = call.remoteParticipants;
   ```

Identify the caller of an incoming call:

   ```js
   const callerIdentity = call.callerInfo.identifier;
   ```

   `identifier` is one of the `CommunicationIdentifier` types.

Get the state of a call:

   ```js
   const callState = call.state;
   ```

   This returns a string representing the current state of a call:

  - `None`: Initial call state.
  - `Connecting`: Initial transition state when a call is placed or accepted.
  - `Ringing`: For an outgoing call, indicates that a call is ringing for remote participants. It is `Incoming` on their side.
  - `EarlyMedia`: Indicates a state in which an announcement is played before the call is connected.
  - `Connected`: Indicates that the call is connected.
  - `LocalHold`: Indicates that the call is put on hold by a local participant. No media is flowing between the local endpoint and remote participants.
  - `RemoteHold`: Indicates that the call was put on hold by remote participant. No media is flowing between the local endpoint and remote participants.
  - `InLobby`: Indicates that user is in lobby.
  - `Disconnecting`: Transition state before the call goes to a `Disconnected` state.
  - `Disconnected`: Final call state. If the network connection is lost, the state changes to `Disconnected` after two minutes.

Find out why a call ended by inspecting the `callEndReason` property:

   ```js
   const callEndReason = call.callEndReason;
   const callEndReasonCode = callEndReason.code // (number) code associated with the reason
   const callEndReasonSubCode = callEndReason.subCode // (number) subCode associated with the reason
   ```

Learn if the current call is incoming or outgoing by inspecting the `direction` property. It returns `CallDirection`.

  ```js
   const isIncoming = call.direction == 'Incoming';
   const isOutgoing = call.direction == 'Outgoing';
   ```

Check if the current microphone is muted. It returns `Boolean`.

   ```js
   const muted = call.isMuted;
   ```

Find out if the screen sharing stream is being sent from a given endpoint by checking the `isScreenSharingOn` property. It returns `Boolean`.

   ```js
   const isScreenSharingOn = call.isScreenSharingOn;
   ```

Inspect active video streams by checking the `localVideoStreams` collection. It returns `LocalVideoStream` objects.

   ```js
   const localVideoStreams = call.localVideoStreams;
   ```




### Mute and unmute

To mute or unmute the local endpoint, you can use the `mute` and `unmute` asynchronous APIs:

```js

//mute local device
await call.mute();

//unmute local device
await call.unmute();

```

### Start and stop sending local video

To start a video, you have to enumerate cameras using the `getCameras` method on the `deviceManager` object. Then create a new instance of `LocalVideoStream` with the desired camera and then pass the `LocalVideoStream` object into the `startVideo` method:

```js
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
const localVideoStream = new LocalVideoStream(camera);
await call.startVideo(localVideoStream);
```

After you successfully start sending video, a `LocalVideoStream` instance is added to the `localVideoStreams` collection on a call instance.

```js
call.localVideoStreams[0] === localVideoStream;
```

To stop local video, pass the `localVideoStream` instance that's available in the `localVideoStreams` collection:

```js
await call.stopVideo(localVideoStream);
// or
await call.stopVideo(call.localVideoStreams[0]);
```

You can switch to a different camera device while a video is sending by invoking `switchSource` on a `localVideoStream` instance:

```js
const cameras = await callClient.getDeviceManager().getCameras();
const camera = cameras[1];
localVideoStream.switchSource(camera);
```
#### Notes
- If the specified video device is being used by another process, or if it is disabled in the system (See Call Diagnostics section to see how to handle call diagnostics.):
   - While in a call, if your video is off and you start video using the call.startVideo() api, this API will throw with a SourceUnavailableError and a cameraStartFiled: true call diagnostic will be raised.
   - A call to the localVideoStream.switchSource() api will cause a cameraStartFailed: true call diagnostic to be raised.
- There are 4 apis in which you can pass a localVideoStream instance to start video in a call, callAgent.startCall() api, callAgent.join() api, call.accept() api, and call.startVideo() api. To the call.stopVideo() api, you must pass that same localVideoStream instance that you passed in those 4 apis.
- To get the size of the local video stream, please use MediaStats Call feature API (MediaStats.stats.videoSendFrameWidthSent and MediaStats.stats.videoSendFrameHeightSent).

## Manage remote participants

All remote participants are represented by `RemoteParticipant` type and available through `remoteParticipants` collection on a call instance.

### List the participants in a call

The `remoteParticipants` collection returns a list of remote participants in a call:

```js
call.remoteParticipants; // [remoteParticipant, remoteParticipant....]
```

### Access remote participant properties

Remote participants have a set of associated properties and collections:

- `CommunicationIdentifier`: Get the identifier for a remote participant. Identity is one of the `CommunicationIdentifier` types:

  ```js
  const identifier = remoteParticipant.identifier;
  ```

  It can be one of the following `CommunicationIdentifier` types:

  - `{ communicationUserId: '<ACS_USER_ID'> }`: Object representing the ACS user.
  - `{ phoneNumber: '<E.164>' }`: Object representing the phone number in E.164 format.
  - `{ microsoftTeamsUserId: '<TEAMS_USER_ID>', isAnonymous?: boolean; cloud?: "public" | "dod" | "gcch" }`: Object representing the Teams user.
  - `{ id: string }`: object representing identifier that doesn't fit any of the other identifier types

- `state`: Get the state of a remote participant.

  ```js
  const state = remoteParticipant.state;
  ```

  The state can be:

  - `Idle`: Initial state.
  - `Connecting`: Transition state while a participant is connecting to the call.
  - `Ringing`: Participant is ringing.
  - `Connected`: Participant is connected to the call.
  - `Hold`: Participant is on hold.
  - `EarlyMedia`: Announcement that plays before a participant connects to the call.
  - `InLobby`: Indicates that remote participant is in lobby.
  - `Disconnected`: Final state. The participant is disconnected from the call. If the remote participant loses their network connectivity, their state changes to `Disconnected` after two minutes.

- `callEndReason`: To learn why a participant left the call, check the `callEndReason` property:

  ```js
  const callEndReason = remoteParticipant.callEndReason;
  const callEndReasonCode = callEndReason.code // (number) code associated with the reason
  const callEndReasonSubCode = callEndReason.subCode // (number) subCode associated with the reason
  ```

- `isMuted` status: To find out if a remote participant is muted, check the `isMuted` property. It returns `Boolean`.

  ```js
  const isMuted = remoteParticipant.isMuted;
  ```

- `isSpeaking` status: To find out if a remote participant is speaking, check the `isSpeaking` property. It returns `Boolean`.

  ```js
  const isSpeaking = remoteParticipant.isSpeaking;
  ```

- `videoStreams`: To inspect all video streams that a given participant is sending in this call, check the `videoStreams` collection. It contains `RemoteVideoStream` objects.

  ```js
  const videoStreams = remoteParticipant.videoStreams; // [RemoteVideoStream, ...]
  ```
- `displayName`: To get display name for this remote participant, inspect `displayName` property it return string. 

  ```js
  const displayName = remoteParticipant.displayName;
  ```

### Add a participant to a call

To add a participant (either a user or a phone number) to a call, you can use `addParticipant`. Provide one of the `Identifier` types. It synchronously returns the `remoteParticipant` instance. The `remoteParticipantsUpdated` event from Call is raised when a participant is successfully added to the call.

```js
const userIdentifier = { communicationUserId: '<ACS_USER_ID>' };
const pstnIdentifier = { phoneNumber: '<PHONE_NUMBER>' }
const remoteParticipant = call.addParticipant(userIdentifier);
const remoteParticipant = call.addParticipant(pstnIdentifier, {alternateCallerId: '<ALTERNATE_CALLER_ID>'});
```

> [!IMPORTANT]
> If `callAgent` is initialized with `MicrosoftTeamsUser`, then `thread ID` is required when adding a participant.

```js
const userIdentifier = { communicationUserId: '<ACS_USER_ID>' };
const teamsIdentifier = { microsoftTeamsUserId: '<TEAMS_USER_ID>'};
const pstnIdentifier = { phoneNumber: '<PHONE_NUMBER>' }
const remoteParticipant = call.addParticipant(userIdentifier, {threadId: '<THREAD_ID>'});
const remoteParticipant = call.addParticipant(teamsIdentifier, {threadId: '<THREAD_ID>'});
const remoteParticipant = call.addParticipant(pstnIdentifier, {alternateCallerId: '<ALTERNATE_CALLER_ID>', threadId: '<THREAD_ID>'});
```


### Remove a participant from a call

To remove a participant (either a user or a phone number) from a call, you can invoke `removeParticipant`. You have to pass one of the `Identifier` types. This method resolves asynchronously after the participant is removed from the call. The participant is also removed from the `remoteParticipants` collection.

```js
const userIdentifier = { communicationUserId: '<ACS_USER_ID>' };
const pstnIdentifier = { phoneNumber: '<PHONE_NUMBER>' }
await call.removeParticipant(userIdentifier);
await call.removeParticipant(pstnIdentifier);
```

## Render remote participant video streams

To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:

```js
const remoteVideoStream: RemoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType: MediaStreamType = remoteVideoStream.mediaStreamType;
```

To render `RemoteVideoStream`, you have to subscribe to it's `isAvailableChanged` event. If the `isAvailable` property changes to `true`, a remote participant is sending a stream. After that happens, create a new instance of `VideoStreamRenderer`, and then create a new `VideoStreamRendererView` instance by using the asynchronous `createView` method.  You can then attach `view.target` to any UI element.

Whenever availability of a remote stream changes you can choose to destroy the whole `VideoStreamRenderer`, a specific `VideoStreamRendererView`
or keep them, but this will result in displaying blank video frame.

```js
subscribeToRemoteVideoStream = async (remoteVideoStream) => {
    // Create a video stream renderer for the remote video stream.
    let videoStreamRenderer = new VideoStreamRenderer(remoteVideoStream);
    let view;
    const remoteVideoContainer = document.getElementById('remoteVideoContainer');
    const renderVideo = async () => {
        try {
            // Create a renderer view for the remote video stream.
            view = await videoStreamRenderer.createView();
            // Attach the renderer view to the UI.
            remoteVideoContainer.appendChild(view.target);
        } catch (e) {
            console.warn(`Failed to createView, reason=${e.message}, code=${e.code}`);
        }	
    }
    remoteVideoStream.on('isAvailableChanged', async () => {
        // Participant has switched video on.
        if (remoteVideoStream.isAvailable) {
            await renderVideo();

        // Participant has switched video off.
        } else {
            if (view) {
                view.dispose();
                view = undefined;
            }
        }
    });

    // Participant has video on initially.
    if (remoteVideoStream.isAvailable) {
        await renderVideo();
    }
}
```

### Remote video stream properties

Remote video streams have the following properties:

- `id`: The ID of a remote video stream.

  ```js
  const id: number = remoteVideoStream.id;
  ```

- `mediaStreamType`: Can be `Video` or `ScreenSharing`.

  ```js
  const type: MediaStreamType = remoteVideoStream.mediaStreamType;
  ```

- `isAvailable`: Whether a remote participant endpoint is actively sending a stream.

  ```js
  const type: boolean = remoteVideoStream.isAvailable;
  ```

- `size`: The stream size. The higher the stream size, the better the video quality.

  ```js
  const type: StreamSize = remoteVideoStream.size;
  ```

### VideoStreamRenderer methods and properties
Create a `VideoStreamRendererView` instance that can be attached in the application UI to render the remote video stream, use asynchronous `createView()` method, it resolves when stream is ready to render and returns an object with `target` property that represents `video` element that can be appended anywhere in the DOM tree

  ```js
  await videoStreamRenderer.createView()
  ```

Dispose of `videoStreamRenderer` and all associated `VideoStreamRendererView` instances:

  ```js
  videoStreamRenderer.dispose()
  ```

### VideoStreamRendererView methods and properties

When you create a `VideoStreamRendererView`, you can specify the `scalingMode` and `isMirrored` properties. `scalingMode` can be `Stretch`, `Crop`, or `Fit`. If `isMirrored` is specified, the rendered stream is flipped vertically.

```js
const videoStreamRendererView: VideoStreamRendererView = await videoStreamRenderer.createView({ scalingMode, isMirrored });
```

Every `VideoStreamRendererView` instance has a `target` property that represents the rendering surface. Attach this property in the application UI:

```js
htmlElement.appendChild(view.target);
```

You can update `scalingMode` by invoking the `updateScalingMode` method:

```js
view.updateScalingMode('Crop')
```

## Device management

In `deviceManager`, you can enumerate local devices that can transmit your audio and video streams in a call. You can also use it to request permission to access the local device's microphones and cameras.

You can access `deviceManager` by calling the `callClient.getDeviceManager()` method:

```js
const deviceManager = await callClient.getDeviceManager();
```

### Get local devices

To access local devices, you can use enumeration methods on `deviceManager`. Enumeration is an asynchronous action

```js
//  Get a list of available video devices for use.
const localCameras = await deviceManager.getCameras(); // [VideoDeviceInfo, VideoDeviceInfo...]

// Get a list of available microphone devices for use.
const localMicrophones = await deviceManager.getMicrophones(); // [AudioDeviceInfo, AudioDeviceInfo...]

// Get a list of available speaker devices for use.
const localSpeakers = await deviceManager.getSpeakers(); // [AudioDeviceInfo, AudioDeviceInfo...]
```

### Set the default microphone and speaker

In `deviceManager`, you can set a default device that you'll use to start a call. If client defaults aren't set, Communication Services uses operating system defaults.

```js
// Get the microphone device that is being used.
const defaultMicrophone = deviceManager.selectedMicrophone;

// Set the microphone device to use.
await deviceManager.selectMicrophone(localMicrophones[0]);

// Get the speaker device that is being used.
const defaultSpeaker = deviceManager.selectedSpeaker;

// Set the speaker device to use.
await deviceManager.selectSpeaker(localSpeakers[0]);
```

### Local camera preview

You can use `deviceManager` and `VideoStreamRenderer` to begin rendering streams from your local camera. This stream won't be sent to other participants; it's a local preview feed.

```js
const cameras = await deviceManager.getCameras();
const camera = cameras[0];
const localCameraStream = new LocalVideoStream(camera);
const videoStreamRenderer = new VideoStreamRenderer(localCameraStream);
const view = await videoStreamRenderer.createView();
htmlElement.appendChild(view.target);

```

### Request permission to camera and microphone

Prompt a user to grant camera and/or microphone permissions:

```js
const result = await deviceManager.askDevicePermission({audio: true, video: true});
```

This resolves with an object that indicates whether `audio` and `video` permissions were granted:

```js
console.log(result.audio);
console.log(result.video);
```
#### Notes
- The 'videoDevicesUpdated' event fires when video devices are plugging-in/unplugged.
- The 'audioDevicesUpdated' event fires when audio devices are plugged
- When the DeviceManager is created, at first it does not know about any devices if permissions have not been granted yet and so initially it's device lists are empty. If we then call the DeviceManager.askPermission() API, the user is prompted for device access and if the user clicks on 'allow' to grant the access, then the device manager will learn about the devices on the system, update it's device lists and emit the 'audioDevicesUpdated' and 'videoDevicesUpdated' events. Lets say we then refresh the page and create device manager, the device manager will be able to learn about devices because user has already previously granted access, and so it will initially it will have it's device lists filled and it will not emit 'audioDevicesUpdated' nor 'videoDevicesUpdated' events.
- Speaker enumeration/selection is not supported on Android Cheome, iOS Safari, nor macOS Safari.

## Call Feature Extensions

### Record calls
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Call recording is an extended feature of the core `Call` API. You first need to obtain the recording feature API object:

```js
const callRecordingFeature = call.feature(Features.Recording);
```

Then, to check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingFeature`. It returns `Boolean`.

```js
const isRecordingActive = callRecordingFeature.isRecordingActive;
```

You can also subscribe to recording changes:

```js
const isRecordingActiveChangedHandler = () => {
    console.log(callRecordingFeature.isRecordingActive);
};

callRecordingFeature.on('isRecordingActiveChanged', isRecordingActiveChangedHandler);

```

### Transfer calls
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Call transfer is an extended feature of the core `Call` API. You first need to get the transfer feature API object:

```js
const callTransferFeature = call.feature(Features.Transfer);
```

Call transfers involve three parties:

- *Transferor*: The person who initiates the transfer request.
- *Transferee*: The person who is being transferred.
- *Transfer target*: The person or the call is being transferred to.

Transfers follow these steps:

1. There's already a connected call between the *transferor* and the *transferee*. The *transferor* decides to transfer the call from the *transferee* to the *transfer target*.
1. The *transferor* calls the `transfer` API.
1. The *transferee* decides whether to `accept` or `reject` the transfer request to the *transfer target* by using a `transferRequested` event.
1. The *transfer target* receives an incoming call only if the *transferee* accepts the transfer request.

To transfer a current call to a user, you can use the `transfer` API. `transfer` takes the optional `transferCallOptions`, which allows you to set a `disableForwardingAndUnanswered` flag:

- `disableForwardingAndUnanswered = false`: If the *transfer target* doesn't answer the transfer call, the transfer follows the *transfer target* forwarding and unanswered settings.
- `disableForwardingAndUnanswered = true`: If the *transfer target* doesn't answer the transfer call, the transfer attempt ends.

```js
// transfer target can be an ACS user
const id = { communicationUserId: <ACS_USER_ID> };
```

```js
// call transfer to participant API
const transfer = callTransferFeature.transfer({targetParticipant: id});
```

To transfer a current call to a call, you can use the `transfer` API. `transfer` to a call doesn't take any parameters.

```js
// call transfer to call API
const transfer = callTransferFeature.transfer({targetCall: anotherCall});
```

The `transfer` API allows you to subscribe to `transferStateChanged` and `transferRequested` events. A `transferRequested` event comes from a `call` instance; a `transferStateChanged` event and transfer `state` and `error` come from a `transfer` instance.

```js
// transfer state
const transferState = transfer.state; // None | Transferring | Transferred | Failed

// to check the transfer failure reason
const transferError = transfer.error; // transfer error code that describes the failure if a transfer request failed
```

The *transferee* can accept or reject the transfer request initiated by the *transferor* in the `transferRequested` event by using `accept()` or `reject()` in `transferRequestedEventArgs`. You can access `targetParticipant` information and `accept` or `reject` methods in `transferRequestedEventArgs`.

```js
// Transferee to accept the transfer request
callTransferFeature.on('transferRequested', args => {
    args.accept();
});

// Transferee to reject the transfer request
callTransferFeature.on('transferRequested', args => {
    args.reject();
});

```
### Captioning a Call
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use the 'beta' release of ACS Calling Web SDK

Call captions are an extended feature of the core `Call` API. You first need to obtain the Captions feature API object:

```js
const callCaptionsFeature = call.feature(Features.Captions);
```

The Captions flow works as following:

1. There is already a connected call between two or more users.
1. A user subscribes to the `captionsReceived` event with a handler function.
1. That user then invokes `startCaptions` with their desired options.
1. After `startCaptions`, captions will be fed to the registered handler, but only for the user who turned on captions.
1. Any user who subscribes to the `captionsReceived` event after this point will receive the same caption data to their specified handler

To do so in code would look something like the following...

```js
/* ------- User A's Code ------- */
const callCaptionsFeature = call.feature(Features.Captions);
const captionsHandler = (data: CaptionsInfo) => { /* USER CODE HERE - E.G RENDER TO DOM */ };
callCaptionsFeature.on('captionsReceived', captionsHandler);
await callCaptionsFeature.startCaptions({ language: 'en-us' });

/* ------- User B's Code ------- */
const callCaptionsFeature = call.feature(Features.Captions);
const captionsHandler = (data: CaptionsInfo) => { /* USER CODE HERE - E.G RENDER TO DOM */ };
callCaptionsFeature.on('captionsReceived', captionsHandler);
```

NOTES:
- If `startCaptions` were to be called more than once for a call, the second invocation will result in a "no-op", regardless if the language selected is different or not.

#### Deconstructing the CaptionsHandler and CaptionsInfo types

```js
type CaptionsHandler = (data: CaptionsInfo) => void;

interface CaptionsInfo = {
    speaker: ParticipantInfo, // The information of the call participant who spoke the captioned text.
    timestamp: Date, // Timestamp of when the captioned words were initially spoken.
    text: string, // The caption text.
    resultType: ResultType, // The state in which this caption data can be classified. 
    language: string, // The language that the spoken words were interpretted as. Corresponds to the language specified in startCaptions / selectLanguage.
};
```

The above types are used to handle incoming caption data. 

One thing to note is that since captions are real time data, the interpretted text changes as one speaks.
For example, if one says "I love jazz music", the registered handler may receive a number of caption data packets as that phrase is spoken...

```js
{
	text: "I love",
	resultType: ResultType.Intermediate,
	...
}
```
```js
{
	text: "I love jersey muse",
	resultType: ResultType.Intermediate,
	...
}
```
```js
{
	text: "I love jazz music.",
	resultType: ResultType.Final,
	...
}
```

Notice how in the last packet, the `resultType` field is of type `Final`.
This indicates that the system is now confident that the speaker for that set of captions was saying "I love jazz music." 

#### A note about the specified language

For language, the Captions API exports a property called `availableLanguages` which is an array of locale codes that are accepted by `startCaptions` or `selectLanguage`.
The list may differ per Azure region, hence it's non-explicit nature. By default, 'en-us' will always be accepted. 

If after captions have started one would like to change the chosen language, they could execute the `selectLanguage` method like...

```js
await callCaptionsFeature.selectLanguage('es-es');
```

__HOWEVER__, updating the language affects __ALL__ users.

So...
1. If user A and user B both have captions started on their machines with the language set to English
1. User B calls `selectLanguage('es-es')`
1. Both User B and User A will start receiving Spanish captions.

#### Properties and Events

```js
export type CaptionsPropertyChangedEventType = 'isCaptionsActiveChanged'
```

The above (outlined below) are the event types that the call Captions API emits and that can be subscribed to via `callCaptionsFeature.on('<CaptionsPropertyChangedEventType>');`
- 'isCaptionsActiveChanged': whenever the caption process starts or stops for the call.

Said events also correlate to the exposed properties on the API as shown below.

```js
const isCaptionsActive = callCaptionsFeature.isCaptionsActive;
```

### Dominant speakers of a call
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Dominant speakers for a call is an extended feature of the core `Call` API and allows you to obtain a list of the active speakers in the call. 

This is a ranked list, where the first element in the list represents the last active speaker on the call and so on.

In order to obtain the dominant speakers in a call, you first need to obtain the call dominant speakers feature API object:

```js
const callDominantSpeakersFeature = call.feature(Features.CallDominantSpeakers);
```

Then, obtain the list of the dominant speakers by calling `dominantSpeakers`. This has a type of `DominantSpeakersInfo`, which has the following members:

- `speakersList` contains the list of the ranked dominant speakers in the call. These are represented by their participant ID.
- `timestamp` is the latest update time for the dominant speakers in the call.

```js
let dominantSpeakers: DominantSpeakersInfo = callDominantSpeakersFeature.dominantSpeakers;
```
Also, you can subscribe to the `dominantSpeakersChanged` event to know when the dominant speakers list has changed

```js
const dominantSpeakersChangedHandler = () => {
    // Get the most up to date list of dominant speakers
    let dominantSpeakers = callDominantSpeakersFeature.dominantSpeakers;
};
callDominantSpeakersFeature.on('dominantSpeakersChanged', dominantSpeakersChangedHandler);
``` 
#### Handle the Dominant Speaker's video streams

Your application can use the `DominantSpeakers` feature to render one or more of dominant speaker's video streams, and keep updating UI whenever dominant speaker list updates. This can be achieved with the following code example.

```js
// RemoteParticipant obj representation of the dominant speaker
let dominantRemoteParticipant: RemoteParticipant;
// It is recommended to use a map to keep track of a stream's associated renderer
let streamRenderersMap: new Map<RemoteVideoStream, VideoStreamRenderer>();

function getRemoteParticipantForDominantSpeaker(dominantSpeakerIdentifier) {
    let dominantRemoteParticipant: RemoteParticipant;
    switch(dominantSpeakerIdentifier.kind) {
        case 'communicationUser': {
            dominantRemoteParticipant = currentCall.remoteParticipants.find(rm => {
                return (rm.identifier as CommunicationUserIdentifier).communicationUserId === dominantSpeakerIdentifier.communicationUserId
            });
            break;
        }
        case 'microsoftTeamsUser': {
            dominantRemoteParticipant = currentCall.remoteParticipants.find(rm => {
                return (rm.identifier as MicrosoftTeamsUserIdentifier).microsoftTeamsUserId === dominantSpeakerIdentifier.microsoftTeamsUserId
            });
            break;
        }
        case 'unknown': {
            dominantRemoteParticipant = currentCall.remoteParticipants.find(rm => {
                return (rm.identifier as UnknownIdentifier).id === dominantSpeakerIdentifier.id
            });
            break;
        }
    }
    return dominantRemoteParticipant;
}
// Handler function for when the dominant speaker changes
const dominantSpeakersChangedHandler = async () => {
    // Get the new dominant speaker's identifier
    const newDominantSpeakerIdentifier = currentCall.feature(Features.DominantSpeakers).dominantSpeakers.speakersList[0];

     if (newDominantSpeakerIdentifier) {
        // Get the remote participant object that matches newDominantSpeakerIdentifier
        const newDominantRemoteParticipant = getRemoteParticipantForDominantSpeaker(newDominantSpeakerIdentifier);

        // Create the new dominant speaker's stream renderers
        const streamViews = [];
        for (const stream of newDominantRemoteParticipant.videoStreams) {
            if (stream.isAvailable && !streamRenderersMap.get(stream)) {
                const renderer = new VideoStreamRenderer(stream);
                streamRenderersMap.set(stream, renderer);
                const view = await videoStreamRenderer.createView();
                streamViews.push(view);
            }
        }

        // Remove the old dominant speaker's video streams by disposing of their associated renderers
        if (dominantRemoteParticipant) {
            for (const stream of dominantRemoteParticipant.videoStreams) {
                const renderer = streamRenderersMap.get(stream);
                if (renderer) {
                    streamRenderersMap.delete(stream);
                    renderer.dispose();
                }
            }
        }

        // Set the new dominant remote participant obj
        dominantRemoteParticipant = newDominantRemoteParticipant

        // Render the new dominant remote participant's streams
        for (const view of streamViewsToRender) {
            htmlElement.appendChild(view.target);
        }
     }
};

// When call is disconnected, set the dominant speaker to undefined
currentCall.on('stateChanged', () => {
    if (currentCall === 'Disconnected') {
        dominantRemoteParticipant = undefined;
    }
});

const dominantSpeakerIdentifier = currentCall.feature(Features.DominantSpeakers).dominantSpeakers.speakersList[0];
dominantRemoteParticipant = getRemoteParticipantForDominantSpeaker(dominantSpeakerIdentifier);
currentCall.feature(Features.DominantSpeakers).on('dominantSpeakersChanged', dominantSpeakersChangedHandler);

subscribeToRemoteVideoStream = async (stream: RemoteVideoStream, participant: RemoteParticipant) {
    let renderer: VideoStreamRenderer;

    const displayVideo = async () => {
        renderer = new VideoStreamRenderer(stream);
        streamRenderersMap.set(stream, renderer);
        const view = await renderer.createView();
        htmlElement.appendChild(view.target);
    }

    stream.on('isAvailableChanged', async () => {
        if (dominantRemoteParticipant !== participant) {
            return;
        }

        renderer = streamRenderersMap.get(stream);
        if (stream.isAvailable && !renderer) {
            await displayVideo();
        } else {
            streamRenderersMap.delete(stream);
            renderer.dispose();
        }
    });

    if (dominantRemoteParticipant !== participant) {
        return;
    }

    renderer = streamRenderersMap.get(stream);
    if (stream.isAvailable && !renderer) {
        await displayVideo();
    }
}
```
### Call diagnostics
Call diagnostics is an extended feature of the core `Call` API and allows you to diagnose an active call.

```js
const userFacingDiagnostics = call.feature(Features.UserFacingDiagnostics);
```

The following users facing diagnostics are available:

| Type    | Name                           | Description                                                     | Possible values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Use cases                                                                       |
| ------- | ------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Network | noNetwork                      | There is no network available.                                  | - Set to `True` when a call fails to start because there is no network available. <br/> - Set to `False` when there are ICE candidates present.                                                                                                                                                                                                                                                                                                                                                      | Device is not connected to a network.                                           |
| Network | networkRelaysNotReachable      | Problems with a network.                                        | - Set to `True` when the network has some constraint that is not allowing you to reach ACS relays. <br/> - Set to `False` upon making a new call.                                                                                                                                                                                                                                                                                                                                                    | During a call when the WiFi signal goes on and off.                             |  |
| Network | networkReconnect               | The connection was lost and we are reconnecting to the network. | - Set to `Poor` when the media transport connectivity is lost                                                                                                                                 <br/> - Set to `Bad` when the network is disconnected <br/> - Set to `Good` when a new session is connected.                                                                                                                                                                                           | Low bandwidth, no internet                                                      |
| Network | networkReceiveQuality          | An indicator regarding incoming stream quality.                 | - Set to `Bad` when there is a severe problem with receiving the stream. quality                                                                                                                           <br/> - Set to `Poor` when there is a mild problem with receiving the stream. quality                                                                                                                           <br/> - Set to `Good` when there is no problem with receiving the stream. | Low bandwidth                                                                   |
| Media   | noSpeakerDevicesEnumerated     | There is no audio output device (speaker) on the user's system. | - Set to `True` when there are no speaker devices on the system, and speaker selection is supported. <br/> - Set to `False` when there is a least 1 speaker device on the system, and speaker selection is supported.                                                                                                                                                                                                                                                                                | All speakers are unplugged                                                      |
| Media   | speakingWhileMicrophoneIsMuted | Speaking while being on mute.                                   | - Set to `True` when local microphone is muted and the local user is speaking. <br/> - Set to `False` when local user either stops speaking, or un-mutes the microphone. <br/> * Note: as of today, this isn't supported on safari yet, as the audio level samples are taken from webrtc. stats.                                                                                                                                                                                                     | During a call, mute your microphone and speak into it.                          |
| Media   | noMicrophoneDevicesEnumerated  | No audio capture devices (microphone) on the user's system      | - Set to `True` when there are no microphone devices on the system. <br/> - Set to `False` when there is at least 1 microphone device on the system.                                                                                                                                                                                                                                                                                                                                                 | All microphones are unplugged during the call.                                  |
| Media   | cameraFreeze                   | Camera stops producing frames for more than 5 seconds.          | - Set to `True` when the local video stream is frozen. This means the remote side is seeing your video frozen on their screen or it means that the remote participants are not rendering your video on their screen. <br/> - Set to `False` when the freeze ends and users can see your video as per normal.                                                                                                                                                                                         | The Camera was lost during the call or bad network caused the camera to freeze. |
| Media   | cameraStartFailed              | Generic camera failure.                                         | - Set to `True` when we fail to start sending local video because the camera device may have been disabled in the system or it is being used by another process~. <br/> - Set to `False` when selected camera device successfully sends local video. again.                                                                                                                                                                                                                                           | Camera failures                                                                 |
| Media   | cameraStartTimedOut            | Common scenario where camera is in bad state.                   | - Set to `True` when camera device times out to start sending video stream. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                                                                                                                                                                                                                                                                                                 | Camera failures                                                                 |
| Media   | microphoneNotFunctioning       | Microphone is not functioning.                                  | - Set to `True` when we fail to start sending local audio stream because the microphone device may have been disabled in the system or it is being used by another process. This UFD takes about 10 seconds to get raised. <br/> - Set to `False` when microphone starts to successfully send audio stream again.                                                                                                                                                                                    | No microphones available, microphone access disabled in a system                |
| Media   | microphoneMuteUnexpectedly     | Microphone is muted                                             | - Set to `True` when microphone enters muted state unexpectedly. <br/> - Set to `False` when microphone starts to successfully send audio stream                                                                                                                                                                                                                                                                                                                                                     | Microphone is muted from the system.                                            |
| Media   | screenshareRecordingDisabled   | System screen sharing was denied by preferences in Settings.     | - Set to `True` when screen sharing permission is denied by system settings (sharing). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.Chrome.                                                                                                                                                                                                                                                                                               | Screen recording is disabled in Settings.                                       |
| Media   | microphonePermissionDenied     | There is low volume from device or it’s almost silent on macOS. | - Set to `True` when audio permission is denied by system settings (audio). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.                                                                                                                                                                                                                                                                                                                | Microphone permissions are disabled in the Settings.                            |
| Media   | cameraPermissionDenied         | Camera permissions were denied in settings.                     | - Set to `True` when camera permission is denied by system settings (video). <br/> - Set to `False` on successful stream acquisition. <br> Note: This diagnostic only works on macOS Chrome                                                                                                                                                                                                                                                                                                          | Camera permissions are disabled in the settings.                                |

- Subscribe to the `diagnosticChanged` event to monitor when any call diagnostic changes.
```js
/**
 *  Each diagnostic has the following data:
 * - diagnostic is the type of diagnostic, e.g. NetworkSendQuality, DeviceSpeakWhileMuted, etc...
 * - value is DiagnosticQuality or DiagnosticFlag:
 *     - DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
 *     - DiagnosticFlag = true | false.
 * - valueType = 'DiagnosticQuality' | 'DiagnosticFlag'
 */
const diagnosticChangedListener = (diagnosticInfo: NetworkDiagnosticChangedEventArgs | MediaDiagnosticChangedEventArgs) => {
    console.log(`Diagnostic changed: ` +
        `Diagnostic: ${diagnosticInfo.diagnostic}` +
        `Value: ${diagnosticInfo.value}` + 
        `Value type: ${diagnosticInfo.valueType}` +

    if (diagnosticInfo.valueType === 'DiagnosticQuality') {
        if (diagnosticInfo.value === DiagnosticQuality.Bad) {
            console.error(`${diagnosticInfo.diagnostic} is bad quality`);

        } else if (diagnosticInfo.value === DiagnosticQuality.Poor) {
            console.error(`${diagnosticInfo.diagnostic} is poor quality`);
        }

    } else if (diagnosticInfo.valueType === 'DiagnosticFlag') {
        if (diagnosticInfo.value === true) {
            console.error(`${diagnosticInfo.diagnostic}`);
        }
    }
};

UserFacingDiagnostics.network.on('diagnosticChanged', diagnosticChangedListener);
UserFacingDiagnostics.media.on('diagnosticChanged', diagnosticChangedListener);
```

- Get the latest call diagnostic values that were raised. If a diagnostic is undefined, that is because it was never raised.
```js
const latestNetworkDiagnostics = UserFacingDiagnostics.network.getLatest();
	
console.log(`noNetwork: ${latestNetworkDiagnostics.noNetwork.value}, ` +
    `value type = ${latestNetworkDiagnostics.noNetwork.valueType}`);
			
console.log(`networkReconnect: ${latestNetworkDiagnostics.networkReconnect.value}, ` +
    `value type = ${latestNetworkDiagnostics.networkReconnect.valueType}`);
			
console.log(`networkReceiveQuality: ${latestNetworkDiagnostics.networkReceiveQuality.value}, ` +
    `value type = ${latestNetworkDiagnostics.networkReceiveQuality.valueType}`);


const latestMediaDiagnostics = UserFacingDiagnostics.media.getLatest();
	
console.log(`speakingWhileMicrophoneIsMuted: ${latestMediaDiagnostics.speakingWhileMicrophoneIsMuted.value}, ` +
    `value type = ${latestMediaDiagnostics.speakingWhileMicrophoneIsMuted.valueType}`);
			
console.log(`cameraStartFailed: ${latestMediaDiagnostics.cameraStartFailed.value}, ` +
    `value type = ${latestMediaDiagnostics.cameraStartFailed.valueType}`);
			
console.log(`microphoneNotFunctioning: ${latestMediaDiagnostics.microphoneNotFunctioning.value}, ` +
    `value type = ${latestMediaDiagnostics.microphoneNotFunctioning.valueType}`);
```

### Media Stats for ongoing call
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Media stats is an extended feature of the core `Call` API. You first need to obtain the MediaStats feature API object:

```js
const mediaStatsFeature = call.feature(Features.MediaStats);
```

Then, define `mediaStatsCollectorOptions` of type `MediaStatsCollectorOptions` if you want control over intervals. Otherwise SDK will use defaults.

```js
const mediaStatsCollectorOptions: SDK.MediaStatsCollectorOptions = {
    aggregationInterval: 2,
    dataPointsPerAggregation: 20
};
```

Then, get media stats colector by invoking `startCollector` method of `mediaStatsApi` with optional `mediaStatsSubscriptionOptions`.

```js
const mediaStatsCollector = mediaStatsFeature.startCollector(mediaStatsSubscriptionOptions);
```

After getting media stats collector, you will receive `mediaStatsEmitted` event with stats every `aggregationIntervalMs * dataPointsPerAggregation` milliseconds.

```js
mediaStatsCollector.on('mediaStatsEmitted', (mediaStats) => {
    console.log('media stats:', mediaStats.stats);
    console.log('media stats collectionInterval:', mediaStats.collectionInterval);
    console.log('media stats aggregationInterval:', mediaStats.aggregationInterval);
});
```

To dispose media stats collector, invoke `dispose` method of `mediaStatsCollector`.

```js
mediaStatsCollector.dispose();
```

To dispose all collectors, invoke `disposeAllCollectors` method of `mediaStatsApi`.

```js
mediaStatsFeature.disposeAllCollectors();
```

### Debug Info
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Local participant ID is an extended feature of the core `CallClient` API to get unique identifier ID for the current participant in the call and unique identifier for the last call that happened in a GUID format, also it provides a zipped log snapshot for debugging purposes with unique identifier for each snapshot:

```js
cosnt debugInfoFeature = callClient.feature(SDK.Features.DebugInfo);
const localParticipantId = debugInfoFeature.localParticipantId;
const callId = debugInfoFeature.callId;
const debugInfo = debugInfoFeature.dumpDebugInfo();
const debugInfoZippedDump = debugInfo.dump;
const debugInfoDumpId = debugInfo.dumpId; 
```

## Releasing resources
1. How to properly release resources when a call is finished:
    - When the call is finished our SDK will terminate the signaling & media sessions leaving you with an instance of the call that holds the last state of it. You can still check callEndReason. If your app won't hold the reference to the Call instance then the JavaScript garbage collector will clean up everything so in terms of memory consumption your app should go back to initial state from before the call.
2. Which resource types are long-lived (app lifetime) vs. short-lived (call lifetime):
    - The following are considered to be "long-lived" resources - you can create them and keep referenced for a long time, they are very light in terms of resource(memory) consumption so won't impact perf:
        - CallClient
        - CallAgent
        - DeviceManager
    - The following are considered to be "short-lived" resources and are the ones that are playing some role in the call itself, emit events to the application, or are interacting with local media devices. These will consume more cpu&memory, but once call ends - SDK will clean up all the state and release resource:
        - Call - since it's the one holding the actual state of the call (both signaling and media).
        - RemoteParticipants - Represent the remote participants in the call.
        - VideoStreamRenderer with it's VideoStreamRendererViews - handling video rendering.