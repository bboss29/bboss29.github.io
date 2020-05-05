# REQUIRED DATABASE: retail_alert_db

INSERT INTO retail_alert_db.products (sku, name, description, quantity, dept, aisle, shelf) VALUES (1, 'mens shoes', 'size 10', 5, 'Male Fashion', 3, 4);
INSERT INTO retail_alert_db.products (sku, name, description, quantity, dept, aisle, shelf) VALUES (2, 'mens shoes', 'size 11', 6, 'Male Fashion', 3, 4);
INSERT INTO retail_alert_db.products (sku, name, description, quantity, dept, aisle, shelf) VALUES (3, 'mens shoes', 'size 12', 7, 'Male Fashion', 3, 5);
INSERT INTO retail_alert_db.products (sku, name, description, quantity, dept, aisle, shelf) VALUES (4, 'womens shoes', 'size 10', 8, 'Female Fashion', 7, 1);
INSERT INTO retail_alert_db.products (sku, name, description, quantity, dept, aisle, shelf) VALUES (5, 'womens shoes', 'size 11', 6, 'Female Fashion', 7, 1);
INSERT INTO retail_alert_db.products (sku, name, description, quantity, dept, aisle, shelf) VALUES (6, 'womens shoes', 'size 12', 6, 'Female Fashion', 7, 1);

INSERT INTO retail_alert_db.users (user_id, username, password, first_name, join_date, role, enqueued_since, available, last_name) VALUES (2, 'customer1', 'test', null, null, 'customer', null, null, null);
INSERT INTO retail_alert_db.users (user_id, username, password, first_name, join_date, role, enqueued_since, available, last_name) VALUES (3, 'associate1', 'test', null, null, 'associate', null, null, null);
INSERT INTO retail_alert_db.users (user_id, username, password, first_name, join_date, role, enqueued_since, available, last_name) VALUES (4, 'associate2', 'test', null, null, 'associate', null, null, null);
INSERT INTO retail_alert_db.users (user_id, username, password, first_name, join_date, role, enqueued_since, available, last_name) VALUES (5, 'customer2', 'test', null, null, 'customer', null, null, null);
INSERT INTO retail_alert_db.users (user_id, username, password, first_name, join_date, role, enqueued_since, available, last_name) VALUES (7, 'customer3', 'test', null, null, 'customer', null, null, null);
INSERT INTO retail_alert_db.users (user_id, username, password, first_name, join_date, role, enqueued_since, available, last_name) VALUES (8, 'associate3', 'test', null, null, 'associate', null, null, null);
INSERT INTO retail_alert_db.users (user_id, username, password, first_name, join_date, role, enqueued_since, available, last_name) VALUES (10, 'customer4', 'test', null, null, 'customer', null, null, null);
INSERT INTO retail_alert_db.users (user_id, username, password, first_name, join_date, role, enqueued_since, available, last_name) VALUES (11, 'associate4', 'test', null, null, 'associate', null, null, null);