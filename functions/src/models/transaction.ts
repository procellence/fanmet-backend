import { ModelBase } from '../utils/model-base';
import { User } from './user';

export interface Transaction extends ModelBase {
  userId: string;
  type: TransactionType;
  amount: number;
  status: PaymentStatus
  user?: User;
}

export interface PaymentResponse {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: TransactionStatus;
        order_id: string;
        invoice_id: string;
        international: boolean;
        method: string;
        amount_refunded: number;
        refund_status: string;
        captured: boolean;
        description: string;
        card_id: string;
        bank: string;
        wallet: string;
        vpa: string;
        email: string;
        contact: string;
        notes: any[];
        fee: string;
        tax: string;
        error_code: string;
        error_description: string;
        error_source: string;
        error_step: string;
        error_reason: string;
        acquirer_data: {
          rrn: string;
          upi_transaction_id: string;
        };
        created_at: number;
        upi: {
          vpa: string;
        };
      };
    };
  };
  created_at: number;
}


enum TransactionType {
  DEPOSITED = 'deposited',
  WITHDRAWN = 'withdrawn',
  CALLED = 'called',
  CALL_RECEIVED = 'call_received'
}

export enum TransactionStatus {
  CREATED = 'created',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

export enum PaymentStatus {
  IN_PROGRESS = 'in-progress',
  SUCCESS = 'success',
  INITIATED = 'initiated',
  FAILED = 'failed',
}
