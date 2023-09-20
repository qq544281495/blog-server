const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes/index");

const app = express();
// 中间件
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.use("/api", router);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
