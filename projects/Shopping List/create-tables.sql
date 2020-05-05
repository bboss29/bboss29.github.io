DROP TABLE IF EXISTS Recipe;
DROP TABLE IF EXISTS Store;
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS Trip;
DROP TABLE IF EXISTS Ordered;
DROP VIEW IF EXISTS ShoppingList;

create table Item(
  item_id int auto_increment
    primary key,
  itemName varchar(30) not null,
  price decimal(5,2) DEFAULT 0.00,
  store_id int not null,
  aisle varchar(30),
  dept varchar(30),
  notes varchar(60)
);


create table Ordered(
  order_id int auto_increment
    primary key,
  item_id int not null,
  trip_id int not null,
  quantity int not null,
  purchased tinyint(1) not null,
  constraint Ordered_Item_item_id_fk
  foreign key (item_id) references Item (item_id)
);

create table Recipe(
  recipe_item_id int auto_increment
    primary key,
  recipe_id int not null,
  item_id int not null,
  name varchar(20),
  quantity decimal(5,2) not null,
  constraint Recipe_Item_item_id_fk
  foreign key (item_id) references Item (item_id)
);

create table Store(
  store_id int auto_increment
    primary key,
  storeName varchar(30) not null,
  location varchar(50) not null
);

alter table Item
  add constraint Item_Store_store_id_fk
foreign key (store_id) references Store (store_id);

create table Trip(
  trip_id int auto_increment
    primary key,
  store_id int null,
  date date not null,
  totalCost decimal(5,2),
  constraint Trip_Store_store_id_fk
  foreign key (store_id) references Store (store_id)
);

alter table Ordered
  add constraint Ordered_Trip_trip_id_fk
foreign key (trip_id) references Trip (trip_id)
;

CREATE VIEW ShoppingList as (
  SELECT
    i.item_id,
    itemName,
    sum(o.quantity),
    price,
    aisle,
    dept,
    notes
  FROM
    Item i,
    Ordered o,
    Trip t
  WHERE
    o.trip_id = (SELECT max(t.trip_id) FROM Trip)
    and o.trip_id = t.trip_id
    and i.item_id = o.item_id
    and purchased = FALSE
  GROUP BY
    i.item_id
);

# insert stores
INSERT INTO Store (storeName, location) VALUES
  ('Mariano''s', 'Chicago'),
  ('ALDI''s', 'Skokie');

# insert items
INSERT INTO Item (itemName, price, store_id, aisle, dept, notes) VALUES
  ('Dozen Eggs', 1.75, 1, null, 'Dairy', null),
  ('18 Eggs', 2.19, 1, null, 'Dairy', null),
  ('Almond Milk', 3.49, 1, null, 'Dairy', null),
  ('Cereal', 3.99, 1, '4', 'Grocery', null),
  ('Coconut Oil', 6.99, 1, '3', 'Grocery', null),
  ('Cheese Blend', 5.79, 1, null, 'Dairy', null),
  ('Chia Seeds', 9.99, 1, '2', 'Grocery', null),
  ('Bananas', 7.99, 1, null, 'Produce', null),
  ('Strawberries', 5.99, 1, null, 'Produce', null),
  ('Spinach', 6.49, 1, null, 'Produce', null);

# insert recipes
INSERT INTO Recipe (recipe_id, item_id, quantity) VALUES
  (1, 4, '0.25'),
  (1, 3, '0.25');

# insert trip
INSERT INTO Trip (store_id, date) VALUES
  (1, now());


INSERT INTO Ordered (item_id, trip_id, quantity, purchased) VALUES
  (3, 1, 1, FALSE),
  (4, 1, 2, FALSE);