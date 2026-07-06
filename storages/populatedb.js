import { Client } from "pg";

// I should point out that book.year is a year of the edition publication.
// I didn't check the validity of the inserted data though.
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
    publisher_id INTEGER NOT NULL REFERENCES publishers(id) ON DELETE CASCADE,
    UNIQUE (name, year, publisher_id)
  );

  CREATE TABLE book_authors(
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY(book_id, author_id)
  );

  CREATE TABLE genres(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE
  );

  CREATE TABLE book_genres(
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY(book_id, genre_id)
  );

  INSERT INTO authors (name)
  VALUES ('Andrzej Sapkowski'),
         ('Agatha Christie');

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
  ), (
    'The Mysterious Affair at Styles',
    2023,
    'The Mysterious Affair at Styles is the first mystery novel by ' ||
    'British writer Agatha Christie, introducing her fictional detective ' ||
    'Hercule Poirot. It was written in the middle of the First World War, ' ||
    'in 1916, and first published by John Lane in the United States in ' ||
    'October 1920 and in the United Kingdom by The Bodley Head (John ' ||
    'Lane''s UK company) on 21 January 1921.' || CHR(10) ||
    'Styles introduced Poirot, Inspector (later, Chief Inspector) Japp, ' ||
    'and Arthur Hastings. Poirot, a Belgian refugee of the Great War, ' ||
    'is settling in England near the home of Emily Inglethorp, who helped ' ||
    'him to his new life. His friend Hastings arrives as a guest at her ' ||
    'home. When Mrs Inglethorp is murdered, Poirot uses his detective skills ' ||
    'to solve the mystery.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/American_cover_of_%C2%ABThe_Mysterious_Affair_at_Styles%C2%BB.png/500px-American_cover_of_%C2%ABThe_Mysterious_Affair_at_Styles%C2%BB.png',
    2,
    1
  );

  INSERT INTO genres (name)
  VALUES ('Fantasy'),
         ('Crime Fiction');

  INSERT INTO book_authors
  VALUES (1, 1),
         (2, 2);

  INSERT INTO book_genres
  VALUES (1, 1),
         (2, 2);
`;

const connectionString = process.argv.at(-1);

async function main() {
  const client = await new Client({
    connectionString
  }).connect();

  try {
    await client.query("BEGIN");
    await client.query(SQL);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.end();
  }
}

main();
