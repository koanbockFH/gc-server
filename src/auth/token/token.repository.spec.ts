import { validate, ValidationError } from 'class-validator';
import { UserEnum } from 'src/users/enum/user.enum';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { createConnection, getConnection, getCustomRepository } from 'typeorm';
import { TokenEntity } from './token.entity';
import { TokenRepository } from './token.repository';

describe('TokenRepository', () => {
  beforeEach(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [TokenEntity],
      synchronize: true,
      logging: false,
    });
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  async function initRepository(): Promise<TokenRepository> {
    const tokenRepository = getCustomRepository(TokenRepository);
    const token_1 = new TokenEntity({
      token: 'SAMPLE_JWT_TOKEN_1',
    });
    const token_2 = new TokenEntity({
      token: 'SAMPLE_JWT_TOKEN_2',
    });
    await tokenRepository.save(token_1);
    await tokenRepository.save(token_2);

    return tokenRepository;
  }

  async function getDummyToken(): Promise<TokenEntity> {
    const tokenRepository = getCustomRepository(TokenRepository);
    const token = new TokenEntity({
      token: 'SAMPLE_JWT_TOKEN',
    });

    await tokenRepository.insert(token);
    return token;
  }

  describe('findByToken', () => {
    test('successfull retrieval', async () => {
      const tokenRepository = await initRepository();
      const actual = await tokenRepository.findByToken('SAMPLE_JWT_TOKEN_1');

      expect(actual.token).toBe('SAMPLE_JWT_TOKEN_1');
    });

    test('failed retrieval - no item found - null value', async () => {
      const tokenRepository = await initRepository();
      await expect(tokenRepository.findByToken('TOKEN_NOT_AVAILABLE')).resolves.toBeNull();
    });
  });

  describe('SaveOrUpdate', () => {
    test('Save new Item', async () => {
      const tokenRepository = getCustomRepository(TokenRepository);

      const token = await getDummyToken();

      await tokenRepository.saveOrUpdate(token);

      const actual = await tokenRepository.findOne(1);
      expect(actual.token).toBe(token.token);
    });

    test('update existing Item', async () => {
      const tokenRepository = await initRepository();
      const token = await tokenRepository.findOne();
      expect(token.token).toBe('SAMPLE_JWT_TOKEN_1');
      token.token = 'SAMPLE_JWT_TOKEN_CHANGED';

      await tokenRepository.saveOrUpdate(token);

      const actual = await tokenRepository.findOne({ id: token.id });
      expect(actual.token).toBe(token.token);
    });

    test('fail validation on save or update', async () => {
      const tokenRepository = getCustomRepository(TokenRepository);
      const token = new TokenEntity();

      //test validation itself
      expect((await validate(token)).length).toBeGreaterThan(0);
      //should not save server cause validation errors
      try {
        await tokenRepository.saveOrUpdate(token);
      } catch (e) {
        if (Array.isArray(e) && e[0] instanceof ValidationError) {
          expect(e.find((error: ValidationError) => error.property == 'token')).toBeInstanceOf(ValidationError);
          expect(e).toHaveLength(1);
        } else {
          fail('This should not have happened: ' + e);
        }
      }
      //should not find server either
      await expect(tokenRepository.find()).resolves.toHaveLength(0);
    });
  });
});
