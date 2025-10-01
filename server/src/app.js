import "dotenv/config";

import mongoose, { connect } from "mongoose";
import express from "express";
import { readFile, writeFile } from "node:fs/promises";
// middleware
import urlValidator from "./middlewares/validator.middleware.js";
// DB config
import connectDb from "./Config/url.config.js";
// DB schema
import Url from "./Model/url.js";
import { read } from "node:fs";
const app = express();

app.use(express.json());

// connection to the DB
connectDb();

const PORT = process.env.PORT || 5000;

let data = await readFile("./server/src/data/counter.txt", "utf-8");
let count = Number(data);
app.get("/url", urlValidator, async (req, res) => {
  const base62Chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  try {
    const { originalUrl } = req.body;
    const result = await Url.create({
      id: count++,
      originalUrl,
      clicks: 0,
    });
    console.log(result);
    const shortCode = base62Encode(result.id);
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    res.status(200).json({ success: true, data: shortUrl });
    // TODO: We have to update the "shortCode" aswell as the "shortUrl in the DB"
  } catch (err) {
    console.log(
      "Found error in the /url section while dealing with the shortening :" +
        err.message || err
    );
  }
  // The base 62 conversion

  function base62Encode(id) {
    let str = "";
    while (id > 0) {
      str = base62Chars[id % 62] + str;
      id = Math.floor(id / 62);
    }
    return str || "0";
  }
  await writeFile("./server/src/data/counter.txt", count.toString(), "utf-8");
});

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
