import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dtos/paginates.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  msg = 'success',
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              msg: {
                example: msg,
              },
            },
          },
        ],
      },
    }),
  );
};
