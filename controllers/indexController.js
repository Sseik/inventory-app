import itemsStorage from "../storages/itemsStorage.js";

const SHOWN_AUTHORS = 10;

export async function getCategories(req, res) {
  const authors = await itemsStorage.getAuthors();

  if (!req.query.authorsPage) {
    req.query.authorsPage = 1;
  }

  if (!req.query.authorsLetter) {
    req.query.authorsLetter = "A";
  }

  const { authorsPage } = req.query;

  const firstIndex = SHOWN_AUTHORS * (authorsPage - 1);
  const shownAuthors = authors.slice(firstIndex, firstIndex + SHOWN_AUTHORS);

  res.render("index", {
    title: "Books Inventory",
    shownAuthors,
    authorsPage,
    query: req.query,
    authorsPages: Math.ceil(authors.length / SHOWN_AUTHORS)
  });
}

export async function getBooks(req, res) {
  const { authorId } = req.query;

  const books = await itemsStorage.getBooks({ authorId });
  const shownBooks = books; // I'll slice array later

  res.render("books", {
    title: `Books`,
    shownBooks
  });
}

export async function addAuthor(req, res) {
  await itemsStorage.addAuthor(req.body.name);

  const queryCopy = { ...req.query };

  delete queryCopy.showAuthorForm;
  const queryStr = Object.keys(queryCopy)
    .reduce((str, key) => str + `&${key}=${queryCopy[key]}`, "")
    .slice(1);
  res.redirect(`/?${queryStr}`);
}
