DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS forums CASCADE;
DROP TABLE IF EXISTS threads CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS votes CASCADE;

CREATE TABLE IF NOT EXISTS users
(
  mail VARCHAR PRIMARY KEY UNIQUE NOT NULL,
  fullname VARCHAR NOT NULL,
  about TEXT,
  nickname VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS forums
(
  posts BIGINT DEFAULT 0,
  slug TEXT  UNIQUE NOT NULL PRIMARY KEY,
  threads INTEGER DEFAULT 0,
  title VARCHAR NOT NULL,
  userNickname VARCHAR NOT NULL REFERENCES users(nickname)
);

CREATE TABLE IF NOT EXISTS threads
(
  author VARCHAR NOT NULL REFERENCES users(nickname),
  created TIMESTAMP WITH TIME ZONE DEFAULT  current_timestamp,
  forum TEXT NOT NULL REFERENCES forums(slug),
  id SERIAL NOT NULL UNIQUE PRIMARY KEY,
  message TEXT NOT NULL,
  slug TEXT UNIQUE,
  title VARCHAR NOT NULL,
  votes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts
(
  author VARCHAR NOT NULL REFERENCES users(nickname),
  created TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  forum TEXT NOT NULL REFERENCES forums(slug),
  id SERIAL NOT NULL UNIQUE PRIMARY KEY,
  isEdited BOOLEAN NOT NULL DEFAULT FALSE,
  message TEXT NOT NULL,
  parent BIGINT DEFAULT 0,
  thread INTEGER NOT NULL REFERENCES threads(id)
);

CREATE TABLE IF NOT EXISTS votes
(
  voterNickname VARCHAR NOT NULL REFERENCES users(nickname),
  voice INTEGER DEFAULT 0,
  voiceThread INTEGER NOT NULL REFERENCES threads(id),
  PRIMARY KEY(voterNickname, voiceThread)
);
