import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiResponseOptions } from '@nestjs/swagger';

/**
 * API Common responses (e.g. OK, Internal server error)
 * @param options options for the OK response
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ApiCommonResponse(options?: ApiResponseOptions): any {
  return applyDecorators(
    ApiOkResponse(options),
    ApiInternalServerErrorResponse({ description: 'Something is wrong!' }),
  );
}
