import { Constructable } from './types';
import { HttpException } from '../exceptions';

export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export const validateObjectData = <T extends object>(objectData: T, messageParam: string) => {
  if (isEmptyObject(objectData)) {
    throw new HttpException(400, `You're not ${messageParam}`);
  }
}

export const autoMapper = <S, D>(source: S, destination: Constructable<D>): D => {
  let mapped: any = new destination();
  Object.keys(mapped).forEach((key) => {
    mapped[key] = source[key as keyof S];
  });

  return mapped;
};
