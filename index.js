import express from "express";
import webPush from "web-push";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(cors());

// Your VAPID keys (public and private)
const vapidPublicKey =
  "BGYuPZo_oTJ5Ze-tboy4wgN9_mZNEaC7lpARAil3qP2RcFOKflkxr3Y2fB39s5LACtUgUOAVRO4LldZp_d9m2xA";
const vapidPrivateKey = "BK8-dnfyXZv9_tSt97PfoNTd6m_0j4P397PsbMq4R0s";

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
