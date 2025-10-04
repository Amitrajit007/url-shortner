import Url from "../Model/url.js";
import { readFile, writeFile } from "node:fs/promises";
let data = await readFile("./server/src/data/counter.txt", "utf-8");
let count = Number(data);
const creatshortUrl = async (req, res) => {
  const base62Chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  try {
    const { originalUrl, expiryDays } = req.body;
    let tempCounter = count++;
    const shortCode = base62Encode(tempCounter);
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    let expiresIn;
    if (expiryDays)
      expiresIn = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    const result = await Url.create({
      id: tempCounter,
      originalUrl,
      shortCode,
      shortUrl,
      clicks: 0,
      expiryDays,
      expiresIn,
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
};

export default creatshortUrl;
