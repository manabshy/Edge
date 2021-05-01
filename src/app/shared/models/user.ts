import { ResultData } from '../result-data';

export interface User {
  staffMemberId: number;
  username: string;
  firstName: string;
  surname: string;
  exchangeUsername: string;
  email: string;
  password: string;
}

export interface UserResult extends ResultData{
  result: User;
}
