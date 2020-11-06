import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './constants';
import { ValidationPipe } from '@nestjs/common';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // helmet middleware
  app.use(helmet());
  // cors middleware
  app.enableCors();
  // validation middleware
  app.useGlobalPipes(new ValidationPipe());
  // swagger middleware
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Overview over all api routes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  // starting app
  await app.listen(PORT);
  // hot loading
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
