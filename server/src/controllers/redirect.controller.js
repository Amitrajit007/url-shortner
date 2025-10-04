import Url from "../Model/url.js";
const redirect = async (req, res) => {
  try {
    const { shortCode } = req.params;

    console.log(shortCode);

    const record = await Url.findOne({ shortCode });
    console.log(record);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Url not found in the database" });

    record.clicks++;
    await record.save();
    // * checking Expiry day :-)

    const currentTime = Date.now();

    const expiryTime = record.expiresIn;
    const timeDifference = currentTime - expiryTime;
    if (timeDifference > 0) {
      let daysB4 = timeDifference / (24 * 3600 * 1000);

      return res.status(410).json({
        success: false,
        msg: `Not available it expired before ${daysB4.toFixed(2)} days`,
      });
    }
    res.redirect(record.originalUrl);
  } catch (err) {
    console.log(
      "Error find while redirecting the short Url" + err.messager || err
    );
  }
};

export default redirect;
