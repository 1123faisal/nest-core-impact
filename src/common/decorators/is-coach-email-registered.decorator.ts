import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { CoachsAuthService } from 'src/coachs/coachs-auth.service';

@ValidatorConstraint({ name: 'IsCoachEmailAlreadyExist', async: true })
@Injectable()
export class IsCoachEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly coachService: CoachsAuthService) {}

  async validate(text: string) {
    const v = await this.coachService.findUser({
      email: text,
    });

    console.log({ v });

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
