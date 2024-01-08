import { Module } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { TutorialsController } from './tutorials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TutorialSchema } from './schemas/tutotial.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'tuts', schema: TutorialSchema }]),
  ],
  controllers: [TutorialsController],
  providers: [TutorialsService],
})
export class TutorialsModule {}
