import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { AdminsAuthService } from 'src/admin/admin-auth.service';

@ValidatorConstraint({ name: 'IsAdminEmailAlreadyExist', async: true })
@Injectable()
export class IsAdminEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly adminService: AdminsAuthService) {}

  async validate(text: string) {
    return !(await this.adminService.findUser({
      email: text,
    }));
  }
}

export function IsAdminEmailAlreadyExist(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAdminEmailAlreadyExistConstraint,
    });
  };
}
