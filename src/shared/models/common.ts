import { ErrorResponse } from './error';
import { Status } from './status';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface StateEntity<T = unknown> {
  data: T;
  status: Status;
  error?: ErrorResponse;
}
