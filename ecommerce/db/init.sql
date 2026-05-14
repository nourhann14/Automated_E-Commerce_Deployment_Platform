CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  price_cents INT NOT NULL,
  image_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_created_at (created_at)
) ENGINE=InnoDB;

INSERT INTO products (name, description, price_cents, image_url) VALUES
  ('Wireless Mouse', 'Ergonomic wireless mouse', 1599, 'https://picsum.photos/seed/mouse/300/200'),
  ('Mechanical Keyboard', 'Tactile switches, RGB backlight', 6999, 'https://picsum.photos/seed/keyboard/300/200'),
  ('USB-C Hub', 'HDMI + USB-A + SD card', 2499, 'https://picsum.photos/seed/hub/300/200');


