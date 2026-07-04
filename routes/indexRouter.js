import { Router } from "express";
import * as indexController from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", indexController.getCategories);
indexRouter.get("/books", indexController.getBooks);
indexRouter.post("/add-author", indexController.addAuthor);

export default indexRouter;
