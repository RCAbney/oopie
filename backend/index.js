require("dotenv").config();
const express = require("express");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const cors = require("cors");
const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

router.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code);
  res.json(tokens);
});

router.post("/auth/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
});

app.use("/", router);

app.listen(process.env.PORT || 3001);

console.log("Web Server is listening at port " + (process.env.port || 3001));
