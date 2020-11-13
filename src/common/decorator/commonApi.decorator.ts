import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiResponseOptions } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ApiCommonResponse(options?: ApiResponseOptions): any {
  return applyDecorators(
    ApiOkResponse(options),
    ApiInternalServerErrorResponse({ description: 'Something is wrong!' }),
  );
}
