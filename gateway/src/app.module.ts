import { CategoryModule, ChatModule } from '@modules';
import { Module } from '@nestjs/common';

@Module({
  imports: [CategoryModule,ChatModule],
})
export class AppModule {}
