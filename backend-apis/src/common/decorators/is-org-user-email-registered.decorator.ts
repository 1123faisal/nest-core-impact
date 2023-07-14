import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { OrgUsersService } from 'src/org-users/org-users.service';

@ValidatorConstraint({ name: 'IsOrgUserEmailAlreadyExist', async: true })
@Injectable()
export class IsOrgUserEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly orgUsersService: OrgUsersService) {}

  async validate(text: string) {
    return !(await this.orgUsersService.findUser({
      email: text,
    }));
  }
}

export function IsOrgUserEmailAlreadyExist(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOrgUserEmailAlreadyExistConstraint,
    });
  };
}
