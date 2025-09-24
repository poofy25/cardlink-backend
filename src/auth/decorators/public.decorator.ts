import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () =>
  applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    ApiOperation({
      summary: 'Public endpoint',
      security: [], // Override global security to make endpoint public
    }),
  );
