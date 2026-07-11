import { Router } from "express";
import * as indexController from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", indexController.getCategories);
indexRouter.get("/books", indexController.getBooks);
indexRouter.get("/book/:id", indexController.getBook);

indexRouter.get("/delete/author/:id", indexController.deleteAuthor);
indexRouter.get("/delete/genre/:id", indexController.deleteGenre);
indexRouter.get("/delete/publisher/:id", indexController.deletePublisher);
indexRouter.get("/delete/book/:id", indexController.deleteBook);

indexRouter.post("/add-author", indexController.addAuthor);
indexRouter.post("/add-genre", indexController.addGenre);
indexRouter.post("/add-publisher", indexController.addPublisher);
indexRouter.post("/add-book", indexController.addBook);

indexRouter.post("/update-author", indexController.updateAuthor);
indexRouter.post("/update-genre", indexController.updateAuthor);
indexRouter.post("/update-publisher", indexController.updateAuthor);

indexRouter.post("/change-name", indexController.updateBookName);
indexRouter.post("/change-cover", indexController.updateBookCover);
indexRouter.post("/change-authors", indexController.updateBookAuthors);
indexRouter.post("/change-publisher", indexController.updateBookPublisher);
indexRouter.post("/change-year", indexController.updateBookYear);
indexRouter.post("/change-genres", indexController.updateBookGenres);
indexRouter.post("/change-description", indexController.updateBookDescription);

indexRouter.get(
  "/decrement-quantity/:bookId",
  indexController.decrementBookQuantity
);
indexRouter.get(
  "/increment-quantity/:bookId",
  indexController.incrementBookQuantity
);
indexRouter.get(
  "/remove/author/:bookId/:authorId",
  indexController.removeBookAuthor
);
indexRouter.get(
  "/remove/genre/:bookId/:genreId",
  indexController.removeBookGenre
);

export default indexRouter;
