import express from "express";
import webPush from "web-push";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(cors());

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
      "environment variables. You can use the following ones:"
  );
  console.log(webPush.generateVAPIDKeys());
  return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  "https://example.com/",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.get("/", (req, res) => {
  res.send("Server");
});

app.post("/register", (req, res) => {
  res.sendStatus(201);
});

app.post("/sendNotification", (req, res) => {
  const subscription = req.body.subscription;
  const payload = JSON.stringify(req.body.payload);
  const options = {
    TTL: req.body.ttl,
  };

  setTimeout(() => {
    webPush
      .sendNotification(subscription, payload, options)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(500);
      });
  }, req.body.delay * 1000);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
