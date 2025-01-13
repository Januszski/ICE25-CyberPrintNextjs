-- Create the users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,  -- email as user ID
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

-- Create the cards table
CREATE TABLE cards (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- unique card ID
  card_number VARCHAR(16) NOT NULL,
  expiration_date DATE NOT NULL,
  cvc VARCHAR(3) NOT NULL
);

-- Create the user_cards table to associate users with cards
CREATE TABLE user_cards (
  user_id VARCHAR(255),
  card_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (card_id) REFERENCES cards(id),
  PRIMARY KEY (user_id, card_id)
);

-- Insert sample data into the users table
INSERT INTO users (id, name, email) VALUES
  ('user@example.com', 'John Doe', 'user@example.com'),
  ('ert@asd.com', 'Jane Doe', 'ert@asd.com');

-- Insert sample data into the cards table
INSERT INTO cards (card_number, expiration_date, cvc) VALUES
  ('1234567890123456', '2025-12-31', '123'),
  ('2345678901234567', '2026-01-31', '234'),
  ('3456789012345678', '2027-02-28', '345');

-- Insert sample data into the user_cards table to associate users with cards
INSERT INTO user_cards (user_id, card_id) VALUES
  ('user@example.com', 1),
  ('ert@asd.com', 2),
  ('ert@asd.com', 3);
