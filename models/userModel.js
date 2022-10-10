import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A User must have a username"],
      trim: true,
      unique: true,
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
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  //1) Hashing password
  //In case password are created or modified
  if (this.isModified("password")) {
    //hashing password
    this.password = await bcrypt.hash(this.password, 10);
  }

  //2) remove password Confirm field
  this.passwordConfirm = undefined;
});

//Instance Methods: check login password is correct
userSchema.methods.isCorrectPassword = async function (plainPassword) {
  console.log(this);
  return await bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);
