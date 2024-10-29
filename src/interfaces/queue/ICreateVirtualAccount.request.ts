export default interface ICreateVirtualAccountEvent {
  ssoId: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  bvn: string;
  //currency: Currency;
}
