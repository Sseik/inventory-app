import { Pool } from "pg";

// Probably should have just called it Inventory but I wanted to have "Storage" in the name
class ItemsStorage {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.CONNECTION_STRING
    });
  }

  async getAuthors() {
    const { rows } = await this.pool.query("SELECT * FROM authors;");
    return rows;
  }

  async getBooks({ authorId, genreId, publisherId }) {
    if (!authorId && !genreId && !publisherId) {
      const { rows } = await this.pool.query("SELECT * FROM books;");
      return rows;
    }

    const { rows } = await this.pool.query(
      `
        SELECT * FROM books
        WHERE EXISTS(
          SELECT * FROM book_authors
          WHERE book_id = books.id
          AND author_id = $1
        ) OR EXISTS (
            SELECT * FROM book_genres
            WHERE book_id = books.id
            AND genre_id = $2
        ) OR publisher_id = $3;
      `,
      [authorId, genreId, publisherId]
    );

    return rows;
  }

  async getPublishers() {
    const { rows } = await this.pool.query("SELECT * FROM publishers;");

    return rows;
  }

  async getGenres() {
    const { rows } = await this.pool.query("SELECT * FROM genres;");

    return rows;
  }

  async getBookAuthors(bookId) {
    const { rows } = await this.pool.query(
      `
        SELECT author_id AS id, name
        FROM book_authors
        JOIN authors
        ON author_id = authors.id
        WHERE book_id = $1;
      `,
      [bookId]
    );

    return rows;
  }

  async getBookGenres(bookId) {
    const { rows } = await this.pool.query(
      `
        SELECT genre_id AS id, name
        FROM book_genres
        JOIN genres
        ON genre_id = genres.id
        WHERE book_id = $1
      `,
      [bookId]
    );

    return rows;
  }

  async getBookPublisher(bookId) {
    const { rows } = await this.pool.query(
      `
        SELECT publishers.id AS id, publishers.name AS name
        FROM books
        JOIN publishers
        ON publisher_id = publishers.id
        WHERE books.id = $1;
      `,
      [bookId]
    );

    return rows[0];
  }

  async getBook(id) {
    const { rows } = await this.pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );

    return rows[0];
  }

  async addAuthor(name) {
    await this.pool.query("INSERT INTO authors (name) VALUES ($1)", [name]);
  }

  async addGenre(name) {
    await this.pool.query("INSERT INTO genres (name) VALUES ($1)", [name]);
  }

  async addPublisher(name) {
    await this.pool.query("INSERT INTO publishers (name) VALUES ($1)", [name]);
  }

  async deleteAuthor(id) {
    await this.pool.query("DELETE FROM authors WHERE id = $1", [id]);
  }

  async deleteGenre(id) {
    await this.pool.query("DELETE FROM genres WHERE id = $1", [id]);
  }

  async deletePublisher(id) {
    await this.pool.query("DELETE FROM publishers WHERE id = $1", [id]);
  }

  async deleteBook(id) {
    await this.pool.query("DELETE FROM books WHERE id = $1", [id]);
  }

  async updateAuthor(id, name) {
    await this.pool.query(
      `
        UPDATE authors
        SET name = $1
        WHERE id = $2
      `,
      [name, id]
    );
  }

  async updateGenre(id, name) {
    await this.pool.query(
      `
        UPDATE genres
        SET name = $1
        WHERE id = $2
      `,
      [name, id]
    );
  }

  async updatePublisher(id, name) {
    await this.pool.query(
      `
        UPDATE publishers
        SET name = $1
        WHERE id = $2
      `,
      [name, id]
    );
  }
}

export default new ItemsStorage();
