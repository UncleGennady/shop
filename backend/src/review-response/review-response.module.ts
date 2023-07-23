import { Module } from '@nestjs/common';
import { ReviewResponseService } from './review-response.service';
import { ReviewResponseController } from './review-response.controller';
import { PrismaService } from 'src/prisma.service';
import { ReviewModule } from 'src/review/review.module';

@Module({
  controllers: [ReviewResponseController],
  providers: [ReviewResponseService, PrismaService],
  imports: [ReviewModule]
})
export class ReviewResponseModule {}
