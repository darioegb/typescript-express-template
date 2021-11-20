import { stringsOrUndefined } from './types';
import { HttpException } from '@exceptions';

export function isEmptyObject(obj: unknown): boolean {
  return !Object.keys(obj).length;
}

export function validateObjectData<T extends unknown>(objectData: T, messageParam: string) {
  if (isEmptyObject(objectData)) {
    throw new HttpException(400, `You're not ${messageParam}`);
  }
}

export function splitByParamOrUndefined(source: string, param = ','): stringsOrUndefined {
  return source.length > 1 ? source.split(param) : undefined;
}
