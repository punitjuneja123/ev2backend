const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("welcome");
});

const { connection } = require("./config/config");
const { userRoute } = require("./routes/user.route");
const { authenticate } = require("./middleware/authenticate.middleware");
const { productRoute } = require("./routes/product.route");

app.use(express.json());
app.use(cookieParser());
app.use(userRoute);
app.use(authenticate);
app.use(productRoute);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
  console.log("listning server at", port);
});
