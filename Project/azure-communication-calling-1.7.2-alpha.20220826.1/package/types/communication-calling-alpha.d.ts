import { AzureLogger } from '@azure/logger';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationUserKind } from '@azure/communication-common';
import { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { MicrosoftTeamsUserKind } from '@azure/communication-common';
import { PhoneNumberIdentifier } from '@azure/communication-common';
import { PhoneNumberKind } from '@azure/communication-common';
import { UnknownIdentifier } from '@azure/communication-common';
import { UnknownIdentifierKind } from '@azure/communication-common';

/**
 * Options for accepting an incoming call.
 * Pass video streams that will be used to accept an incoming call.
 * If videoOptions is undefined, then the incoming call will be accepted with local video off.
 * If AudioOptions is undefined, then the incoming call will be accepted with default microphone as source from device manager.
 */
export declare interface AcceptCallOptions {
    videoOptions?: VideoOptions;
    audioOptions?: AudioOptions;
}

/**
 * Accept transfer options
 * @beta
 */
export declare interface AcceptTransferOptions extends StartCallOptions {
}

/**
 * Options for adding a AddCommunicationUserOptions participant to an on-going call.
 * @beta
 */
export declare interface AddCommunicationUserOptions {
    threadId?: string;
}

/**
 * Options for adding a MicrosoftTeamsUser participant to an on-going call.
 * @beta
 */
export declare interface AddMicrosoftTeamsUserOptions {
    threadId: string;
}

/**
 * Options for adding a PSTN participant to an on-going call.
 */
export declare interface AddPhoneNumberOptions {
    /**
     * A phone number in E.164 format that will be used to represent callers identity.
     * For example, using the alternateCallerId to add a participant using PSTN, this number will
     * be used as the caller id in the PSTN call.
     */
    alternateCallerId?: PhoneNumberIdentifier;
    /**
     * thread ID is required when adding PSTN to an on-going Teams group call.
     * @beta
     */
    threadId?: string;
}

/**
 * Options for adding a Teams participant to an on-going Teams call.
 * @beta
 */
export declare interface AddTeamsParticipantOptions {
    /**
     * Thread id is required for Teams group call.
     * @beta
     */
    threadId: string;
}

/**
 * Information about a microphone or speaker device.
 */
export declare interface AudioDeviceInfo {
    /**
     * Get the name of this audio device.
     */
    readonly name: string;
    /**
     * Get Id of this audio device.
     */
    readonly id: string;
    /**
     * Is this the systems default audio device.
     */
    readonly isSystemDefault: boolean;
    /**
     * Get this audio device type.
     */
    readonly deviceType: AudioDeviceType;
}

/**
 * Type of an audio device.
 */
export declare type AudioDeviceType = 'Microphone' | 'Speaker' | 'CompositeAudioDevice';

/**
 * Audio quality diagnostics
 * @alpha
 */
export declare interface AudioInCallDiagnostics extends BaseInCallDiagnostics {
}

/**
 * Audio options provided when making an outgoing call or joining a group call.
 */
export declare interface AudioOptions {
    /**
     * Whether to start the call muted or unmuted.
     */
    muted?: boolean;
    /**
     * Audio stream to be used as the call audio
     * @beta
     */
    localAudioStreams?: LocalAudioStream[];
}

/**
 * Payload for audio source changed event.
 * @beta
 */
export declare type AudioSourceChangedEvent = (args: {
    source: LocalAudioStream;
}) => void;

/**
 * Represents the base interface for any Feature
 */
export declare interface BaseFeature extends Disposable {
    /**
     * The feature name.
     */
    readonly name: string;
}

/**
 * In Call diagnostics gathered
 * @alpha
 */
export declare interface BaseInCallDiagnostics {
    jitter: QualityGrade;
    packetLoss: QualityGrade;
    rtt: QualityGrade;
}

/**
 * Represents a Call.
 */
export declare interface Call extends CallCommon {
    /**
     * Get information about this Call.
     * @beta
     */
    readonly info: CallInfo;
    /**
     * Add a participant to this Call.
     * @param identifier - The identifier of the participant to add.
     * @returns The RemoteParticipant object associated with the successfully added participant.
     */
    addParticipant(identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier): RemoteParticipant;
    /**
     * Add a participant to this Call.
     * @param identifier - The identifier of the participant to add.
     * @param options - Additional options for managing the PSTN call. For example, setting the Caller Id phone number in a PSTN call.
     * @returns The RemoteParticipant object associated with the successfully added participant.
     */
    addParticipant(identifier: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): RemoteParticipant;
    /**
     * Add a participant to this Call.
     * @param identifier - The identifier of the participant to add.
     * @param options - Additional options for managing the call. For example, setting the Caller Id phone number in a PSTN call.
     * @returns The RemoteParticipant object associated with the successfully added participant.
     * @beta
     */
    addParticipant(identifier: CommunicationUserIdentifier, options?: AddCommunicationUserOptions): RemoteParticipant;
    /**
     * Add a participant to this Call.
     * @param identifier - The identifier of the participant to add.
     * @param options - Additional options for managing the call.
     * @returns The RemoteParticipant object associated with the successfully added participant.
     * @beta
     */
    addParticipant(identifier: MicrosoftTeamsUserIdentifier, options: AddMicrosoftTeamsUserOptions): RemoteParticipant;
    /**
     * Remove a participant from this Call.
     * @param identifier - The identifier of the participant to remove.
     */
    removeParticipant(identifier: CommunicationUserIdentifier | PhoneNumberIdentifier | MicrosoftTeamsUserIdentifier | UnknownIdentifier): Promise<void>;
}

/**
 * The CallAgent is used to handle calls.
 */
export declare interface CallAgent extends CallAgentCommon {
    /**
     * Get the calls.
     */
    readonly calls: ReadonlyArray<Call>;
    /**
     * Get the display name of the local participant for all new calls.
     */
    readonly displayName?: string;
    /**
     * Initiate a call to the participants provided.
     * @param participants[] - User Identifiers (Callees) to make a call to.
     * @param options - Start Call options.
     * @returns The Call object associated with the started call.
     */
    startCall(participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[], options?: StartCallOptions): Call;
    /**
     * Initiate a call to the participants provided.
     * @param participants[] - User Identifiers (Callees) to make a call to.
     * @param options - Start Call options.
     * @returns The Call object associated with the started call.
     * @beta
     */
    startCall(participants: (CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[], options?: StartCallOptions): Call;
    /**
     * Join a group call.
     * To join a group call, pass a groupId.
     * @param groupLocator - Group call information.
     * @param options - Call start options.
     * @returns The Call object associated with the call.
     */
    join(groupLocator: GroupLocator, options?: JoinCallOptions): Call;
    /**
     * Join a group chat call.
     * To join a group chat call, pass a threadId.
     * @param groupChatCallLocator - GroupChat call information.
     * @param options - Call start options.
     * @returns The Call object associated with the call.
     * @beta
     */
    join(groupChatCallLocator: GroupChatCallLocator, options?: JoinCallOptions): Call;
    /**
     * Join a Teams meeting.
     * To join a Teams meeting, pass a meeting link.
     * @param meetingLocator - Meeting information.
     * @param options - Call start options.
     * @returns The Call object associated with the call.
     */
    join(meetingLocator: TeamsMeetingLinkLocator, options?: JoinCallOptions): Call;
    /**
     * Join a Teams meeting.
     * To join a Teams meeting, pass a meeting link or meeting coordinates.
     * @param meetingLocator - Meeting information.
     * @param options - Call start options.
     * @returns The Call object associated with the call.
     * @beta
     */
    join(meetingLocator: MeetingLocator, options?: JoinCallOptions): Call;
    /**
     * Join a rooms call.
     * To join a rooms call, pass a roomId.
     * @param roomLocator - Room call information.
     * @param options - Call start options.
     * @Returns The Call object associated with the call.
     * @beta
     */
    join(roomLocator: RoomLocator, options?: JoinCallOptions): Call;
    /**
     * Subscribe function for incomingCall event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this callAgent will receive an incoming call.
     */
    on(event: "incomingCall", listener: IncomingCallEvent): void;
    /**
     * Subscribe function for callsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * it will pass arrays of added and removed elements.
     */
    on(event: "callsUpdated", listener: CollectionUpdatedEvent<Call>): void;
    /**
     * Unsubscribe function for incomingCall event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: "incomingCall", listener: IncomingCallEvent): void;
    /**
     * Unsubscribe function for callsUpdated event.
     * @param event - event name.
     * @param listener - allback fn that was used to subscribe to this event.
     */
    off(event: "callsUpdated", listener: CollectionUpdatedEvent<Call>): void;
}

/**
 * CallAgent common interface.
 */
export declare interface CallAgentCommon extends Disposable {
    /**
     * Get the kind of call agent object.
     */
    readonly kind: CallAgentKind;
    /**
     * Retrieves an initialized and memoized Feature object with extended API.
     * Check the object Features.* for all available extended call agent features in this package.
     * @param factory - The factory for the call agent feature constructor that provides an extended API.
     * @beta
     */
    feature<TFeature extends CallAgentFeature>(factory: CallAgentFeatureFactory<TFeature>): TFeature;
}

/**
 * Represents a CallAgent Feature.
 * @beta
 */
export declare interface CallAgentFeature extends BaseFeature {
}

/**
 * Represents the context provided for extended call agent features at the constructor.
 * @beta
 */
export declare interface CallAgentFeatureContext {
    /**
     * The call client that owns the extended call agent object.
     */
    callClient: CallClient;
    /**
     * The call agent instance that is being extended by the feature.
     */
    callAgent: CallAgentCommon;
}

/**
 * Represents the constructor for CallAgentFeature objects, along with the context argument.
 * @beta
 */
export declare type CallAgentFeatureCtor<TFeature extends CallAgentFeature> = new (context: CallAgentFeatureContext) => TFeature;

/**
 * Represents the factory of call agent features
 * @beta
 */
export declare interface CallAgentFeatureFactory<TFeature extends CallAgentFeature> extends FeatureFactory {
    /**
     * The constructor that returns an instance of an call agent feature implementation.
     */
    readonly callAgentApiCtor: CallAgentFeatureCtor<TFeature>;
}

/**
 * The kind of call agent object.
 */
export declare enum CallAgentKind {
    /**
     * ACS call agent object kind.
     */
    CallAgent = "CallAgent",
    /**
     * Teams call agent object kind.
     */
    TeamsCallAgent = "TeamsCallAgent"
}

/**
 * Options for creating CallAgent.
 */
export declare interface CallAgentOptions {
    /**
     * Specify the display name of the local participant for all new calls.
     */
    displayName?: string;
    /**
     * Options related to emergency calling
     */
    emergencyCallOptions?: EmergencyCallOptions;
}

/**
 * The CallClient is the main entry point to the SDK.
 * The CallClient is used to create the CallAgent and to get the DeviceManager.
 * @public
 */
export declare class CallClient {
    private readonly clientId;
    private _callAgent;
    private _teamsCallAgent;
    private _callStack;
    private _teamsCallStack;
    private _deviceManager;
    private _previousOrientation;
    private _telemetryLogManager;
    private _sdkUserAgent;
    private _eventEmitter;
    private _extensibleApi;








    /**
     * Create a CallClient.
     * @param options
     * @public
     */
    constructor(options?: CallClientOptions);


    /**
     * Retrieves an initialized and memoized Feature object with extended API.
     * Check the object Features.* for all available extended call client features in this package.
     * @param factory - The factory for the call client feature constructor that provides an extended API.
     * @beta
     */
    feature<TFeature extends CallClientFeature>(factory: CallClientFeatureFactory<TFeature>): TFeature;
    /**
     * The CallAgent is used to handle calls.
     * To create the CallAgent, pass a CommunicationTokenCredential object provided from SDK.
     * - The CallClient can only have one active CallAgent instance at a time.
     * - You can create a new CallClient instance to create a new CallAgent.
     * - You can dispose of a CallClient's current active CallAgent, and call the CallClient's
     *   createCallAgent() method again to create a new CallAgent.
     * @param tokenCredential - The token credential. Use AzureCommunicationTokenCredential from @azure/communication-common to create a credential.
     * @param options - The CallAgentOptions for additional options like display name.
     * @public
     */
    createCallAgent(tokenCredential: CommunicationTokenCredential, options?: CallAgentOptions): Promise<CallAgent>;
    /**
     * The TeamsCallAgent is used to handle Teams calls.
     * To create the TeamsCallAgent, pass a CommunicationTokenCredential object provided from SDK.
     * - The CallClient can only have one active TeamsCallAgent instance at a time.
     * - You can create a new CallClient instance to create a new TeamsCallAgent.
     * - You can dispose of a CallClient's current active TeamsCallAgent, and call the CallClient's
     *   createTeamsCallAgent() method again to create a new TeamsCallAgent.
     * @param tokenCredential - The token credential. Use AzureCommunicationTokenCredential from @azure/communication-common to create a credential.
     * @param options - The CallAgentOptions for additional options like display name.
     */
    createTeamsCallAgent(tokenCredential: CommunicationTokenCredential, options?: TeamsCallAgentOptions): Promise<TeamsCallAgent>;
    /**
     * The DeviceManager is used to handle media devices such as cameras, microphones, and speakers.
     * @public
     */
    getDeviceManager(): Promise<DeviceManager>;
    /**
     * Provides environment details and tells if it is supported by ACS.
     * A supported environment is a combination of an operating system,
     * a browser, and the minimum version required for that browser.
     * @beta
     */
    getEnvironmentInfo(): Promise<EnvironmentInfo>;
    private validateEmergencyCountryCode;
    private sendTelemetry;
    private handleVisibilityChange;
    private handlePageShow;
    private handlePageHide;
    private handleOrientationChange;
    private getOrientationBasedOnWindowSize;
    private handleResize;
    private sendOrientationChangeEvent;
    private sendInitialOrientation;
    private hangupCalls;
    private sendPageVisibilityInfoEvent;
}

/**
 * Represents a CallClient Feature.
 * @beta
 */
export declare interface CallClientFeature extends BaseFeature {
}

/**
 * Represents the context provided for extended call client features at the constructor.
 * @beta
 */
export declare interface CallClientFeatureContext {
    /**
     * The call client instance that is being extended by the feature.
     */
    callClient: CallClient;
}

/**
 * Represents the constructor for CallClientFeature objects, along with the context argument.
 * @beta
 */
export declare type CallClientFeatureCtor<TFeature extends CallClientFeature> = new (context: CallClientFeatureContext) => TFeature;

/**
 * Represents the factory of call client agent features
 * @beta
 */
export declare interface CallClientFeatureFactory<TFeature extends CallClientFeature> extends FeatureFactory {
    /**
     * The constructor that returns an instance of an call client feature implementation.
     */
    readonly callClientApiCtor: CallClientFeatureCtor<TFeature>;
}

/**
 * Call client options
 */
export declare interface CallClientOptions {
    /**
     * Specify custom logger injected to the client,
     * Logger implementation is provided by @azure/logger package
     */
    logger?: AzureLogger;
    /**
     * Diagnostics options
     */
    diagnostics?: DiagnosticOptions;
}

/**
 * The Call common interface.
 */
export declare interface CallCommon extends Disposable {
    /**
     * Get the kind of call object.
     */
    readonly kind: CallKind;
    /**
     * Get the unique Id for this Call.
     */
    readonly id: string;
    /**
     * Caller Information if this call is incoming.
     */
    readonly callerInfo: CallerInfo;
    /**
     * Get the state of this Call.
     */
    readonly state: CallState;
    /**
     * Containing code/subCode indicating how this call ended.
     */
    readonly callEndReason?: CallEndReason;
    /**
     * Get the call direction, whether it is Incoming or Outgoing.
     */
    readonly direction: CallDirection;
    /**
     * Whether local user is muted, locally or remotely.
     */
    readonly isMuted: boolean;
    /**
     * Whether local user muted incoming audio.
     * @beta
     */
    readonly isIncomingAudioMuted: boolean;
    /**
     * Whether screen sharing is on.
     */
    readonly isScreenSharingOn: boolean;
    /**
     * Whether local video is on.
     * @beta
     */
    readonly isVideoOn: boolean;
    /**
     * Collection of local video streams being sent to other participants in a call.
     */
    readonly localVideoStreams: ReadonlyArray<LocalVideoStream>;
    /**
     * Collection of local audio streams being sent to other participants in a call.
     * @beta
     */
    readonly localAudioStreams: ReadonlyArray<LocalAudioStream>;
    /**
     * Collection of remote audio streams being received from the call.
     * @beta
     */
    readonly remoteAudioStreams: ReadonlyArray<RemoteAudioStream>;
    /**
     * Collection of remote participants in this call.
     * In case of calls with participants of hundred or more,
     * only media active participants are present in this collection.
     */
    readonly remoteParticipants: ReadonlyArray<RemoteParticipant>;
    /**
     * Count of total number of participants in this call.
     * @beta
     */
    readonly totalParticipantCount: number;
    /**
     * Get the role of the local user in the Call.
     * @beta
     */
    readonly role: ParticipantRole;
    /**
     * Retrieves an initialized and memoized Feature object with extended API.
     * Check the object Features.* for all available extended call features in this package, example:
     * ```typescript
     * const call: Call = ...;
     * call.feature(Features.Recording).isRecordingActive;
     * call.feature(Features.Captions).startCaptions('en-us')
     * ```
     * @param factory - The factory for the call feature constructor that provides an extended API.
     */
    feature<TFeature extends CallFeature>(factory: CallFeatureFactory<TFeature>): TFeature;
    /**
     * Hang up the call.
     * @param options - HangUp options.
     */
    hangUp(options?: HangUpOptions): Promise<void>;
    /**
     * Mute local microphone.
     */
    mute(): Promise<void>;
    /**
     * Unmute local microphone.
     */
    unmute(): Promise<void>;
    /**
     * Mute incoming audio.
     * @beta
     */
    muteIncomingAudio(): Promise<void>;
    /**
     * Unmute incoming audio.
     * @beta
     */
    unmuteIncomingAudio(): Promise<void>;
    /**
     * Send DTMF tone.
     */
    sendDtmf(dtmfTone: DtmfTone): Promise<void>;
    /**
     * Start sending video stream in the call.
     * Remote participants in the call will receive your video stream
     * so that they can render it in their UIs.
     * @param localVideoStream - Represents a local video stream that takes a camera source in constructor.
     */
    startVideo(localVideoStream: LocalVideoStream): Promise<void>;
    /**
     * Stop sending video stream in the call.
     * Must pass the same LocalVideoStream object that was used to start video in
     * the CallAgent.startCall() API, CallAgent.join() API , IncomingCall.accept() API, or Call.startVideo() API.
     * @param localVideoStream - The local video stream to stop streaming.
     */
    stopVideo(localVideoStream: LocalVideoStream): Promise<void>;
    /**
     * Put this Call on hold.
     */
    hold(): Promise<void>;
    /**
     * Resume this Call if it is on 'LocalHold' state.
     */
    resume(): Promise<void>;
    /**
     * Start local screen sharing, browser handles screen/window enumeration and selection.
     * Local screen sharing is not supported on iOS nor Android.
     * Incoming screen sharing is supported on iOS and Android.
     */
    startScreenSharing(): Promise<void>;
    /**
     * Stop local screen sharing.
     */
    stopScreenSharing(): Promise<void>;
    /**
     * Start audio in the call with custom localAudioStream.
     * @beta
     */
    startAudio(localAudioStream: LocalAudioStream): Promise<void>;
    /**
     * Stop custom audio in the call and switch to Device manager default audio device.
     * @beta
     */
    stopAudio(): void;
    /**
     * Subscribe function for stateChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'stateChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for idChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'idChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isMutedChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isIncomingAudioMutedChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     * @beta
     */
    on(event: 'isIncomingAudioMutedChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isScreenSharingChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'isScreenSharingOnChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isVideoOnChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     * @beta
     */
    on(event: 'isVideoOnChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for remoteParticipantsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * it will pass arrays of added and removed elements.
     */
    on(event: 'remoteParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
    /**
     * Subscribe function for localVideoStreamsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * it will pass arrays of added and removed elements.
     */
    on(event: 'localVideoStreamsUpdated', listener: CollectionUpdatedEvent<LocalVideoStream>): void;
    /**
     * Subscribe function for localAudioStreamsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * @beta
     * it will pass arrays of added and removed elements.
     */
    on(event: 'localAudioStreamsUpdated', listener: CollectionUpdatedEvent<LocalAudioStream>): void;
    /**
     * Subscribe function for remoteAudioStreamsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * @beta
     * it will pass arrays of added and removed elements.
     */
    on(event: 'remoteAudioStreamsUpdated', listener: CollectionUpdatedEvent<RemoteAudioStream>): void;
    /**
     * Subscribe function for totalParticipantCountChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when the participant count changes.
     * @beta
     */
    on(event: 'totalParticipantCountChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for roleChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     * @beta
     */
    on(event: 'roleChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for stateChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'stateChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for idChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'idChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isMutedChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    off(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isIncomingAudioMutedChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     * @beta
     */
    off(event: 'isIncomingAudioMutedChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for isScreenSharingChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'isScreenSharingOnChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for isVideoOnChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     * @beta
     */
    off(event: 'isVideoOnChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for remoteParticipantsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'remoteParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
    /**
     * Unsubscribe function for localVideoStreamsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'localVideoStreamsUpdated', listener: CollectionUpdatedEvent<LocalVideoStream>): void;
    /**
     * Unsubscribe function for localAudioStreamsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     * @beta
     */
    off(event: 'localAudioStreamsUpdated', listener: CollectionUpdatedEvent<LocalAudioStream>): void;
    /**
     * Unsubscribe function for remoteAudioStreamsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     * @beta
     */
    off(event: 'remoteAudioStreamsUpdated', listener: CollectionUpdatedEvent<RemoteAudioStream>): void;
    /**
     * unsubscribe function for totalParticipantCountChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when the participant count changes.
     * @beta
     */
    off(event: 'totalParticipantCountChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for roleChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     * @beta
     */
    off(event: 'roleChanged', listener: PropertyChangedEvent): void;
}

/**
 * Call diagnostics
 * @alpha
 */
export declare interface CallDiagnostics {
    audio: AudioInCallDiagnostics;
    video: VideoInCallDiagnostics;
}

/**
 * Direction of a call:
 * - 'Incoming'
 * - 'Outgoing'
 */
export declare type CallDirection = 'Incoming' | 'Outgoing';

/**
 * Payload for call ended event.
 */
export declare type CallEndedEvent = (args: {
    callEndReason: CallEndReason;
}) => void;

/**
 * Describes the reason why the call ended.
 */
export declare interface CallEndReason {
    /**
     * Get the HTTP code.
     */
    readonly code: number;
    /**
     * Get the subCode/reason code.
     */
    readonly subCode?: number;
}

/**
 * Caller Information.
 */
export declare interface CallerInfo {
    /**
     * Identifier of the caller.
     */
    readonly identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind | undefined;
    /**
     * Display name of caller ( optional )
     */
    readonly displayName?: string;
}

/**
 * Represents a Call Feature.
 */
export declare interface CallFeature extends BaseFeature {
}

/**
 * Represents the context provided for extended call features at the constructor.
 */
export declare interface CallFeatureContext {
    /**
     * The call agent that owns the extended call object.
     */
    callAgent: CallAgentCommon;
    /**
     * The call instance that is being extended by the feature.
     */
    call: CallCommon;
}

/**
 * Represents the constructor for CallFeature objects, along with the context argument.
 */
export declare type CallFeatureCtor<TFeature extends CallFeature> = new (context: CallFeatureContext) => TFeature;

/**
 * Represents the factory of call features
 */
export declare interface CallFeatureFactory<TFeature extends CallFeature> extends FeatureFactory {
    /**
     * The constructor that returns an instance of an call feature implementation.
     */
    readonly callApiCtor: CallFeatureCtor<TFeature>;
}

/**
 * Information about a Call.
 * @beta
 */
export declare interface CallInfo extends CallInfoCommon {
    /**
     * Get the group Id of the call if you joined
     * the call using the CallAgent.join(groupLocator: GroupLocator) API.
     */
    readonly groupId: string | undefined;
    /**
     * Get the Room Id of the call if you joined
     * the call using the CallAgent.join(roomLocator: RoomLocator) API.
     * @beta
     */
    readonly roomId: string | undefined;
}

/**
 * CallInfo common interface.
 */
export declare interface CallInfoCommon {
    /**
     * Get the server call ID.
     */
    getServerCallId(): Promise<string>;
}

/**
 * Call stack initialization states
 * @alpha
 */
export declare type CallInitializationResult = 'None' | 'ConfigurationFailed' | 'SignalingFailed' | 'InitializationFailed' | 'Initialized';

/**
 * The kind of call object.
 */
export declare enum CallKind {
    /**
     * ACS call object kind.
     */
    Call = "Call",
    /**
     * Teams call object kind.
     */
    TeamsCall = "TeamsCall"
}

/**
 * Call states.
 */
export declare type CallState = 'None' | 'Connecting' | 'Ringing' | 'Connected' | 'LocalHold' | 'RemoteHold' | 'InLobby' | 'Disconnecting' | 'Disconnected' | 'EarlyMedia';

/**
 * Feature for call captions
 * @beta
 */
export declare interface CaptionsCallFeature extends CallFeature {
    /**
     * Indicates if captions are active in the current call.
     */
    readonly isCaptionsActive: boolean;
    /**
     * List of available languages to use with the caption service in BCP 47 format.
     */
    readonly availableLanguages: string[];
    /**
     * Starts the processing of captions in this call with the provided handler for this client.
     * @param startCaptionsOptions - Additional options for starting captions.
     * @returns A Promise representing the completion of the intialization process for the Start Caption operation
     *  The completion of this promise does NOT indicate the captions have started.
     *  A 'isCaptionsActiveChanged' event will be emitted when captions have actually successfully started.
     */
    startCaptions(startCaptionsOptions?: StartCaptionsOptions): Promise<void>;
    /**
     * Updates the language of the ongoing Transcription / Captions
     * @param language - The language to caption speech as. Must be BCP 47 format (e.g. "en-us")
     * @returns A Promise representing the completion of the Select Language operation.
     *  The completion of this promise does NOT indicate the language has changed.
     *  A 'languageChanged' event will be emitted when the language has actually successfully changed.
     */
    selectLanguage(language: string): Promise<void>;
    /**
     * Subscribe function for any of the CaptionsPropertyChangedEventType events
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: CaptionsPropertyChangedEventType, listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for the CaptionsReceivedEventType event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: CaptionsReceivedEventType, listener: CaptionsHandler): void;
    /**
     * Unsubscribe function for any of the CaptionsPropertyChangedEventType events
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: CaptionsPropertyChangedEventType, listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for the CaptionsReceivedEventType event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: CaptionsReceivedEventType, listener: CaptionsHandler): void;
}

/**
 * @beta
 * Callback definition for handling the CaptionsReceivedEventType event.
 */
export declare type CaptionsHandler = (data: CaptionsInfo) => void;

/**
 * @beta
 * Data structure received for each CaptionsReceivedEventType event.
 */
export declare interface CaptionsInfo {
    /**
     * The information of the call participant who spoke the captioned text.
     */
    speaker: ParticipantInfo;
    /**
     * Timestamp of when the captioned words were initially spoken.
     */
    timestamp: Date;
    /**
     * The caption text.
     */
    text: string;
    /**
     * The state in which this caption data can be classified.
     */
    resultType: ResultType;
    /**
     * The language that the spoken words were interpretted as. Corresponds to the language specified in startCaptions / selectLanguage.
     */
    language: string;
}

/**
 * @beta
 */
export declare type CaptionsPropertyChangedEventType = 'isCaptionsActiveChanged';

/**
 * @beta
 */
export declare type CaptionsReceivedEventType = 'captionsReceived';

/**
 * Payload for collection updated event.
 */
export declare type CollectionUpdatedEvent<T> = (args: {
    added: T[];
    removed: T[];
}) => void;

/**
 * Error that get's throw when API call fails.
 */
export declare interface CommunicationServicesError {
    /**
     * Get the error name.
     */
    readonly name: string;
    /**
     * Get the HTTP code.
     */
    readonly code: number;
    /**
     * Get the subCode/reason code.
     */
    readonly subCode: number;
    /**
     * Get a human readable message about the error.
     */
    readonly message: string;
}

/**
 * Information about a composite audio device.
 */
export declare interface CompositeAudioDeviceInfo {
    readonly microphone: AudioDeviceInfo;
    readonly speaker: AudioDeviceInfo;
    readonly compositeAudioDeviceType: CompositeAudioDeviceType;
}

/**
 * Type of a compositve audio device.
 */
export declare type CompositeAudioDeviceType = 'Speaker' | 'Headphones' | 'Headset' | 'Handset' | 'Speakerphone';

/**
 * Options for the renderer of a video stream.
 */
export declare interface CreateViewOptions {
    /**
     * Whether the view should be mirrored or not.
     */
    isMirrored?: boolean;
    /**
     * Scaling mode for the view.
     */
    scalingMode?: ScalingMode;
}

/**
 * Feature for call debug info.
 * @beta
 */
export declare interface DebugInfoCallClientFeature extends CallClientFeature {
    /**
     * Get the LocalParticipantId of the last Call undefined if no call happened
     */
    readonly lastLocalParticipantId: string | undefined;
    /**
     * Get the CallId of the last Call undefined if no call happened
     */
    readonly lastCallId: string | undefined;
    /**
     * A zipped log dump with its unique identifier and hash
     */
    dumpDebugInfo(): DebugInfoDump;
}

/**
 * dump id is a uniqueIdentifier for each debug info dump
 * @beta
 */
export declare interface DebugInfoDump {
    /**
     * A unique id for every log dump snap shot combined with its hash
     */
    readonly dumpId: string;
    /**
     * A zipped log dump
     */
    readonly dump: string;
}

/**
 * Permissions granted by the user.
 */
export declare interface DeviceAccess {
    /**
     * Whether the user allowed audio permissions or not.
     */
    audio: boolean;
    /**
     * Whether the user allowed video permission or not.
     */
    video: boolean;
}

/**
 * Device availability grade
 * @alpha
 */
export declare type DeviceAvailabilityGrade = 'Available' | 'NotAvailable' | 'Unknown';

/**
 * Device compatibility information
 * @alpha
 */
export declare interface DeviceCompatibility {
    browser: DeviceSupportGrade;
    os: DeviceSupportGrade;
}

/**
 * Device enumeration information
 * @alpha
 */
export declare interface DeviceEnumeration {
    microphone: DeviceAvailabilityGrade;
    camera: DeviceAvailabilityGrade;
    speaker: DeviceAvailabilityGrade;
}

/**
 * The Device Manager is used to handle system
 * media devices such as cameras, microphones, and speakers.
 */
export declare interface DeviceManager {
    /**
     * Whether the device host can select speaker output.
     */
    readonly isSpeakerSelectionAvailable: boolean;
    /**
     *  The microphone device that is being used.
     */
    readonly selectedMicrophone?: AudioDeviceInfo;
    /**
     * The speaker device that is being used.
     */
    readonly selectedSpeaker?: AudioDeviceInfo;
    /**
     * Get a list of available video devices for use.
     */
    getCameras(): Promise<VideoDeviceInfo[]>;
    /**
     * Get a list of available microphone devices for use.
     */
    getMicrophones(): Promise<AudioDeviceInfo[]>;
    /**
     * Get a list of available speaker devices for use.
     */
    getSpeakers(): Promise<AudioDeviceInfo[]>;
    /**
     * Selects the microphone device to use.
     * @param microphoneDevice - Microphone device information.
     */
    selectMicrophone(microphoneDevice: AudioDeviceInfo): Promise<void>;
    /**
     * Select the speaker device to use.
     * @param speakerDevice - Speaker device information.
     */
    selectSpeaker(speakerDevice: AudioDeviceInfo): Promise<void>;
    /**
     * Show browser prompt to ask the front end user for permission to use the specified device.
     * @param permissionConstraints - configures which permission (audio/video) to request.
     * @returns The permissions that were granted by the user.
     */
    askDevicePermission(permissionConstraints: PermissionConstraints): Promise<DeviceAccess>;
    /**
     * Subscribe function for videoDevicesUpdated event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * it will pass arrays of added and removed elements.
     */
    on(event: 'videoDevicesUpdated', listener: CollectionUpdatedEvent<VideoDeviceInfo>): void;
    /**
     * Subscribe function for audioDevicesUpdated .
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * it will pass arrays of added and removed elements.
     */
    on(event: 'audioDevicesUpdated', listener: CollectionUpdatedEvent<AudioDeviceInfo>): void;
    /**
     * Subscribe function for selectedMicrophoneChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for selectedSpeakerChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for videoDevicesUpdated event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'videoDevicesUpdated', listener: CollectionUpdatedEvent<VideoDeviceInfo>): void;
    /**
     * Unsubscribe function for audioDevicesUpdated event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'audioDevicesUpdated', listener: CollectionUpdatedEvent<AudioDeviceInfo>): void;
    /**
     * Unsubscribe function for selectedMicrophoneChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    off(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for selectedSpeakerChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    off(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
}

/**
 * Browser/OS support grade
 * @alpha
 */
export declare type DeviceSupportGrade = 'Supported' | 'NotSupported' | 'Unknown';

/**
 * Type of device.
 */
export declare type DeviceType = 'Camera' | 'Microphone' | 'Speaker';

/**
 * Listener arguments for the call 'diagnosticChanged' event
 * - value is DiagnosticQuality or DiagnosticFlag:
 *     - DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
 *     - DiagnosticFlag = true | false.
 * - valueType = 'DiagnosticQuality' | 'DiagnosticFlag'
 */
export declare type DiagnosticChangedEventArgs = {
    value: DiagnosticQuality | DiagnosticFlag;
    valueType: DiagnosticValueType;
};

/**
 * Boolean flag value for boolean related diagnostics such as DeviceSpeakWhileMuted, NoNetwork etc...
 */
export declare type DiagnosticFlag = boolean;

/**
 * Diagnostic options
 */
export declare interface DiagnosticOptions {
    appName?: string;
    /**
     * The application version
     */
    appVersion?: string;
    /**
     * Tags - additonal information
     */
    tags?: string[];
}

/**
 * Quality value for Quality related diagnostics such as NetworkSendQuality, NetworkRevQuality, etc...
 * Good = 1, no problem.
 * Poor = 2, mild problem.
 * Bad = 3, severe problem.
 */
export declare enum DiagnosticQuality {
    Good = 1,
    Poor = 2,
    Bad = 3
}

/**
 * Diagnostic value type. DiagnosticQuality or DiagnosticFlag
 */
export declare type DiagnosticValueType = 'DiagnosticQuality' | 'DiagnosticFlag';

/**
 * Dispose of an object.
 */
export declare interface Disposable {
    dispose(): void;
}

/**
 * Feature for call dominant speaker.
 */
export declare interface DominantSpeakersCallFeature extends CallFeature {
    /**
     * Information about the dominant speakers
     */
    readonly dominantSpeakers: DominantSpeakersInfo;
    /**
     * Subscribe function for dominantSpeakersChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: 'dominantSpeakersChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for dominantSpeakersChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: 'dominantSpeakersChanged', listener: PropertyChangedEvent): void;
}

/**
 * Information about the dominant speakers of a call
 */
export declare interface DominantSpeakersInfo {
    /**
     * The list of the dominant speakers for the call:
     *     - dominantSpeakers[0] is the most dominant speaker.
     *     - dominantSpeakers[1] is the second most dominant speaker.
     *     - dominantSpeakers[2] is the third most dominat speaker.
     *     - and so on...
     */
    speakersList: ReadonlyArray<CommunicationIdentifierKind>;
    timestamp: Date;
}

/**
 * DTMF tone for PSTN calls.
 */
export declare type DtmfTone = 'A' | 'B' | 'C' | 'D' | 'Flash' | 'Num0' | 'Num1' | 'Num2' | 'Num3' | 'Num4' | 'Num5' | 'Num6' | 'Num7' | 'Num8' | 'Num9' | 'Pound' | 'Star';

export declare interface EmergencyCallOptions {
    /**
     * Country code for emeregency calls
     */
    countryCode?: string;
}

/**
 * Browser info
 * @beta
 */
export declare type Environment = {
    platform: string;
    browser: string;
    browserVersion: string;
};

/**
 * Environment Info
 * @beta
 */
export declare type EnvironmentInfo = {
    environment: Environment;
    isSupportedPlatform: boolean;
    isSupportedBrowser: boolean;
    isSupportedBrowserVersion: boolean;
    isSupportedEnvironment: boolean;
};

/**
 * Represents the interface for factoring a feature
 */
export declare interface FeatureFactory {




}

/**
 * The collection of all 1st party Features.
 */
export declare const Features: {
    Recording: CallFeatureFactory<RecordingCallFeature>;
    /**
     * @beta
     */
    Transfer: CallFeatureFactory<TransferCallFeature>;
    Transcription: CallFeatureFactory<TranscriptionCallFeature>;
    /**
     * @beta
     */
    Captions: CallFeatureFactory<CaptionsCallFeature>;
    /**
     * @alpha
     */
    RaiseHand: CallFeatureFactory<RaiseHandCallFeature>;
    /**
     * @alpha
     */
    TeamsCaptions: CallFeatureFactory<TeamsCaptionsCallFeature>;
    DominantSpeakers: CallFeatureFactory<DominantSpeakersCallFeature>;
    /**
     * @alpha
     */
    LiveStream: CallFeatureFactory<LiveStreamCallFeature>;
    UserFacingDiagnostics: CallFeatureFactory<UserFacingDiagnosticsFeature>;
    /**
     * @beta
     */
    MediaStats: CallFeatureFactory<MediaStatsCallFeature>;
    /**
     * @beta
     */
    DebugInfo: CallClientFeatureFactory<DebugInfoCallClientFeature>;
    /**
     * @alpha
     */
    PreCallDiagnostics: CallClientFeatureFactory<PreCallDiagnosticsFeature>;
};

/**
 * Locator used for joining a group call.
 */
export declare interface GroupCallLocator {
    groupId: string;
}

/**
 * Locator used to joining group chat call.
 * @beta
 */
export declare interface GroupChatCallLocator {
    threadId: string;
}

/**
 * Group locator.
 */
export declare type GroupLocator = GroupCallLocator;

/**
 * Options for hanging up a call.
 */
export declare interface HangUpOptions {
    /**
     * End the call for everyone.
     */
    forEveryone: boolean;
}

/**
 * Call diagnostic information
 * @alpha
 */
export declare interface InCallDiagnostics {
    connected: boolean;
    diagnostics: CallDiagnostics;
    bandWidth: QualityGrade;
}

/**
 * Represents an incoming call.
 */
export declare interface IncomingCall extends IncomingCallCommon {
    /**
     * Get information about this Call.
     * @beta
     */
    readonly info: CallInfo;
    /**
     * Accept this incoming Call.
     * @param options - accept options.
     * @returns The Call object associated with the accepted call.
     */
    accept(options?: AcceptCallOptions): Promise<Call>;
}

/**
 * The incoming call common interface.
 */
export declare interface IncomingCallCommon {
    /**
     * Get the kind of incoming call oject.
     */
    readonly kind: IncomingCallKind;
    /**
     * Get the unique Id for this Call.
     */
    readonly id: string;
    /**
     * Identifier of the caller.
     */
    readonly callerInfo: CallerInfo;
    /**
     * Containing code/subCode indicating how call ended.
     */
    readonly callEndReason?: CallEndReason;
    /**
     * Reject this incoming Call.
     */
    reject(): Promise<void>;
    /**
     * Subscribe function for onCallEnded event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    on(event: 'callEnded', listener: CallEndedEvent): void;
    /**
     * Unsubscribe function for onCallEnded event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'callEnded', listener: CallEndedEvent): void;
}

/**
 * Payload for incoming call event.
 */
export declare type IncomingCallEvent = (args: {
    incomingCall: IncomingCall;
}) => void;

/**
 * The kind of incoming call object.
 */
export declare enum IncomingCallKind {
    /**
     * ACS incoming call object kind.
     */
    IncomingCall = "IncomingCall",
    /**
     * Teams incoming call object kind.
     */
    TeamsIncomingCall = "TeamsIncomingCall"
}

/**
 * Options for joining a group call.
 * Pass video stream that will be used to start a call. Remote participants in
 * the call will receive your video stream so that they can render it in their UIs.
 * Pass audio options weather to join the call muted or unmuted.
 * If videoOptions is undefined, then call will be started with local video off.
 */
export declare interface JoinCallOptions {
    videoOptions?: VideoOptions;
    audioOptions?: AudioOptions;
}

/**
 * Latest value for a call diagnostic
 */
export declare type LatestDiagnosticValue = {
    value: DiagnosticQuality | DiagnosticFlag;
    valueType: DiagnosticValueType;
};

/**
 * Latest media diagnostics that were raised.
 */
export declare interface LatestMediaDiagnostics {
    /**
     * Raised to True when local microphone is muted and the local user is speaking.
     * Raised to False when local user either stops speaking, or unmutes the microphone.
     */
    speakingWhileMicrophoneIsMuted?: LatestDiagnosticValue;
    /**
     * Raised to True when there are no speaker devices on the system, and speaker selection is supported.
     * Raised to False when there is a least 1 speaker device on the system, and speaker selection is supported.
     */
    noSpeakerDevicesEnumerated?: LatestDiagnosticValue;
    /**
     * Raised to True when there are no microphone devices on the system.
     * Raised to False when there is at least 1 microphone device on the system.
     */
    noMicrophoneDevicesEnumerated?: LatestDiagnosticValue;
    /**
     * Raised to True when the local video stream is frozen. This means the remote side is seeing your video frozen on their screen.
     * Raised to False when the freeze ends.
     */
    cameraFreeze?: LatestDiagnosticValue;
    /**
     * Raised to True when we fail to start sending local video becuase the camera device may have been disabled in the system
     * or it is being used by another process.
     * Raised to False when selected camera device successfully sends local video again.
     */
    cameraStartFailed?: LatestDiagnosticValue;
    /**
     * Raised to True when camera device times out to start sending video stream.
     * Raised to False when selected camera device successfully sends local video again
     */
    cameraStartTimedOut?: LatestDiagnosticValue;
    /**
     * Raised to True when we fail to start capturing the screen.
     * Raised to False when capturing the screen successfully can start.
     */
    capturerStartFailed?: LatestDiagnosticValue;
    /**
     * Raised to True when we fail to start sending local audio stream becuase the microphone device may have been disabled in the system
     * or it is being used by another process.
     * Raised to False when microphone starts to successfully send audio stream again.
     */
    microphoneNotFunctioning?: LatestDiagnosticValue;
    /**
     * Raised to True when microphone enters muted state unexpectedly.
     * Raised to False when microphone starts to successfully send audio stream again.
     */
    microphoneMuteUnexpectedly?: LatestDiagnosticValue;
    /**
     * Raised to True when camera enters stopped state unexpectedly.
     * Raised to False when camera starts to successfully send video stream again.
     */
    cameraStoppedUnexpectedly?: LatestDiagnosticValue;
    /**
     * Raised to True when screen capturer enters stopped state unexpectedly.
     * Raised to False when screen capturer starts to successfully capture again.
     */
    capturerStoppedUnexpectedly?: LatestDiagnosticValue;
    /**
     * Raised to True when screensharing permission is denied by system settings (sharing).
     * Raised to False on successful stream acquisition.
     * This diagnostic only works on MacOS Chrome
     */
    screenshareRecordingDisabled?: LatestDiagnosticValue;
    /**
     * Raised to True when audio permission is denied by system settings (audio).
     * Raised to False on successful stream acquisition.
     * This diagnostic only works on MacOS Chrome
     */
    microphonePermissionDenied?: LatestDiagnosticValue;
    /**
     * Raised to True when camera permission is denied by system settings (video).
     * Raised to False on successful stream acquisition.
     * This diagnostic only works on MacOS Chrome
     */
    cameraPermissionDenied?: LatestDiagnosticValue;
}

/**
 * Latest network diagnostics that were raised.
 */
export declare interface LatestNetworkDiagnostics {
    /**
     * Raised to 3 (DiagnosticQuality.Bad) when network is disconnected and unable to reconnect.
     * Raised to 2 (DiagnosticQuality.Poor) when media transport connectivity is lost.
     * Raised to 1 (DiagnosticQuality.Good) when new session is connected.
     */
    networkReconnect?: LatestDiagnosticValue;
    /**
     * Raised to 3 (DiagnosticQuality.Bad) when there is a severe problem with recv quality.
     * Raised to 2 (DiagnosticQuality.Poor) when there is a mild problem with recv quality.
     * Raised to 1 (DiagnosticQuality.Good) when there is no problem with recv quality.
     */
    networkReceiveQuality?: LatestDiagnosticValue;
    /**
     * Raised to 3 (DiagnosticQuality.Bad) when there is a severe problem with send quality.
     * Raised to 2 (DiagnosticQuality.Poor) when there is a mild problem with send quality.
     * Raised to 1 (DiagnosticQuality.Good) when there is no problem with send quality.
     */
    networkSendQuality?: LatestDiagnosticValue;
    /**
     * Raised to True when call fails to start because there is no network.
     * Raised to False when there are ice candidates present.
     */
    noNetwork?: LatestDiagnosticValue;
    /**
     * Raised to True when the network has some constraint that is not allowing to reach ACS relays.
     * Raised to False upon making a new call.
     */
    networkRelaysNotReachable?: LatestDiagnosticValue;
}

/**
 * Feature for ACS Live Streaming
 * @alpha
 */
export declare interface LiveStreamCallFeature extends CallFeature {
    /**
     * Collection of live streams this participants has.
     */
    readonly liveStreams: ReadonlyArray<LiveVideoStream>;
    /**
     * Count of total number of streaming participants in this call.
     * */
    readonly participantCount: number;
    /**
     * Subscribe function for liveStreamsUpdated  event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * it will pass arrays of added and removed elements.
     */
    on(event: 'liveStreamsUpdated', listener: CollectionUpdatedEvent<LiveVideoStream>): void;
    /**
     * Subscribe function for participantCountChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when the participant count changes.
     */
    on(event: 'participantCountChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for liveStreamsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'liveStreamsUpdated', listener: CollectionUpdatedEvent<LiveVideoStream>): void;
    /**
     * unsubscribe function for participantCountChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when the participant count changes.
     * @alpha
     */
    off(event: 'participantCountChanged', listener: PropertyChangedEvent): void;
}

/**
 * Represents a live video stream.
 * @alpha
 */
export declare interface LiveVideoStream extends VideoStreamCommon {
    /**
     * Subscribe function for sizeChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'sizeChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isReceivingChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for sizeChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'sizeChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for isReceivingChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
}

/**
 * Represents a local audio stream for a local michrophone device
 * @beta
 */
export declare class LocalAudioStream {
    private _disposed;
    private _source;
    private _eventEmitter;
    private _audioSourceChangedSub;
    private _rawStream;

    /**
     * Create a local audio stream
     * @param source - The mic or media stream track source to use.
     */
    constructor(source: AudioDeviceInfo | MediaStreamTrack);
    /**
     * Subscribe function for audioSourceChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when the audio source will change.
     * @beta
     */
    on(event: 'audioSourceChanged', listener: AudioSourceChangedEvent): void;
    /**
     * Unsubscribe function for audioSourceChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     * @beta
     */
    off(event: 'audioSourceChanged', listener: AudioSourceChangedEvent): void;
    /**
     * Get the current audio source for this LocalAudioStream
     * @beta
     */
    get source(): AudioDeviceInfo | MediaStreamTrack;
    /**
     * Get media stream track.
     * @beta
     */
    getMediaStreamTrack(): Promise<MediaStreamTrack>;
    /**
     * Switch to use a different audio source
     * @param source - The new audio source to use.
     * @beta
     */
    switchSource(source: AudioDeviceInfo | MediaStreamTrack): Promise<void>;
    /**
     * @beta
     */
    dispose(): void;
    private subscribeToRawStreamChangedIfNeeded;
    private disposeRawStream;
}

/**
 * Represents a local video stream for a local camera device
 * @public
 */
export declare class LocalVideoStream {
    private _source;
    private _mediaStreamType;
    private _disposed;
    private _telemetryLogManager;

    /**
     * Create a local video stream
     * @param source - The video camera source to use.
     * @public
     */
    constructor(source: VideoDeviceInfo);
    /**
     * Get the current video source for this LocalVideoStream
     * @public
     */
    get source(): VideoDeviceInfo;
    /**
     * Get the media stream type for this LocalVideoStream
     * @public
     */
    get mediaStreamType(): MediaStreamType;

    /**
     * Switch to use a different video source
     * @param source - The new video source to use.
     * @public
     */
    switchSource(source: VideoDeviceInfo): Promise<void>;


    private sendVideoStreamEvent;
}

/**
 * - diagnostic is the type of Media diagnostic, e.g. speakingWhileMicrophoneIsMuted, cameraStartFailed, etc...
 */
export declare type MediaDiagnosticChangedEventArgs = DiagnosticChangedEventArgs & {
    diagnostic: MediaDiagnosticType;
};

/**
 * Media Diagnostics
 */
export declare interface MediaDiagnostics {
    /**
     * Get the latest known Media diagnostics
     */
    getLatest(): LatestMediaDiagnostics;
    /**
     * Subscribe function for diagnosticChanged event
     * @param event - event name
     * @param listener - callback fn that will be called when a diagnostic has changed
     */
    on(event: 'diagnosticChanged', listener: (args: MediaDiagnosticChangedEventArgs) => void): void;
    /**
     * Unsubscribe function for diagnosticChanged events
     * @param event - event name
     * @param listener - callback fn that was used to unsubscribe to this event
     */
    off(event: 'diagnosticChanged', listener: (args: MediaDiagnosticChangedEventArgs) => void): void;
}

/**
 * Media diagnostic types
 */
export declare type MediaDiagnosticType = keyof LatestMediaDiagnostics;

/**
 * Media stats.
 * @beta
 */
export declare type MediaStats = {
    stats: MediaStatsList;
    collectionInterval: number;
    aggregationInterval: number;
};

/**
 * Properties of aggregation for each stat.
 * @beta
 */
export declare type MediaStatsAggregation = {
    count: number[];
    sum: number[];
    min: number[];
    max: number[];
};

/**
 * Feature for getting media stats while in call.
 * @beta
 */
export declare interface MediaStatsCallFeature extends CallFeature {
    /**
     * Start media stats collector.
     * @param options - Optional options to define aggregation interval and size of each aggregated metric.
     * @returns The MediaStats Collector object.
     */
    /**
     * Start media stats collector.
     */
    startCollector(options?: MediaStatsCollectorOptions): MediaStatsCollector;
    /**
     * Dispose all collectors.
     */
    disposeAllCollectors(): void;
}

/**
 * Media stats collector.
 * @beta
 */
export declare interface MediaStatsCollector {
    /**
     * Dispose collector.
     */
    dispose(): void;
    /**
     * Subscribe function for mediaStatsEmitted event.
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: 'mediaStatsEmitted', listener: MediaStatsEmittedEvent): void;
    /**
     * Unsubscribe function for mediaStatsEmitted event.
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: 'mediaStatsEmitted', listener: MediaStatsEmittedEvent): void;
}

/**
 * options for media stats collector
 * @beta
 */
export declare type MediaStatsCollectorOptions = {
    /**
     * Defines how frequently stats should be aggregated.
     */
    aggregationInterval?: number;
    /**
     * Defines how many data points needed for each aggregation metric.
     */
    dataPointsPerAggregation?: number;
};

/**
 * Payload for media stats emitted event.
 * @beta
 */
export declare type MediaStatsEmittedEvent = (args: MediaStats) => void;

/**
 * Media stats list.
 * @beta
 */
export declare type MediaStatsList = {
    sentBWEstimate?: MediaStatValue;
    audioSendRtt?: MediaStatValue;
    audioSendPairRtt?: MediaStatValue;
    audioRecvPairRtt?: MediaStatValue;
    videoSendRtt?: MediaStatValue;
    videoSendPairRtt?: MediaStatValue;
    videoRecvPairRtt?: MediaStatValue;
    audioRecvJitterBufferMs?: MediaStatValue;
    videoRecvJitterBufferMs?: MediaStatValue;
    screenSharingRecvJitterBufferMs?: MediaStatValue;
    audioRecvJitterMs?: MediaStatValue;
    audioSendJitterMs?: MediaStatValue;
    videoRecvJitterMs?: MediaStatValue;
    videoSendJitterMs?: MediaStatValue;
    audioSendPackets?: MediaStatValue;
    videoSendPackets?: MediaStatValue;
    audioRecvPackets?: MediaStatValue;
    videoRecvPackets?: MediaStatValue;
    audioRecvPacketsLost?: MediaStatValue;
    audioSendPacketsLost?: MediaStatValue;
    videoRecvPacketsLost?: MediaStatValue;
    videoSendPacketsLost?: MediaStatValue;
    screenSharingRecvPacketsLost?: MediaStatValue;
    screenSharingSendPacketsLost?: MediaStatValue;
    audioSendBitrate?: MediaStatValue;
    videoSendBitrate?: MediaStatValue;
    audioRecvBitrate?: MediaStatValue;
    videoRecvBitrate?: MediaStatValue;
    audioSendCodecName?: MediaStatValue;
    videoSendCodecName?: MediaStatValue;
    screenSharingSendCodecName?: MediaStatValue;
    screenSharingRecvCodecName?: MediaStatValue;
    videoSendFrameRateInput?: MediaStatValue;
    videoSendFrameRateSent?: MediaStatValue;
    videoRecvFrameRateReceived?: MediaStatValue;
    videoRecvFrameRateDecoded?: MediaStatValue;
    videoRecvFrameRateOutput?: MediaStatValue;
    screenSharingSendFrameRateInput?: MediaStatValue;
    screenSharingSendFrameRateSent?: MediaStatValue;
    screenSharingRecvFrameRateReceived?: MediaStatValue;
    screenSharingRecvFrameRateDecoded?: MediaStatValue;
    screenSharingRecvFrameRateOutput?: MediaStatValue;
    videoSendFrameWidthInput?: MediaStatValue;
    videoSendFrameHeightInput?: MediaStatValue;
    videoSendFrameWidthSent?: MediaStatValue;
    videoSendFrameHeightSent?: MediaStatValue;
    videoRecvFrameWidthReceived?: MediaStatValue;
    videoRecvFrameHeightReceived?: MediaStatValue;
    screenSharingSendFrameWidthInput?: MediaStatValue;
    screenSharingSendFrameHeightInput?: MediaStatValue;
    screenSharingSendFrameWidthSent?: MediaStatValue;
    screenSharingSendFrameHeightSent?: MediaStatValue;
    screenSharingRecvFrameWidthReceived?: MediaStatValue;
    screenSharingRecvFrameHeightReceived?: MediaStatValue;
    videoRecvLongestFreezeDuration?: MediaStatValue;
    videoRecvTotalFreezeDuration?: MediaStatValue;
    screenSharingRecvLongestFreezeDuration?: MediaStatValue;
    screenSharingRecvTotalFreezeDuration?: MediaStatValue;
    audioSendAudioInputLevel?: MediaStatValue;
    audioRecvAudioOutputLevel?: MediaStatValue;
};

/**
 * Properties of each stat.
 * @beta
 */
export declare type MediaStatValue = {
    aggregation?: MediaStatsAggregation;
    raw: (number | string)[];
    timestamp: Date;
};

/**
 * Media stream type.
 */
export declare type MediaStreamType = 'Video' | 'ScreenSharing' | 'LiveStream';

/**
 * Meeting locator.
 * @beta
 */
export declare type MeetingLocator = TeamsMeetingLinkLocator | TeamsMeetingCoordinatesLocator | TeamsMeetingIdLocator;

/**
 * - diagnostic is the type of Network diagnostic, e.g. networkRcvQuality, noNetwrok, etc... DeviceSpeakWhileMuted, etc...
 */
export declare type NetworkDiagnosticChangedEventArgs = DiagnosticChangedEventArgs & {
    diagnostic: NetworkDiagnosticType;
};

/**
 * Network Diagnostics
 */
export declare interface NetworkDiagnostics {
    /**
     * Get the latest known Network diagnostics
     */
    getLatest(): LatestNetworkDiagnostics;
    /**
     * Subscribe function for diagnosticChanged event
     * @param event - event name
     * @param listener - callback fn that will be called when a diagnostic has changed
     */
    on(event: 'diagnosticChanged', listener: (args: NetworkDiagnosticChangedEventArgs) => void): void;
    /**
     * Unsubscribe function for diagnosticChanged events
     * @param event - event name
     * @param listener - callback fn that was used to unsubscribe to this event
     */
    off(event: 'diagnosticChanged', listener: (args: NetworkDiagnosticChangedEventArgs) => void): void;
}

/**
 * Type of network diagnostic
 */
export declare type NetworkDiagnosticType = keyof LatestNetworkDiagnostics;

/**
 * Represents a participant in a call.
 */
export declare interface ParticipantInfo {
    /**
     * Get the identifier for this remote participant.
     */
    readonly identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind;
    /**
     * Optional display name, if it was set by the endpoint of
     * that remote participant.
     */
    readonly displayName?: string;
}

/**
 * Participant role.
 * @beta
 */
export declare type ParticipantRole = 'Unknown' | 'Attendee' | 'Presenter' | 'Organizer' | 'Consumer';

/**
 * Define constraints for accessing local devices.
 */
export declare interface PermissionConstraints {
    /**
     * Whether to ask for audio permissions or not.
     */
    audio: boolean;
    /**
     * Whether to ask for camera permission or not.
     */
    video: boolean;
}

/**
 * PreCallDiagnostics feature
 * @alpha
 */
export declare interface PreCallDiagnosticsFeature extends CallClientFeature {
    /**
     * @alpha
     */
    startTest(tokenCredentials: CommunicationTokenCredential): Promise<PreCallDiagnosticsResult>;
}

/**
 * Diagnostic results
 * @alpha
 */
export declare type PreCallDiagnosticsResult = {
    deviceAccess: Promise<DeviceAccess>;
    deviceEnumeration: Promise<DeviceEnumeration>;
    inCallDiagnostics: Promise<InCallDiagnostics>;
    id: string;
    browserSupport?: Promise<DeviceCompatibility>;
    callMediaStatistics?: Promise<MediaStatsCallFeature>;
};

/**
 * Payload for property changed event.
 */
export declare type PropertyChangedEvent = () => void;

/**
 * Call quality grade
 * @alpha
 */
export declare type QualityGrade = 'Bad' | 'Average' | 'Good' | 'Unknown';

/**
 * Raise hand state object
 * @alpha
 */
export declare interface RaiseHand {
    /**
     * identifier for a participant
     */
    identifier: CommunicationUserKind | MicrosoftTeamsUserKind;
    /**
     *  contain order in which the state was published across all users in a call
     */
    order?: number;
}

/**
 * Raise hand call reaction feature.
 * @alpha
 */
export declare interface RaiseHandCallFeature extends CallFeature {
    /**
     * Send request to raise hand for local participant
     */
    raiseHand(): Promise<void>;
    /**
     * Send request to lower the raised hand status for local and remote participants
     * @param identifiers optional parameters for request: empty field will lower raised hand status for local participant
     * addition parameter can be used to lower multiple raised hand states for other users
     */
    lowerHand(identifiers?: (CommunicationUserKind | MicrosoftTeamsUserKind)[]): Promise<void>;
    /**
     * Send request to lower raise hand raise status for every participant on the call
     */
    lowerHandForEveryone(): Promise<void>;
    /**
     * Get status of all participants with active raise hand status
     * @returns array of states with all participants with active raise hand status
     */
    getStatus(): RaiseHand[];
    /**
     * Subscribe function for raiseHandChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: RaiseHandChangedEventType, listener: RaiseHandChangedListener): void;
    /**
     * Unsubscribe function for raiseHandChanged event
     * @param event - event name
     * @param listener - callback fn that was used to unsubscribe to this event
     */
    off(event: RaiseHandChangedEventType, listener: RaiseHandChangedListener): void;
}

/**
 * Raise hand state changed event object
 * @alpha
 */
export declare interface RaiseHandChangedEvent extends RaiseHand {
    /**
     * flag for event type - value will be true for raise hand events, and false for lower hand events
     */
    isRaised: boolean;
}

/**
 * Name of event type for raise hand feature
 * @alpha
 */
export declare type RaiseHandChangedEventType = 'raiseHandChanged';

/**
 * Callback definition for handling the RaiseHandEventType event.
 * @alpha
 */
export declare type RaiseHandChangedListener = (data: RaiseHandChangedEvent) => void;

/**
 * Feature for call recording.
 */
export declare interface RecordingCallFeature extends CallFeature {
    /**
     * Indicates if recording is active in current call
     */
    readonly isRecordingActive: boolean;
    /**
     * Gets current recordings
     */
    readonly recordings: RecordingInfo[];
    /**
     * Subscribe function for isRecordingActiveChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for isRecordingActiveChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for recordingStateChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: 'recordingsUpdated', listener: CollectionUpdatedEvent<RecordingInfo>): void;
    /**
     * Unsubscribe function for recordingStateChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: 'recordingsUpdated', listener: CollectionUpdatedEvent<RecordingInfo>): void;
}

/**
 * Call Recording Information.
 */
export declare interface RecordingInfo {
    /**
     * Call recording state
     */
    state: RecordingState_2;
    /**
     * Subscribe function for recordingStateChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: 'recordingStateChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for recordingStateChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: 'recordingStateChanged', listener: PropertyChangedEvent): void;
}

/**
 * Recording state.
 */
declare enum RecordingState_2 {
    /**
     * No recording is happening
     */
    None = 0,
    /**
     * Recording is inprogress
     */
    Started = 1,
    /**
     * Recording is pause
     */
    Paused = 2,
    /**
     * Recording has ended
     */
    Ended = 3
}
export { RecordingState_2 as RecordingState }

/**
 * Remote audio stream of the call.
 * @beta
 */
export declare interface RemoteAudioStream {
    /**
     * Get the remote media stream track.
     * @beta
     */
    getMediaStreamTrack(): Promise<MediaStreamTrack>;
}

/**
 * Represents a remote participant in a call.
 */
export declare interface RemoteParticipant extends ParticipantInfo {
    /**
     * Get state of this remote participant.
     */
    readonly state: RemoteParticipantState;
    /**
     * Reason why participant left the call, contains code/subCode/message.
     */
    readonly callEndReason?: CallEndReason;
    /**
     * Collection of video streams this participants has.
     */
    readonly videoStreams: ReadonlyArray<RemoteVideoStream>;
    /**
     * Whether this remote participant is muted or not.
     */
    readonly isMuted: boolean;
    /**
     * Whether this remote participant is speaking or not.
     */
    readonly isSpeaking: boolean;
    /**
     * Get the role of this remote participant.
     * @beta
     */
    readonly role: ParticipantRole;
    /**
     * Subscribe function for stateChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'stateChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isMutedChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for displayNameChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'displayNameChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for roleChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     * @beta
     */
    on(event: 'roleChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isSpeakingChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'isSpeakingChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for videoStreamsUpdated  event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * it will pass arrays of added and removed elements.
     */
    on(event: 'videoStreamsUpdated', listener: CollectionUpdatedEvent<RemoteVideoStream>): void;
    /**
     * Unsubscribe function for stateChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'stateChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for isMutedChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for displayNameChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'displayNameChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for roleChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     * @beta
     */
    off(event: 'roleChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for isSpeakingChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'isSpeakingChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for videoStreamsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'videoStreamsUpdated', listener: CollectionUpdatedEvent<RemoteVideoStream>): void;
}

/**
 * Remote participant state.
 */
export declare type RemoteParticipantState = 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';

/**
 * Represents a remote participant's video or screen-sharing.
 */
export declare interface RemoteVideoStream extends VideoStreamCommon {
    /**
     * Whether the stream is available for rendering in the UI.
     * When this flag becomes true, the remote participant has their video turned on.
     * and we can create a view to display this remote video stream on the UI.
     */
    readonly isAvailable: boolean;
    /**
     * Subscribe function for isAvailableChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'isAvailableChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for sizeChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     */
    on(event: 'sizeChanged', listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for isRenderingChanged event.
     * @param event - event name.
     * @param listener - callback fn that will be called when value of this property will change.
     * @beta
     */
    on(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for isAvailableChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'isAvailableChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for sizeChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: 'sizeChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for isRenderingChanged event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     * @beta
     */
    off(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
}

/**
 * @beta
 * Enum used to classify the finality of the current phrase's transcription.
 */
export declare enum ResultType {
    /**
     * CaptionInfo will have ResultType of Intermediate if the text contains partially spoken sentence.
     */
    Intermediate = 0,
    /**
     * CaptionInfo will have ResultType of Final if once the sentence has been completely transcribed.
     */
    Final = 1
}

/**
 * Locator used for joining a room call.
 * @beta
 */
export declare interface RoomCallLocator {
    roomId: string;
}

/**
 * Room locator.
 * @beta
 */
export declare type RoomLocator = RoomCallLocator;

/**
 * The scaling mode for the view of a video stream.
 */
export declare type ScalingMode = 'Stretch' | 'Crop' | 'Fit';

/**
 * Options for starting an outgoing call.
 */
export declare interface StartCallOptions extends JoinCallOptions {
    /**
     * A phone number in E.164 format that will be used to represent callers identity.
     * For example, using the alternateCallerId to add a participant using PSTN, this number will
     * be used as the caller id in the PSTN call.
     */
    alternateCallerId?: PhoneNumberIdentifier;
    /**
     * Thread ID is required if user is of type MicrosoftTeamsUserIdentifier.
     * @beta
     */
    threadId?: string;
}

/**
 * @beta
 * Options passed to StartCaptions
 */
export declare interface StartCaptionsOptions {
    language: string;
}

/**
 * Options for starting an outgoing Teams call.
 */
export declare interface StartTeamsCallOptions extends JoinCallOptions {
}

/**
 * Options for starting an outgoing Teams group call.
 * @beta
 */
export declare interface StartTeamsGroupCallOptions extends StartTeamsCallOptions {
    /**
     * The thread id.
     * @beta
     */
    threadId: string;
}

/**
 * Stream size.
 */
export declare interface StreamSize {
    width: number;
    height: number;
}

/**
 * Represents a Teams Call.
 */
export declare interface TeamsCall extends CallCommon {
    /**
     * Get information about this Teams Call.
     */
    readonly info: TeamsCallInfo;
    /**
     * Add a participant.
     * @param participant - Participant to be added
     * @param options - AddTeamsParticipantOptions
     * @beta
     */
    addParticipant(participant: MicrosoftTeamsUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier, options?: AddTeamsParticipantOptions): RemoteParticipant;
    /**
     * Remove a participant from this call.
     * @param participant - the participant to be removed.
     */
    removeParticipant(participant: MicrosoftTeamsUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier): Promise<void>;
}

/**
 * The TeamsCallAgent is used to handle Teams calls.
 */
export declare interface TeamsCallAgent extends CallAgentCommon {
    /**
     * Get the calls.
     */
    readonly calls: ReadonlyArray<TeamsCall>;
    /**
     * Start 1:1 call.
     * @param participant
     * @param options
     * @returns The TeamsCall object associated with the call.
     */
    startCall(participant: MicrosoftTeamsUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier, options?: StartTeamsCallOptions): TeamsCall;
    /**
     * Start a 1:N call.
     * @param participants
     * @param options
     * @returns The TeamsCall object associated with the call.
     * @beta
     */
    startCall(participants: (MicrosoftTeamsUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[], options?: StartTeamsGroupCallOptions): TeamsCall;
    /**
     * Join a Teams meeting.
     * To join a Teams meeting, pass a meeting link.
     * @param meetingLocator - Meeting information.
     * @param options - Call start options.
     * @returns The Call object associated with the call.
     */
    join(meetingLocator: TeamsMeetingLinkLocator, options?: JoinCallOptions): TeamsCall;
    /**
     * Join a Teams meeting.
     * To join a Teams meeting, pass a meeting link or meeting id or meeting coordinates.
     * @param meetingLocator - Meeting information.
     * @param options - Teams call start options.
     * @returns The TeamsCall object associated with the call.
     * @beta
     */
    join(meetingLocator: MeetingLocator, options?: JoinCallOptions): TeamsCall;
    /**
     * Subscribe function for incomingCall event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this callAgent will receive an incoming call.
     */
    on(event: "incomingCall", listener: TeamsIncomingCallEvent): void;
    /**
     * Subscribe function for callsUpdated event.
     * @param event - event name.
     * @param listener - callback fn that will be called when this collection will change,
     * it will pass arrays of added and removed elements.
     */
    on(event: "callsUpdated", listener: CollectionUpdatedEvent<TeamsCall>): void;
    /**
     * Unsubscribe function for incomingCall event.
     * @param event - event name.
     * @param listener - callback fn that was used to subscribe to this event.
     */
    off(event: "incomingCall", listener: TeamsIncomingCallEvent): void;
    /**
     * Unsubscribe function for callsUpdated event.
     * @param event - event name.
     * @param listener - allback fn that was used to subscribe to this event.
     */
    off(event: "callsUpdated", listener: CollectionUpdatedEvent<TeamsCall>): void;
}

/**
 * Options for creating TeamsCallAgent.
 */
export declare interface TeamsCallAgentOptions {
}

/**
 * Information about a Teams Call.
 */
export declare interface TeamsCallInfo extends CallInfoCommon {
    /**
     * Thread id.
     */
    readonly threadId: string | undefined;
}

/**
 * Feature for Teams call captions.
 * @alpha
 */
export declare interface TeamsCaptionsCallFeature extends CallFeature {
    /**
     * Indicates if Teams captions are active in the current call.
     */
    readonly isCaptionsActive: boolean;
    /**
     * Subscribe function for any of the CaptionsPropertyChangedEventType events
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: CaptionsPropertyChangedEventType, listener: PropertyChangedEvent): void;
    /**
     * Subscribe function for the CaptionsReceivedEventType event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: CaptionsReceivedEventType, listener: CaptionsHandler): void;
    /**
     * Unsubscribe function for any of the CaptionsPropertyChangedEventType events
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: CaptionsPropertyChangedEventType, listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for the CaptionsReceivedEventType event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: CaptionsReceivedEventType, listener: CaptionsHandler): void;
}

/**
 * Reoresents a Teams incoming call.
 */
export declare interface TeamsIncomingCall extends IncomingCallCommon {
    /**
     * Get information about this Call.
     */
    readonly info: TeamsCallInfo;
    /**
     * Accept this incoming Call.
     * @param options - accept options.
     * @returns The Call object associated with the accepted call.
     */
    accept(options?: AcceptCallOptions): Promise<TeamsCall>;
}

/**
 * Payload for Teams incoming call event.
 */
export declare type TeamsIncomingCallEvent = (args: {
    incomingCall: TeamsIncomingCall;
}) => void;

/**
 * Locator used for joining a meeting with meeting coordinates.
 * @beta
 */
export declare interface TeamsMeetingCoordinatesLocator {
    threadId: string;
    organizerId: string;
    tenantId: string;
    messageId: string;
}

/**
 * Locator used for joining a meeting with meeting id and code.
 * @beta
 */
export declare interface TeamsMeetingIdLocator {
    meetingId: string;
}

/**
 * Locator used for joining a meeting with meeting link.
 */
export declare interface TeamsMeetingLinkLocator {
    /**
     * The meeting url.
     */
    meetingLink: string;
}

/**
 * Feature for call transcription.
 */
export declare interface TranscriptionCallFeature extends CallFeature {
    /**
     * Indicates if transcription is active in current call
     */
    readonly isTranscriptionActive: boolean;
    /**
     * Subscribe function for any of the TranscriptionPropertyChangedEventType events
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: TranscriptionPropertyChangedEventType, listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for any of the TranscriptionPropertyChangedEventType events
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: TranscriptionPropertyChangedEventType, listener: PropertyChangedEvent): void;
}

/**
 * Transcription property changed event.
 */
export declare type TranscriptionPropertyChangedEventType = 'isTranscriptionActiveChanged';

/**
 * Represents a Transfer Object
 * @beta
 */
export declare interface Transfer {
    /**
     * The transfer state.
     */
    readonly state: TransferState;
    /**
     * The transfer error code.
     */
    readonly error?: TransferErrorCode;
    /**
     * Subscribe function for stateChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: 'stateChanged', listener: PropertyChangedEvent): void;
    /**
     * Unsubscribe function for stateChanged event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: 'stateChanged', listener: PropertyChangedEvent): void;
}

/**
 * Feature for call transfer.
 * @beta
 */
export declare interface TransferCallFeature extends CallFeature {
    /**
     * Transfer a call to a participant
     * @param target - The target participant which the source call is transferred to.
     * @param transferOptions - Transfer to participants options.
     * @returns The Transfer object returned by the call transfer.
     */
    transfer(target: TransferToParticipantLocator, transferOptions?: TransferToParticipantOptions): Transfer;
    /**
     * Transfer a call to a another call
     * @param target - The target call which the source call is transferred to.
     * @param transferOptions - Transfer to call options.
     * @returns The Transfer object returned by the call transfer.
     */
    transfer(target: TransferToCallLocator, transferOptions?: TransferToCallOptions): Transfer;
    /**
     * Subscribe function for transferRequested event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    on(event: 'transferRequested', listener: TransferRequestedEvent): void;
    /**
     * Unsubscribe function for transferRequested event
     * @param event - event name
     * @param listener - callback fn that was used to subscribe to this event
     */
    off(event: 'transferRequested', listener: TransferRequestedEvent): void;
}

/**
 * Transfer error code
 * @beta
 */
export declare interface TransferErrorCode {
    /**
     * Get the HTTP code.
     */
    readonly code: number;
    /**
     * Get the subCode/reason code.
     */
    readonly subCode?: number;
}

/**
 * Event that a transfer has requested
 * @beta
 */
export declare type TransferRequestedEvent = (args: TransferRequestedEventArgs) => void;

/**
 * Event arguments for transfer requested event
 * @beta
 */
export declare type TransferRequestedEventArgs = {
    targetParticipant: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifier;
    accept(acceptOptions?: AcceptTransferOptions): CallCommon;
    reject(): void;
};

/**
 * Transfer state
 * @beta
 */
export declare type TransferState = 'None' | 'Transferring' | 'Transferred' | 'Failed';

/**
 * Transfer call into another call
 * @beta
 */
export declare interface TransferToCallLocator {
    targetCallId: string;
}

/**
 * Options for transfering a call to a call
 * @beta
 */
export declare interface TransferToCallOptions {
}

/**
 * Transfer call to participant
 * @beta
 */
export declare interface TransferToParticipantLocator {
    targetParticipant: CommunicationUserIdentifier | PhoneNumberIdentifier | MicrosoftTeamsUserIdentifier | UnknownIdentifier;
}

/**
 * Options for transfering a call to a participant
 * @beta
 */
export declare interface TransferToParticipantOptions {
    disableForwardingAndUnanswered?: boolean;
}

/**
 * Feature for call diagnostics.
 */
export declare interface UserFacingDiagnosticsFeature extends CallFeature {
    readonly network: NetworkDiagnostics;
    readonly media: MediaDiagnostics;
}

/**
 * Information about a camera device.
 */
export declare interface VideoDeviceInfo {
    /**
     * Get the name of this video device.
     */
    readonly name: string;
    /**
     * Get Id of this video device.
     */
    readonly id: string;
    /**
     * Get this video device type.
     */
    readonly deviceType: VideoDeviceType;
}

/**
 * Type of a video device.
 */
export declare type VideoDeviceType = 'Unknown' | 'UsbCamera' | 'CaptureAdapter' | 'Virtual';

/**
 * Video quality diagnostics
 * @alpha
 */
export declare interface VideoInCallDiagnostics extends BaseInCallDiagnostics {
}

/**
 * Represents a local video stream and takes a camera in constructor.
 */
export declare interface VideoOptions {
    localVideoStreams?: LocalVideoStream[];
}

/**
 * Represents a remote participant's video or screen-sharing or live stream.
 */
export declare interface VideoStreamCommon {
    /**
     * Id of the remote stream.
     */
    readonly id: number;
    /**
     * Get this remote media stream type.
     */
    readonly mediaStreamType: MediaStreamType;
    /**
     * Whether video packets are being received.
     * This flag can become false in cases such as remote video freezes, low network bandwidth, etc.
     * It is recommended to display a loading spinner over the video, if isReceiving is false and isAvailable is true.
     * @beta
     */
    readonly isReceiving: boolean;
    /**
     * The stream size. The higher the stream size, the better the video quality.
     */
    readonly size: StreamSize;
}

/**
 * The renderer for a video stream
 * @public
 */
export declare class VideoStreamRenderer {
    /**
     * This API has been deprecated. Do not use it.
     * - To get the size of the local video stream, please use MediaStats Call feature API (MediaStats.stats.videoSendFrameWidthSent and MediaStats.stats.videoSendFrameHeightSent).
     * - To get the size of a remote video stream, please use RemoteVideoStream.size API.
     * @deprecated
     */
    readonly size: StreamSize;
    private views;
    private disposed;
    private _telemetryLogManager;
    private _videoStream;

    /**
     * Create a Renderer for a local camera preview or remote video stream.
     * Future APIs:
     *     getStats(): Promise<RendererStats>; // Helpful in debugging; should be included
     *     onNextFrame((IFrame) -> void) // to allow app to fetch raw frames - to be implemented later
     *     captureFrame(timeoutMs: number, bufferName?: string): Promise<IVideoFrame>; // This can come in later
     *     events/delegates are provided by IRendererEvents
     * @param videoStream - The video stream to render
     * @alpha
     */
    constructor(videoStream: LocalVideoStream | RemoteVideoStream | LiveVideoStream);
    /**
     * Create a Renderer for a local camera preview or remote video stream.
     * Future APIs:
     *     getStats(): Promise<RendererStats>; // Helpful in debugging; should be included
     *     onNextFrame((IFrame) -> void) // to allow app to fetch raw frames - to be implemented later
     *     captureFrame(timeoutMs: number, bufferName?: string): Promise<IVideoFrame>; // This can come in later
     *     events/delegates are provided by IRendererEvents
     * @param videoStream - The video stream to render
     * @beta
     */
    constructor(videoStream: LocalVideoStream | RemoteVideoStream);
    /**
     * Create a Renderer for a local camera preview or remote video stream.
     * Future APIs:
     *     getStats(): Promise<RendererStats>; // Helpful in debugging; should be included
     *     onNextFrame((IFrame) -> void) // to allow app to fetch raw frames - to be implemented later
     *     captureFrame(timeoutMs: number, bufferName?: string): Promise<IVideoFrame>; // This can come in later
     *     events/delegates are provided by IRendererEvents
     * @param videoStream - The video stream to render
     * @public
     */
    constructor(videoStream: LocalVideoStream | RemoteVideoStream);
    /**
     * Create the view for the video stream.
     * @param options - Renderer options.
     * @public
     */
    createView(options?: CreateViewOptions): Promise<VideoStreamRendererView>;
    private sendCreateViewEvent;
    /**
     * Dispose of this Renderer
     * @public
     */
    dispose(): void;
    /**
     * Attempt to dispose view, if it fails, ignore error
     * @param view
     */
    private _attemptToDisposeView;
    /**
     * Add view to activeRemoteVideoStreamViews
     * @param videoStream
     * @param viewId
     * @param view
     */
    private _addActiveRemoteVideoStreamView;
}

/**
 * The view for a video stream.
 */
export declare interface VideoStreamRendererView extends Disposable {
    /**
     * The current scale mode for this view.
     */
    readonly scalingMode: ScalingMode;
    /**
     * Weather this view is mirrored.
     */
    readonly isMirrored: boolean;
    /**
     * The target html element in which the video stream is rendering on.
     * Use this property and attach it to any UI html element. Example:
     *     document.getElement('someDiv').appendChild(rendererView.target);
     */
    readonly target: HTMLElement;
    /**
     * Update the scale mode for this view.
     * @param scalingMode - The new scale mode.
     */
    updateScalingMode(scalingMode: ScalingMode): Promise<void>;
}

export { }
