import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { ApiCommonResponse } from 'src/common/decorator/commonApi.decorator';
import { UserTypes } from 'src/common/decorator/user-type.decorator';
import { UserPagination } from './dto/user.pagination.dto';
import { UserEnum } from './enum/user.enum';
import { UsersService } from './users.service';

@Auth()
@ApiTags('user')
@Controller('/api/v1/user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'take',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: UserEnum,
  })
  @ApiCommonResponse({ type: UserPagination, isArray: true })
  @UserTypes(UserEnum.ADMIN)
  @Get()
  async getAllUser(
    @Query('page') page = 1,
    @Query('take') take: number,
    @Query('search') searchArg: string,
    @Query('type') userTypeFilter: UserEnum,
  ): Promise<UserPagination> {
    take = take > 50 ? 50 : take;
    return this.userService.getAll(
      {
        searchArg,
        userType: UserEnum[(userTypeFilter as unknown) as keyof typeof UserEnum],
      },
      { page: page, take: take },
    );
  }
}
