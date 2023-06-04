import HttpMethod from '../constants/HttpMethod';

export default interface RequestSchema {
  method: HttpMethod;
  baseUrl: string;
  paths: string;
  payload: any;
  params: any;
  headers: any;
}
