import { ApiProperty } from '@nestjs/swagger';

export class Pagination<T> {
  constructor(items: T[], currentPage: number, totalPages: number) {
    this.items = items;
    //convert to number because query params are read as string
    this.currentPage = currentPage == null ? 1 : currentPage * 1;
    this.totalPages = totalPages == null ? 1 : totalPages * 1;
  }

  items: T[];
  @ApiProperty({ type: 'number' })
  currentPage: number;
  @ApiProperty()
  totalPages: number;
}
