import axios from 'axios';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { Tutorial } from 'src/tutorials/schemas/tutotial.schema';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CatsDocument = HydratedDocument<Category>;

@Schema()
export class Category extends Document {
  @Prop({ type: String, default: () => nanoid() })
  _id: mongoose.Types.ObjectId;

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
  location;

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
  averageCost: number;

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
  @Prop({ type: mongoose.Schema.ObjectId, ref: 'tuts', required: true })
  tutorials: Tutorial[];

  async preSave(next: Function): Promise<void> {
    // create cat slug from name
    this.slug = slugify(this.name, { lower: true });
    // geo coder and create location field
    const encodedAddress = encodeURIComponent(this.address);
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${process.env.GEOCODER_API_KEY}`,
      );
      // console.log("response", response.data.results[0].annotations);
      const loc = response.data.results[0];
      this.location = {
        type: 'Point',
        coordinates: [loc.geometry.lng, loc.geometry.lat],
        formattedAddress: loc.formatted,
        streetName: loc.components.road,
        streetNumber: loc.components.house_number,
        state: loc.components.state,
        zipCode: loc.components.postcode,
        city: loc.components.town,
        countryCode: loc.components.country_code,
        country: loc.components.country,
      };
    } catch (error) {
      console.log(error);
    }
    // do not save address in db
    this.address = undefined;
    next();
  }

  // cascade delete courses when bootcamp deleted
  async preDeleteOne(next: Function): Promise<void> {
    try {
      console.log(`Tuts being removed from bootcamp ${this._id}`);
      await this.model('tuts').deleteMany({
        category: this._id,
      });
      next();
    } catch (error) {
      console.log(error);
    }
  }
}

export const CategorySchema = SchemaFactory.createForClass(Category);
// Reverse populate with virtuals
CategorySchema.virtual('tuts', {
  ref: 'tuts',
  localField: '_id',
  foreignField: 'category',
  justOne: false,
});
CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });

export const CatsModel = mongoose.model('categories', CategorySchema);
