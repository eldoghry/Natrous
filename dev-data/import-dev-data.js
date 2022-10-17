import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import Tour from "./../models/tourModel.js";
import User from "./../models/userModel.js";
import Review from "./../models/reviewModel.js";

dotenv.config();
console.log(process.cwd());
const DB_URI = process.env.DB_LOCAL;

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connected successfuly");
  });

//CLEAN OLD DATA
const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log("Data deleted successfuly");
  } catch (error) {
    console.log(error);
  }
  process.exit(1);
};

//IMPORT TOURS FROM JSON FILE
// TODO: importing all data
const importData = async () => {
  try {
    const tours = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "dev-data", `tours.json`),
        "utf-8"
      )
    );

    const users = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "dev-data", `users.json`),
        "utf-8"
      )
    );

    const reviews = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "dev-data", `reviews.json`),
        "utf-8"
      )
    );

    // console.log(tours);

    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.log("Data uploaded successfuly");
  } catch (error) {
    console.log(error);
  }
  process.exit(1);
};

if (process.argv[2] === "--delete") {
  deleteData();
} else if (process.argv[2] === "--import") {
  importData();
}
