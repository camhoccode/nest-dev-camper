import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatsDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  })
  name: string;

  @Prop()
  slug: string;

  @Prop({
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters'],
  })
  description: string;

  @Prop({
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid url with HTTP or HTTPS',
    ],
  })
  website: string;

  @Prop({
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email',
    ],
  })
  email: string;

  @Prop({ maxlength: [20, 'Phone number can not be more than 20 characters'] })
  phone: string;

  @Prop({
    maxlength: [200, 'Address can not be more than 200 characters'],
    required: [true, 'Please add a address'],
  })
  address: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      //   required: true,
    },
    coordinates: {
      type: [Number],
      //   required: true,
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  })
  location: string;

  @Prop({
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  })
  careers: [string];

  @Prop({
    type: String,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must be less than 10'],
  })
  averageRating: string;

  @Prop()
  aaverageCost: number;

  @Prop({
    type: String,
    default: 'no-photo.jpg',
  })
  photo: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  housing: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  jobAssistance: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  jobGuarantee: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  acceptGi: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  // @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
  // user: User;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
