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

// * GET/short-url

app.get("/url", urlValidator, async (req, res) => {
  const base62Chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  try {
    const { originalUrl } = req.body;
    let tempCounter = count++;
    const shortCode = base62Encode(tempCounter);
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const result = await Url.create({
      id: tempCounter,
      originalUrl,
      shortCode,
      shortUrl,
      clicks: 0,
    });
    console.log(result);
    res
      .status(200)
      .json({ success: true, data: result, "Short Url": shortUrl });
  } catch (err) {
    console.log(
      "Found error in the /url section while dealing with the shortening :" +
        err.message || err
    );
  }

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

// *Just for learning purpose.--- how to redirect using the res.redirect

app.get("/redirect", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Surprise!</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background: black;
          }
          iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            border: 0;
          }
          #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <iframe id="video"
          src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0"
          allow="autoplay; fullscreen; encrypted-media"
          allowfullscreen>
        </iframe>
        <div id="overlay" onclick="unmute()"></div>

        <script>
          function unmute() {
            const iframe = document.getElementById('video');
            // Reload the iframe with sound on
            iframe.src = "https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&mute=0&controls=0&modestbranding=1&showinfo=0&rel=0";
            document.getElementById('overlay').style.display = 'none';
          }
        </script>
      </body>
    </html>
  `);
});

// * Making it clickable

app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const record = await Url.find({ shortCode });
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Url not found in the database" });

    record.clicks++;
    await record.save;

    res.redirect(record.originalUrl);
  } catch (err) {
    console.log(
      "Error find while redirecting the short Url" + err.messager || err
    );
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
