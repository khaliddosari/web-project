const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const recommendationSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  recommendations: [{
    code: String,
    name: String,
    enName: String,
    department: String,
    match: Number,
    reason: String,
    enReason: String,
    description: String,
    enDescription: String
  }]
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  major: { type: String, required: true, enum: ['CS', 'IS', 'IT'] },
  year: { type: Number, required: true, min: 1, max: 4 },
  gpa: { type: Number, required: true, min: 0, max: 5.0 },
  history: [recommendationSchema]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Exclude password from JSON responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Compare password
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
