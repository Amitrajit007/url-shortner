import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
//* middleware
import urlValidator from "./middlewares/validator.middleware.js";
//* DB config
import connectDb from "./Config/url.config.js";
//* DB schema

const app = express();

app.use(express.json());
//* routes
import creatshortUrl from "./routes/creatUrl.route.js";
import EasterEgg from "./routes/X.route.js";
import redirect from "./routes/redirect.route.js";

// connection to the DB
connectDb();

const PORT = process.env.PORT || 5000;



// * GET/short-url

app.use("/url", urlValidator, creatshortUrl);

// *Just for learning purpose.--- how to redirect using the res.redirect this should always be a external link cause an interlink means which is already shortened this will create a infinite redirection loop.

app.use("/redirect", EasterEgg);

// * Making it clickable

app.use("/:shortCode", redirect);

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
