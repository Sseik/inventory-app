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

  async getBooks({ authorId, genreId }) {
    if (!authorId && !genreId) {
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
        );
      `,
      [authorId, genreId]
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
}

export default new ItemsStorage();
