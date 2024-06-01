import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";

import AuthRoute from "./routes/auth.js";
import BookRoute from "./routes/book.js";
import IndexRoute from "./routes/index.js";
import MemberRoute from "./routes/member.js";
import swaggerDocument from "./docs/swagger.json" assert { type: "json" };

dotenv.config();

const app = express();
const env = process.env;

const port = env.PORT || 8000;

mongoose
  .set("strictQuery", false)
  .connect(env.MONGO_DB_URL)
  .then(() => console.log("database connection established"))
  .catch((err) => console.log(`DB error => ${err}`));

const corsOptions = {
  origin: true,
  credentials: true,
  maxAge: 3600,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api", IndexRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/books", BookRoute);
app.use("/api/members", MemberRoute);

app.listen(port, () => {
  console.log(`Node server is running on ${env.URL}:${port}`);
  console.log(`Swagger docs is running on ${env.URL}:${port}/api-docs`);
});
