/** Error class thrown in strict mode when a message send or consent operation fails. */
export class RelayKitError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'RelayKitError';
    this.code = code;
  }
}
