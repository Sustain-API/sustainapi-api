import ICreateVirtualAccountEvent from './ICreateVirtualAccount.request';

export default interface IDispatcherService {
  dispatchCreateVirtualAccountEvent(
    createVirtualAccountEvent: ICreateVirtualAccountEvent,
  );
}
