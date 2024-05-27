import { Call } from '../call';

export interface UpdateCallRequest extends Partial<Call> {
}

export interface FetchCallsRequest extends Call {
}

export interface AddCallRequest extends Pick<Call, 'type' | 'fromUserId' | 'toUserId'> {
}
