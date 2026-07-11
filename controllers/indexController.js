import itemsStorage from "../storages/itemsStorage.js";

const SHOWN_CATEGORIES = 10;

function buildOptions(rows, checkedRows) {
  return rows.map((row) => {
    if (checkedRows.find((r) => r.id === row.id)) {
      return { id: row.id, name: row.name, selected: true };
    }

    return { id: row.id, name: row.name };
  });
}

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
  const publishers = await itemsStorage.getPublishers();
  const authors = await itemsStorage.getAuthors();
  const genres = await itemsStorage.getGenres();

  res.render("books", {
    title: `Books`,
    shownBooks,
    query: req.query,
    publishers: publishers.map((publisher) => {
      if (publisher.id == publisherId) {
        return { id: publisher.id, name: publisher.name, selected: true };
      }
      return { id: publisher.id, name: publisher.name };
    }),
    authors: authors.map((author) => {
      if (author.id == authorId) {
        return { id: author.id, name: author.name, selected: true };
      }
      return { id: author.id, name: author.name };
    }),
    genres: genres.map((genre) => {
      if (genre.id == genreId) {
        return { id: genre.id, name: genre.name, selected: true };
      }
      return { id: genre.id, name: genre.name };
    })
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

export async function addBook(req, res) {
  await itemsStorage.addBook(req.body);
  res.redirect(req.get("Referrer") || "/");
}

export async function getBook(req, res) {
  const { id } = req.params;
  const book = await itemsStorage.getBook(id);
  const authors = await itemsStorage.getBookAuthors(id);
  const publisher = await itemsStorage.getBookPublisher(id);
  const genres = await itemsStorage.getBookGenres(id);

  if (req.query.showAuthorForm) {
    const allAuthors = await itemsStorage.getAuthors();
    res.locals.authorsOptions = buildOptions(allAuthors, authors);
  } else if (req.query.showGenreForm) {
    const allGenres = await itemsStorage.getGenres();
    res.locals.genresOptions = buildOptions(allGenres, genres);
  } else if (req.query.showPublisherForm) {
    const allPublishers = await itemsStorage.getPublishers();
    allPublishers.find((p) => p.id === publisher.id).selected = true;
    res.locals.publishersOptions = allPublishers;
  }

  res.render("book", {
    book,
    authors,
    publisher,
    genres,
    query: req.query
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

export async function deleteBook(req, res) {
  const { id } = req.params;
  await itemsStorage.deleteBook(id);
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

export async function updateBookName(req, res) {
  const { bookId, name } = req.body;
  await itemsStorage.updateBookName(bookId, name);
  res.redirect(`/book/${bookId}`);
}

export async function updateBookCover(req, res) {
  const { bookId, image } = req.body;
  await itemsStorage.updateBookCover(bookId, image);
  res.redirect(`/book/${bookId}`);
}

export async function updateBookAuthors(req, res) {
  const { bookId, authors } = req.body;
  await itemsStorage.updateBookAuthors(bookId, authors);
  res.redirect(`/book/${bookId}`);
}

export async function updateBookPublisher(req, res) {
  const { bookId, publisher } = req.body;
  await itemsStorage.updateBookPublisher(bookId, publisher);
  res.redirect(`/book/${bookId}`);
}

export async function updateBookYear(req, res) {
  const { bookId, year } = req.body;
  await itemsStorage.updateBookYear(bookId, year);
  res.redirect(`/book/${bookId}`);
}

export async function updateBookGenres(req, res) {
  const { bookId, genres } = req.body;
  await itemsStorage.updateBookGenres(bookId, genres);
  res.redirect(`/book/${bookId}`);
}

export async function updateBookDescription(req, res) {
  const { bookId, description } = req.body;
  await itemsStorage.updateBookDescription(bookId, description);
  res.redirect(`/book/${bookId}`);
}

export async function decrementBookQuantity(req, res) {
  const { bookId } = req.params;
  const book = await itemsStorage.getBook(bookId);
  if (book.quantity > 0) {
    await itemsStorage.updateBookQuantity(bookId, book.quantity - 1);
  }
  res.redirect(`/book/${bookId}`);
}

export async function incrementBookQuantity(req, res) {
  const { bookId } = req.params;
  const book = await itemsStorage.getBook(bookId);
  await itemsStorage.updateBookQuantity(bookId, book.quantity + 1);
  res.redirect(`/book/${bookId}`);
}

export async function removeBookAuthor(req, res) {
  const { bookId, authorId } = req.params;
  await itemsStorage.deleteBookAuthor(bookId, authorId);
  res.redirect(`/book/${bookId}`);
}

export async function removeBookGenre(req, res) {
  const { bookId, genreId } = req.params;
  await itemsStorage.deleteBookGenre(bookId, genreId);
  res.redirect(`/book/${bookId}`);
}
