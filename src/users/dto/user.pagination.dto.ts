import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { UserDTO } from './user.dto';

//Dummy class because https://github.com/nestjs/swagger/issues/41#issuecomment-360092795
export class UserPagination extends Pagination<UserDTO> {
  @ApiProperty({ type: UserDTO, isArray: true })
  items: UserDTO[];
}
