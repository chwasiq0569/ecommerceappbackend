const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");

const app = express();
app.use(express.json());
dotenv.config();

const db = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.e6iva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => console.log("ERROR", err));

app.use("/api/v1", userRoute);

// app.get("/", (req, res) => {
//   const tourSchema = mongoose.Schema({
//     name: {
//       type: String,
//       required: [true, "A Tour must have a name."],
//       unique: true,
//     },
//     rating: {
//       type: Number,
//       default: 4.5,
//     },
//     price: {
//       type: Number,
//       required: [true, "A Tour must have a price."],
//     },
//   });

//   const Tour = mongoose.model("Tour", tourSchema);

//   const testTour = new Tour({
//     name: "The Forest Hiker",
//     rating: 4.7,
//     price: 497,
//   });

//   testTour
//     .save()
//     .then((doc) => console.log("doc", doc))
//     .catch((err) => console.log("Error", err));

//   res.send("SEND");
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening at PORT ${PORT}`);
});
