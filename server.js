const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");

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

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/cart", cartRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening at PORT ${PORT}`);
});
