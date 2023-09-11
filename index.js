import express from "express";
import webPush from "web-push";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(cors());

// Your VAPID keys (public and private)
const vapidPublicKey =
  "BFiGN-1ixongQ4YVFGJP-lvnjs8Jpmfo8IzPtXOA_mVpx5xBjZvGLoL_TSALkai3dlh2zZNgAOHZoYfC0Ktad54";
const vapidPrivateKey = "amUunF4xa8bpKBPBRPeCJJRmGJ_9e8ql8BJYJ1K4yPs";

// Set VAPID details
webPush.setVapidDetails(
  "mailto:lukakoridze13@gmail.com",
  vapidPublicKey,
  vapidPrivateKey
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
