import app from "./app.js";
import mongoose from "mongoose";

async function main() {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/natrous", {
        useNewUrlParser: true,
      })
      .then((con) => console.log("DB connected successfuly"));
  } catch (error) {
    console.log(error);
  }
}

main();

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
