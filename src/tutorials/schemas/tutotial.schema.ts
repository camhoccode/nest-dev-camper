import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

@Schema()
export class Tutorial {
  @Prop({ type: String, default: () => nanoid() })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: [true, 'Please add a title'], trim: true })
  title: string;

  @Prop({ required: [true, 'Please add a description'], trim: true })
  description: string;

  @Prop({ required: [true, 'Please add number of weeks'], trim: true })
  weeks: string;

  @Prop({ required: [true, 'Please add course cost'] })
  tuition: number;

  @Prop({
    type: [String],
    required: [true, 'Please add minimum skills'],
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  })
  minimumSkills: [string];

  @Prop({ default: false })
  scholarshipAvailable: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'categories', required: true })
  category: string;

  // Uncomment the following lines if you have a 'User' model
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: string; // Replace 'User' with the actual name of your User model
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);
// export const TutModel = mongoose.model('Tutorial', TutorialSchema);
