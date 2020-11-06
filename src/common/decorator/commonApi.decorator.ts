import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiResponseOptions } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ApiCommonResponse(options?: ApiResponseOptions): any {
  return applyDecorators(ApiInternalServerErrorResponse({ description: 'Something is wrong!' }));
}
