const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre("save", function(next) {
  // If password hasn't been modified, skip hashing
  if (!this.isModified("password")) return next();

  // Generate a salt and hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err); // Pass error to next() for error handling
    bcrypt.hash(this.password, salt, (err, hashedPassword) => {
      if (err) return next(err); // Pass error to next() for error handling
      this.password = hashedPassword; // Assign hashed password
      // next(); // Proceed to save the user
    });
  });
});

// Compare entered password with stored password
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password); // Return a promise
};

// Export the model
module.exports = mongoose.model("User", UserSchema);