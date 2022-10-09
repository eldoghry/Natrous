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

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// console.log(x);

// HANDLE REJECTION
process.on("unhandledRejection", (err) => {
  console.log(`💥💥💥 UNHANDLED REJECTION! Shutdown server ...`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
