# REQUIRED DATABASE: retail_alert_db

create table assistance_queue
(
  request_id int auto_increment
    primary key,
  customer_id int not null,
  associate_id int null,
  enqueued_since datetime not null,
  request_details varchar(150) null,
  request_complete tinyint(1) default '0' not null,
  location varchar(30) null,
  constraint assistance_queue_request_id_uindex
  unique (request_id)
)
  engine=InnoDB
;

create table products
(
  sku int auto_increment
    primary key,
  name varchar(30) not null,
  description varchar(30) null,
  quantity int null,
  dept varchar(30) null,
  aisle int null,
  shelf int null,
  constraint products_sku_uindex
  unique (sku)
)
  engine=InnoDB
;

create table users
(
  user_id int auto_increment
    primary key,
  username varchar(30) not null,
  password varchar(30) null,
  first_name varchar(30) null,
  join_date date null,
  role varchar(30) not null,
  enqueued_since timestamp null,
  available tinyint(1) null,
  last_name varchar(30) null,
  constraint users_user_id_uindex
  unique (user_id),
  constraint users_username_uindex
  unique (username)
)
  engine=InnoDB
;