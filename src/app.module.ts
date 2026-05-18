import { Module } from "@nestjs/common";
import { ProductModule } from "./modules/product/product.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { OrderModule } from "./modules/order/order.module";
import { MailModule } from "./modules/mail/mail.module";
import { ConfigModule } from "@nestjs/config";
import { MailService } from "./modules/mail/mail.service";
import { PaymentModule } from "./modules/payment/payment.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AddressModule } from "./modules/address/address.module";

@Module({
  imports: [
    ProductModule,
    AddressModule,
    UserModule,
    AuthModule,
    OrderModule,
    MailModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "public"),
      serveRoot: "/public",
    }),
  ],

  providers: [MailService],
})
export class AppModule {}
