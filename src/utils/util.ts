import { Constructable } from './types';
import { HttpException } from '../exceptions';

export function isEmptyObject(obj: object): boolean {
  return !Object.keys(obj).length;
}

export function validateObjectData<T extends object>(
  objectData: T,
  messageParam: string
) {
  if (isEmptyObject(objectData)) {
    throw new HttpException(400, `You're not ${messageParam}`);
  }
}

export function autoMapper<S, D>(source: S, destination: Constructable<D>): D {
  const mapped: any = new destination();
  Object.keys(mapped).forEach((key) => {
    mapped[key] = source[key as keyof S];
  });

  return mapped;
}

export function splitByParamOrUndefined(
  source: string,
  param = ','
): string[] | undefined {
  return source.length > 1 ? source.split(param) : undefined;
}
