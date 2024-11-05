import {
  AbstractResponseBoardResponseCode,
  AbstractResponseListBoardResponseCode,
  AbstractResponseLongResponseCode,
  AbstractResponseTokenResponseResponseCode
} from '@/api';

export interface ApiResponse {
  description: string;
  payload: unknown;
  responseCode:
    | AbstractResponseBoardResponseCode
    | AbstractResponseListBoardResponseCode
    | AbstractResponseLongResponseCode
    | AbstractResponseTokenResponseResponseCode;
}
