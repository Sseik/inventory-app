import { Client } from "pg";

const SQL = `
  DROP TABLE IF EXISTS authors CASCADE;
  DROP TABLE IF EXISTS publishers CASCADE;
  DROP TABLE IF EXISTS books CASCADE;
  DROP TABLE IF EXISTS genres CASCADE;
  DROP TABLE IF EXISTS book_authors;
  DROP TABLE IF EXISTS book_genres;

  CREATE TABLE authors(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE
  );

  CREATE TABLE publishers(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE
  );

  CREATE TABLE books(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    year INTEGER  CHECK (year >= 868 AND year <= CAST(TO_CHAR(NOW(), 'YYYY') AS INTEGER)),
    description TEXT,
    image_url TEXT,
    quantity INTEGER CHECK (quantity >= 0),
    publisher_id INTEGER REFERENCES publishers(id) NOT NULL,
    UNIQUE (name, year, publisher_id)
  );

  CREATE TABLE book_authors(
    book_id INTEGER REFERENCES books(id) NOT NULL,
    author_id INTEGER REFERENCES authors(id) NOT NULL,
    PRIMARY KEY(book_id, author_id)
  );

  CREATE TABLE genres(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE
  );

  CREATE TABLE book_genres(
    book_id INTEGER REFERENCES books(id) NOT NULL,
    genre_id INTEGER REFERENCES genres(id) NOT NULL,
    PRIMARY KEY(book_id, genre_id)
  );

  INSERT INTO authors (name)
  VALUES ('Andrzej Sapkowski');

  INSERT INTO publishers (name)
  VALUES ('KSD');

  INSERT INTO books (
    name, 
    year, 
    description, 
    image_url, 
    quantity, 
    publisher_id
  ) VALUES (
    'The Witcher: The Last Wish',
    2024,
    'A dark fantasy short story collection by Polish author ' ||
    'Andrzej Sapkowski, serving as the foundational entry in ' ||
    'the internationally acclaimed Witcher saga. The book introduces ' || 
    'Geralt of Rivia, a mutated monster hunter known as a witcher, ' ||
    'who navigates a morally gray world steeped in Slavic folklore ' ||
    'and subverted fairy tale.',
    'https://static.yakaboo.ua/media/cloudflare/product/webp/352x340/9/7/9781399611398.jpg',
    10,
    1
  );

  INSERT INTO genres (name)
  VALUES ('Fantasy');

  INSERT INTO book_authors
  VALUES (1, 1);

  INSERT INTO book_genres
  VALUES (1, 1);
`;

const connectionString = process.argv.at(-1);

async function main() {
  const client = await new Client({
    connectionString
  }).connect();

  await client.query(SQL);
  await client.end();
}

main();
