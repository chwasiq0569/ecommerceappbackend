const express = require("express");
const mongoose = require("mongoose");

const app = express();

const db =
  "mongodb+srv://admin:admin@cluster0.e6iva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(db, {
    useNewURLParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => console.log("ERROR", err));

const PORT = process.env.PORT || 3000;

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Tour must have a name."],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A Tour must have a price."],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

app.listen(PORT, () => {
  console.log(`listening at PORT ${PORT}`);
});
