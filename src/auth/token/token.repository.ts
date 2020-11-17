import { validate } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';
import { TokenEntity } from './token.entity';

@EntityRepository(TokenEntity)
export class TokenRepository extends Repository<TokenEntity> {
  async saveOrUpdate(module: TokenEntity): Promise<TokenEntity> {
    const errors = await validate(module);
    if (errors.length > 0) {
      throw errors;
    }

    return await this.save(module);
  }

  async findByToken(token: string): Promise<TokenEntity> {
    return (await this.findOne({ token })) ?? null;
  }
}
