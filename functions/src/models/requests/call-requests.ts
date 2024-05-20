import { Call } from '../call';


export interface AddCallRequest extends Omit<Call, 'id'> {
}

export interface UpdateCallRequest extends Partial<Call> {
}

export interface FetchCallsRequest extends Call {
}
