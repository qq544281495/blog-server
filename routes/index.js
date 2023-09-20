const express = require("express");
const router = new express.Router();

router.get("/", (request, response) => {
  response.status(200).json({ message: "博客服务端" });
});

module.exports = router;
