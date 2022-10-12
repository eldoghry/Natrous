import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

/***************** SCHEMA *****************/
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A User must have a name"],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "A User must have a email"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    photo: String,

    role: {
      type: String,
      required: [true, "A User must have a role"],
      enum: ["user", "admin", "guide"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    password: {
      type: String,
      required: [true, "A User must have a password"],
      trim: true,
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "A User must confirm password"],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Password are not the same",
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
  },
  { timestamps: true }
);

/***************** MIDDLEWARES *****************/
userSchema.pre(/^find/, function (next) {
  console.log("find run first");
 this.find({ isActive: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  //1) Hashing password
  //In case password are created or modified
  if (this.isModified("password")) {
    //hashing password
    this.password = await bcrypt.hash(this.password, 10);
  }

  //2) remove password Confirm field
  this.passwordConfirm = undefined;
  next();
});

/***************** INSTANCE METHODS *****************/
//Instance Methods: check login password is correct
userSchema.methods.isCorrectPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

/* Instance Methods: check if user changePassword after token
when user change his password, passwordChangedAt field will be time of changing,
so if server got jwttime that before changing time will consider unvalid token */
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  //1) user never change his password
  if (!this.passwordChangedAt) return false;

  const formatedTime = this.passwordChangedAt.getTime() / 1000; //time in sec

  //2) check if jwtTimestamp older than changing password time
  return jwtTimestamp <= formatedTime;
};

userSchema.methods.createPasswordResetToken = function () {
  // this.passwordResetExpire(new Date(Date.now() + 10 * 60 * 1000)); //10 min from now

  // 1) create resetToken
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2) create hash token to be saved in DB
  const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.passwordResetToken = hash;
  this.passwordResetExpire = new Date(Date.now() + 10 * 60 * 1000); //10 min from now

  console.log({ resetToken, hash });

  return resetToken;
};

export default mongoose.model("User", userSchema);
