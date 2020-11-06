import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async checkRunning() {
    return 'API is running!';
  }
}
