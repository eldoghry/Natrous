import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import Tour from "./../models/tourModel.js";

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
    console.log("Data deleted successfuly");
  } catch (error) {
    console.log(error);
  }
  process.exit(1);
};

//IMPORT TOURS FROM JSON FILE
const importTours = async () => {
  try {
    const tours = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "dev-data", `tours-simple.json`),
        "utf-8"
      )
    );

    // console.log(tours);

    await Tour.create(tours);
    console.log("Data uploaded successfuly");
  } catch (error) {
    console.log(error);
  }
  process.exit(1);
};

if (process.argv[2] === "--delete") {
  deleteData();
} else if (process.argv[2] === "--import") {
  importTours();
}
