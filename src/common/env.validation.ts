import { plainToInstance } from 'class-transformer';
import { IsNumber, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  //   Test = 'test',
  //   Provision = 'provision',
}

class EnvironmentVariables {
  // @IsEnum(Environment)
  // NODE_ENV: Environment;

  @IsNumber()
  PORT: number;
}

export function validateEnvs(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
