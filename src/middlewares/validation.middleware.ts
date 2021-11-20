import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions';

export function validationMiddleware<T>(type: T, skipMissingProperties = false): RequestHandler {
  return (req, _res, next) => {
    validate(plainToClass(<never>type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = generateMessageFromErrors(errors);
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };

  function generateMessageFromErrors(errors: ValidationError[]) {
    return errors.map((error: ValidationError) => Object.values(error.constraints ? error.constraints : [])).join(', ');
  }
}
