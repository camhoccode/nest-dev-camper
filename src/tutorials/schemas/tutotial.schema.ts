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

  // @Prop({ type: Schema.Types.ObjectId, ref: 'Category', required: true })
  // category: CatsModel; // Make sure to replace 'Category' with the actual name of your Category model

  // Uncomment the following lines if you have a 'User' model
  // @Prop({ type: Schema.Types.ObjectId, ref: 'User', required: true })
  // user: User; // Replace 'User' with the actual name of your User model
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);

//static method to get avg of course tuition
// TutorialSchema.statics.getAverageCost = async function (categoryId) {
//   const obj = await this.aggregate([
//     {
//       $match: { category: categoryId },
//     },
//     {
//       $group: {
//         _id: '$categoryId',
//         averageCost: { $avg: '$tuition' },
//       },
//     },
//   ]);
//   try {
//     await this.model('Category').findByIdAndUpdate(categoryId, {
//       averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// get average cost after saved
// TutorialSchema.post('save', async function () {
//   this.constructor.getAverageCost(this.category);
// });
// get average cost before removed
// TutorialSchema.pre('remove', async function () {
//   this.constructor.getAverageCost(this.category);
// });

// export const TutModel = mongoose.model('Tutorial', TutorialSchema);
