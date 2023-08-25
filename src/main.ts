import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TransformInterceptor } from "./interceptor/response.interceptor";
import { Reflector } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //config view engine hbs
  app.useStaticAssets(join(__dirname, "..", "src/public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");

  //config version
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1", "2"],
  });
  //config CORS
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  //config pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  //config configservice
  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  //config cookie
  app.use(cookieParser());

  await app.listen(configService.get("PORT"));
}

bootstrap();
