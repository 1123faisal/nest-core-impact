import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordSameAsConfirm', async: false })
export class IsPasswordSameAsConfirmConstraint
  implements ValidatorConstraintInterface
{
  validate(confirmPassword: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const password = (args.object as any)[relatedPropertyName];
    return confirmPassword === password;
  }

  defaultMessage(args: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [relatedPropertyName] = args.constraints;
    return `New Password & Confirm Password must be same`;
  }
}

export function IsPasswordSameAsConfirm(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isPasswordSameAsConfirm',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsPasswordSameAsConfirmConstraint,
    });
  };
}
