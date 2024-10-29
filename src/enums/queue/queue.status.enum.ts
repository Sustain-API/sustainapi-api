export enum Queue_Status {
  /**
   * When we have successfully queued the transaction
   */
  SUCCESS = 'success',

  /**
   * When the process of queuing the transaction fails
   */
  FAILED = 'failed',

  /**
   * When we are preparing to queue
   */
  PENDING = 'pending',

  /**
   * transactions that do not require queueing
   */
  IGNORE = 'ignore',
}
