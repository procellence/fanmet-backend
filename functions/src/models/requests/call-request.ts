import { Call } from '../call';


export interface AddNewCallRequest extends Omit<Call, 'id'> {
}

export interface UpdateCallRequest extends Partial<Call> {
}

export interface FetchCallDetailsRequest extends Call {
}
