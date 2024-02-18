import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from './utiles/any_exception_filter ';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AnyExceptionFilter());
  app.setGlobalPrefix('parking');
  await app.listen(3000);
}
main();
