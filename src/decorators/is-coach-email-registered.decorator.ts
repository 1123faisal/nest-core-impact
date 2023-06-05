import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { CoachsService } from 'src/coachs/coachs.service';

@ValidatorConstraint({ name: 'IsCoachEmailAlreadyExist', async: true })
@Injectable()
export class IsCoachEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly coachService: CoachsService) {}

  async validate(text: string) {
    return !(await this.coachService.findUser({
      email: text,
    }));
  }
}

export function IsCoachEmailAlreadyExist(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCoachEmailAlreadyExistConstraint,
    });
  };
}
