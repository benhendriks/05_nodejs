const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder')

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter the job title'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please enter the job description'],
    maxlength: [1000, 'Job description cannot exceed 1000 characters']
  },
  email: {
    type: String,
    validator: [validator.isEmail, 'Please enter a valid email address'],
  },
  address: {
    type: String,
    required: [true, 'Please enter the address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
       type: [Number],
       index: '2dsphere'
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  company: {
    type: String,
    required: [true, 'Please enter the company name']
  },
  industry: {
    type: [String],
    required: true,
    enum: {
      values: [
        'Business',
        'Information Technology',
        'Banking',
        'Education/Training',
        'Telecommunication',
        'Other'
      ],
      message: 'Please select correct options for industry'
    }
  },
  jobType: {
    type: String,
    required: true,
    enum: {
      values: [
        'Permanent',
        'Temporary',
        'Internship'
      ],
      message: 'Please select correct options for job type'
    }
  },
  minEducation: {
    type: String,
    required: true,
    enum: {
      values: [
        'Bachelors',
        'Masters',
        'Phd'
      ],
      message: 'Please select correct options for education'
    }
  },
  positions: {
    type: Number,
    default: 1
  },
  experince: {
    type: String,
    required: true,
    enum: {
      values: [
        'No Experience',
        '1 year',
        '2 years',
        '3 years',
        '4 years',
        '5 years',
        '6 years',
        '7 years',
        '8 years',
        '9 years',
        '10+ years'
      ],
      message: 'Please select correct options for experience'
    }
  },
  salary: {
    type: Number,
    required: [true, 'Please enter expected salary for this job']
  },
  postingDate: {
    type: Date,
    default: Date.now
  },
  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7)
  },
  applicantsApplied: {
    type: [Object],
    select: false
  }
});

// Creating Job Slug before saving
jobSchema.pre('save', function(next) {
  // Creating slug before saving to DB
  this.slug = slugify(this.title, {lower: true});
  next();
}),

// Setting up Location
jobSchema.pre('save', async  function(next) {
  const loc = await geoCoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formatteredAddress: loc[0].formattedAddress,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }
});

module.exports = mongoose.model('Job', jobSchema);
