import express from "express";
import { error } from "node:console";
import path from "node:path";
import indexRouter from "./routes/indexRouter.js";

const app = express();

app.use(express.urlencoded());
app.use(express.static(path.join(import.meta.dirname, "public")));
app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    throw error;
  }
  console.log("Server is running");
});
