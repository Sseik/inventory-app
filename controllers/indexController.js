import itemsStorage from "../storages/itemsStorage.js";

const SHOWN_CATEGORIES = 10;

export async function getCategories(req, res) {
  const authors = await itemsStorage.getAuthors();
  const genres = await itemsStorage.getGenres();
  const publishers = await itemsStorage.getPublishers();

  const { authorsPage = 1, genresPage = 1, publishersPage = 1 } = req.query;

  const authorsFirstIndex = SHOWN_CATEGORIES * (authorsPage - 1);
  const genresFirstIndex = SHOWN_CATEGORIES * (genresPage - 1);
  const publishersFirstIndex = SHOWN_CATEGORIES * (publishersPage - 1);

  const shownAuthors = authors.slice(
    authorsFirstIndex,
    authorsFirstIndex + SHOWN_CATEGORIES
  );

  const shownGenres = genres.slice(
    genresFirstIndex,
    genresFirstIndex + SHOWN_CATEGORIES
  );

  const shownPublishers = publishers.slice(
    publishersFirstIndex,
    publishersFirstIndex + SHOWN_CATEGORIES
  );

  res.render("index", {
    title: "Books Inventory",
    shownAuthors,
    shownGenres,
    shownPublishers,
    authorsPage,
    genresPage,
    publishersPage,
    query: req.query,
    authorsPages: Math.ceil(authors.length / SHOWN_CATEGORIES),
    genresPages: Math.ceil(genres.length / SHOWN_CATEGORIES),
    publishersPages: Math.ceil(publishers.length / SHOWN_CATEGORIES)
  });
}

export async function getBooks(req, res) {
  const { authorId, genreId, publisherId } = req.query;

  const books = await itemsStorage.getBooks({ authorId, genreId, publisherId });
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

export async function addGenre(req, res) {
  await itemsStorage.addGenre(req.body.name);

  const queryCopy = { ...req.query };

  delete queryCopy.showGenreForm;
  const queryStr = Object.keys(queryCopy)
    .reduce((str, key) => str + `&${key}=${queryCopy[key]}`, "")
    .slice(1);
  res.redirect(`/?${queryStr}`);
}

export async function addPublisher(req, res) {
  await itemsStorage.addPublisher(req.body.name);

  const queryCopy = { ...req.query };

  delete queryCopy.showPublisherForm;
  const queryStr = Object.keys(queryCopy)
    .reduce((str, key) => str + `&${key}=${queryCopy[key]}`, "")
    .slice(1);
  res.redirect(`/?${queryStr}`);
}

export async function getBook(req, res) {
  const { id } = req.params;
  const book = await itemsStorage.getBook(id);
  const authors = await itemsStorage.getBookAuthors(id);
  const publisher = await itemsStorage.getBookPublisher(id);
  const genres = await itemsStorage.getBookGenres(id);
  res.render("book", {
    book,
    authors,
    publisher,
    genres
  });
}

export async function deleteAuthor(req, res) {
  const { id } = req.params;
  await itemsStorage.deleteAuthor(id);
  res.redirect(req.get("Referrer") || "/");
}

export async function deleteGenre(req, res) {
  const { id } = req.params;
  await itemsStorage.deleteGenre(id);
  res.redirect(req.get("Referrer") || "/");
}

export async function deletePublisher(req, res) {
  const { id } = req.params;
  await itemsStorage.deletePublisher(id);
  res.redirect(req.get("Referrer") || "/");
}

export async function updateAuthor(req, res) {
  const { id } = req.query;
  const { name } = req.body;

  await itemsStorage.updateAuthor(id, name);

  const queryCopy = { ...req.query };

  delete queryCopy.showAuthorEditForm;
  delete queryCopy.id;
  const queryStr = Object.keys(queryCopy)
    .reduce((str, key) => str + `&${key}=${queryCopy[key]}`, "")
    .slice(1);
  res.redirect(`/?${queryStr}`);
}

export async function updateGenre(req, res) {
  const { id } = req.query;
  const { name } = req.body;

  await itemsStorage.updateGenre(id, name);

  const queryCopy = { ...req.query };

  delete queryCopy.showGenreEditForm;
  delete queryCopy.id;
  const queryStr = Object.keys(queryCopy)
    .reduce((str, key) => str + `&${key}=${queryCopy[key]}`, "")
    .slice(1);
  res.redirect(`/?${queryStr}`);
}

export async function updatePublisher(req, res) {
  const { id } = req.query;
  const { name } = req.body;

  await itemsStorage.updatePublisher(id, name);

  const queryCopy = { ...req.query };

  delete queryCopy.showPublisherEditForm;
  delete queryCopy.id;
  const queryStr = Object.keys(queryCopy)
    .reduce((str, key) => str + `&${key}=${queryCopy[key]}`, "")
    .slice(1);
  res.redirect(`/?${queryStr}`);
}
