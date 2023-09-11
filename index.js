import express from "express";
import bodyParser from "body-parser";
import webpush from "web-push";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Replace with your own VAPID keys (generate them)
const VAPID_PUBLIC_KEY =
  "BOFWDAaOvqQ1cBTxg_IwQ1cRNJ5Z3QouAiIgzo4JRJXdw_CnlrSPJRxaeiIlfH23-VERIKuhKzJXi49ERjykQ3E";
const VAPID_PRIVATE_KEY = "ezKVxMcXuXwNZ-_x2el9AinOfV0I3OSJ8lj37_3Oh8U";

webpush.setVapidDetails(
  "mailto:lukakoridze13@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Store subscribed clients (for simplicity, use an array)
const subscribers = [];

// Route to subscribe a new client
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscribers.push(subscription);
  res.status(201).json({});
  console.log(subscribers);

});

// Route to send a push notification to all subscribed clients
app.post("/send-notification", (req, res) => {
  const message = req.body.message;

  // Iterate through subscribers and send the push notification
  subscribers.forEach((subscription) => {
    webpush
      .sendNotification(
        subscription,
        JSON.stringify({ title: "Web Push Notification", body: message })
      )
      .catch((err) => console.error(err));
  });

  res.status(200).json({ message: "Notification sent" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
