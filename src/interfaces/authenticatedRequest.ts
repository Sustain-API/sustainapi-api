import { Request } from 'express';
import { User } from 'src/modules/user/user.entity';

export interface IAuthenticatedReq extends Request {
  user: User;
}

export interface IAdminRequest extends Request {
  admin?: User;
}
