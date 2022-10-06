import app from "./app.js";
import mongoose from "mongoose";

const DB_URI = process.env.DB_LOCAL;

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connected successfuly");
  });

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
