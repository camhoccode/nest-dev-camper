const mongoose = require('mongoose');
const slugify = require('slugify');

export const TutirialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please add a description'],
    },
    weeks: {
      type: String,
      trim: true,
      required: [true, 'Please add number of week'],
    },
    tuition: {
      type: Number,
      required: [true, 'Please add course cost'],
    },
    mininumSkills: {
      type: [String],
      required: [true, 'Please add mininum skills'],
      enums: ['Beginner', 'Intermetidate', 'Advanced'],
    },
    scholershipAvailable: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  // { collection: "courses" }
);

//static method to get avg of course tuition
TutirialSchema.statics.getAverageCost = async function (categoryId) {
  const obj = await this.aggregate([
    {
      $match: { category: categoryId },
    },
    {
      $group: {
        _id: '$categoryId',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  try {
    await this.model('Category').findByIdAndUpdate(categoryId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

// get average cost after saved
TutirialSchema.post('save', async function () {
  this.constructor.getAverageCost(this.category);
});
// get average cost before removed
TutirialSchema.pre('remove', async function () {
  this.constructor.getAverageCost(this.category);
});

export const TutModel = mongoose.model('Tutorial', TutirialSchema);
