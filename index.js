// const express = require("express");
// const { connectToMongoDB } = require("./connect");
// const urlRoute = require("./routes/url");
// const URL = require("./models/url");

// const app = express();
// const PORT = 8001;

// connectToMongoDB(
//   "mongodb+srv://creditch11:bTq96JfZoao5XmZS@cluster0.o8dyy26.mongodb.net/"
// ).then(() => console.log("Mongodb connected"));

// app.use(express.json());

// app.use("/url", urlRoute);

// app.get("/:shortId", async (req, res) => {
//   const shortId = req.params.shortId;
//   const entry = await URL.findOneAndUpdate(
//     {
//       shortId,
//     },
//     {
//       $push: {
//         visitHistory: {
//           timestamp: Date.now(),
//         },
//       },
//     }
//   );
//   res.redirect(entry.redirectURL);
// });

// app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB(
  "mongodb+srv://creditch11:bTq96JfZoao5XmZS@cluster0.o8dyy26.mongodb.net/"
).then(() => console.log("Mongodb connected"));

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const ipAddress = req.ip; // Get IP address of the visitor, you might want to handle proxy situations
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $addToSet: {
        // Use $addToSet to avoid adding duplicate IP addresses
        visitHistory: { ipAddress, timestamp: Date.now() },
      },
    },
    { new: true } // Return the updated document
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
