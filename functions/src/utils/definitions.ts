
export type OptionalPick<T, K extends PropertyKey> = Pick<T, Extract<keyof T, K>>;
