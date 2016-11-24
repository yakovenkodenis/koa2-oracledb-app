-- ================================================
-- ====== Create sequences for future tables ======
-- ================================================
create sequence books_seq;
create sequence publishers_seq;
create sequence authors_seq;
create sequence sales_seq;
create sequence users_seq;
create sequence supply_registry_seq;
create sequence errors_registry_seq;


-- =================================================
-- ================= Create tables =================
-- =================================================
create table users (
  id number(5) not null primary key,
  first_name varchar2(20) not null,
  last_name varchar2(20) not null,
  email varchar2(30) not null,
  password varchar2(600) not null
  )
  pctfree 10
  pctused 60
  storage (initial 7k next 7k pctincrease 0 maxextents 10
);

create table publishers (
  id number(5) not null primary key,
  name varchar(20) not null
  )
  pctfree 10
  pctused 60
  storage (initial 7k next 7k pctincrease 0 maxextents 10
);

create table authors (
  id number(5) not null primary key,
  first_name varchar2(20) not null,
  last_name varchar2(20) not null,
  birthday date
  )
  pctfree 10
  pctused 60
  storage (initial 7k next 7k pctincrease 0 maxextents 10
);

create table books (
  id number(5) not null primary key,
  name varchar2(200) not null,
  description varchar2(2000),
  cover_img varchar2(300),
  available_count number(4) not null,
  price number(10, 2) default null,
  author_id number(5) references authors(id) on delete cascade,
  publisher_id number(5) references publishers(id) on delete cascade
  )
  pctfree 10
  pctused 60
  storage (initial 7k next 7k pctincrease 0 maxextents 10
);

create table sales (
  id number(5) not null primary key,
  sale_date date default sysdate,
  user_id number(5) references users(id) on delete cascade,
  book_id number(5) references books(id) on delete cascade,
  books_count not null integer
  )
  pctfree 10
  pctused 60
  storage (initial 7k next 7k pctincrease 0 maxextents 10
);

create table supply_registry(
  id number(5) not null primary key,
  supply_date date default sysdate,
  book_id number(5) references books(id),
  books_count integer not null
);

create table errors_registry(
  id number(5) not null primary key,
  error_datetime timestamp,
  error_user varchar2(30),
  db_name varchar2(20),
  error_stack varchar2(2000),
  captured_sql varchar2(1000)
);



-- =================================================
-- ================= Create idices =================
-- =================================================
create index books_name_ind on books(name);
create index publishers_name_ind on publishers(name);



-- ==================================================
-- ================= Create package =================
-- ==================================================

create or replace package books_store is
  function get_books_csv_by_publisher(publisher_id in publishers.id%type) return varchar2;
  function count_all_books_by_author(author_id in authors.id%type) return integer;
  
  procedure buy_book(user_id users.id%type, book_id books.id%type, books_count books.available_count%type);
  procedure add_books_to_store(
    book_name books.name%type, book_author_id books.author_id%type,
    book_description books.description%type default null,
    book_publisher_id books.publisher_id%type, book_cover_img books.cover_img%type,
    books_count books.available_count%type, book_price books.price%type);
  
  procedure register_user(
    user_first_name users.first_name%type, user_last_name users.last_name%type,
    user_email users.email%type, user_password users.password%type);
  
  procedure add_author(
    author_first_name authors.first_name%type, author_last_name authors.last_name%type,
    author_birthday authors.birthday%type);
  procedure cascade_remove_author(author_id authors.id%type);
  
  procedure add_publisher(publisher_name publishers.name%type);
  procedure cascade_remove_publisher(publisher_id publishers.id%type);
  
  procedure create_sale(
    sale_user_id sales.user_id%type, sale_book_id sales.book_id%type,
    sale_books_count sales.books_count%type, date_of_sale sales.sale_date%type default sysdate);
    
  procedure set_discount_for_publisher(publisher_id publishers.id%type, discount number);
end books_store;



-- ===============================================================
-- ===================== Create package body =====================
-- ===============================================================
create or replace package body books_store is

  function get_books_csv_by_publisher(publisher_id in publishers.id%type) return varchar2 as
    result varchar2(2000);
    book_name books.name%type;
    cursor books_cur is select books.name from books where books.publisher_id = publisher_id;
    begin
        result := '';
        open books_cur;
        loop
          fetch books_cur into book_name;
          exit when books_cur%notfound;
          result := result || book_name || ',';
        end loop;
        close books_cur;
        
        return result;
    end get_books_csv_by_publisher;
    
  function count_all_books_by_author(author_id in authors.id%type) return integer as
    result integer;
    begin
      select sum(available_count) into result from books where books.author_id = author_id;
      return result;
    end count_all_books_by_author;
  
  procedure buy_book(user_id users.id%type, book_id books.id%type, books_count books.available_count%type) is
    currently_available_books books.available_count%type;
    not_enough_books_in_store exception;
    negative_or_zero_count exception;
    begin
      select available_count into currently_available_books from books where id = book_id;

      if currently_available_books - books_count < 0 then
        raise not_enough_books_in_store;
      elsif books_count <= 0 then
        raise negative_or_zero_count;
      end if;
      
      insert into sales values (sales_seq.nextval, sysdate, user_id, book_id, books_count);
      
      exception
        when not_enough_books_in_store then
          raise_application_error(-20001, 'Not enough books in store');
        when negative_or_zero_count then
          raise_application_error(-20002, 'You cannot buy 0 or less books');
    end buy_book;
  
  procedure add_books_to_store(
    book_name books.name%type, book_author_id books.author_id%type,
    book_description books.description%type default null,
    book_publisher_id books.publisher_id%type, book_cover_img books.cover_img%type,
    books_count books.available_count%type, book_price books.price%type)
    is
    existing_books_count integer;
    add_negative_or_zero_books exception;
    begin
      if books_count <= 0 then
        raise add_negative_or_zero_books;
      end if;
      
      select count(*) into existing_books_count from books
      where
        name = book_name and author_id = book_author_id and
        description = book_description and publisher_id = book_publisher_id and
        price = book_price;
        
      if existing_books_count = 0 then
        insert into books
          (id, name, description, cover_img, available_count, price, author_id, publisher_id) 
          values (books_seq.nextval, book_name, book_description,
          book_cover_img, books_count, book_price, book_author_id, book_publisher_id);
      else
        update books set available_count = available_count + books_count
          where
            name = book_name and author_id = book_author_id and
            description = book_description and publisher_id = book_publisher_id and
            price = book_price;
      end if;
      
      exception
        when add_negative_or_zero_books then
          raise_application_error(-20003, 'You cannot add 0 or less books');
    end add_books_to_store;

  procedure register_user(
    user_first_name users.first_name%type, user_last_name users.last_name%type,
    user_email users.email%type, user_password users.password%type) is
    same_users_count integer;
    user_already_exists exception;
    begin
      select count(*) into same_users_count from users where email = user_email;
      if same_users_count = 0 then
        insert into users values (users_seq.nextval, user_first_name, user_last_name,
          user_email, user_password);
      else
        raise user_already_exists;
      end if;
      
      exception
        when user_already_exists then
          raise_application_error(-20004, 'User with email <' || user_email || '> already exists');
    end register_user;
    
  procedure add_author(
    author_first_name authors.first_name%type, author_last_name authors.last_name%type,
    author_birthday authors.birthday%type) is
    existing_authors_count integer;
    author_already_exists exception;
    begin
      select count(*) into existing_authors_count from authors
      where first_name = author_first_name and last_name = author_last_name;
      
      if existing_authors_count = 0 then
        insert into authors values (authors_seq.nextval, author_first_name,
          author_last_name, author_birthday);
      else
        raise author_already_exists;
      end if;
      
      exception
        when author_already_exists then
          raise_application_error(-20005, 'Author already exists');
    end add_author;
    
  procedure cascade_remove_author(author_id authors.id%type) is
    begin
      delete from books where books.author_id = author_id;
      delete from authors where id = author_id;
    end cascade_remove_author;
    
  procedure add_publisher(publisher_name publishers.name%type) is
    existing_publishers_count integer;
    publisher_already_exists exception;
    begin
      select count(*) into existing_publishers_count from publishers where name = publisher_name;
      if existing_publishers_count = 0 then
        insert into publishers values (publishers_seq.nextval, publisher_name);
      else
        raise publisher_already_exists;
      end if;
      
      exception
        when publisher_already_exists then
          raise_application_error(-20006, 'Publisher already exists');
    end add_publisher;
    
  procedure cascade_remove_publisher(publisher_id publishers.id%type) is
    begin
      delete from books where books.publisher_id = publisher_id;
      delete from publishers where id = publisher_id;
    end cascade_remove_publisher;
    
  procedure create_sale(
    sale_user_id sales.user_id%type, sale_book_id sales.book_id%type,
    sale_books_count sales.books_count%type, date_of_sale sales.sale_date%type default sysdate) is
    begin
      insert into sales values (sales_seq.nextval, date_of_sale, sale_user_id,
        sale_book_id, sale_books_count);
    end create_sale;
    
  procedure set_discount_for_publisher(publisher_id publishers.id%type, discount number) is
    new_price books.price%type;
    current_book_id books.id%type;
    cursor books_cur is select id, price from books where books.publisher_id = publisher_id;
    too_large_discount exception;
    begin
      if discount >= 100 then
        raise too_large_discount;
      end if;

      open books_cur;
      loop
        fetch books_cur into current_book_id, new_price;
        exit when books_cur%notfound;
        
        new_price := new_price - new_price / 100 * discount;
        
        update books set price = new_price where id = current_book_id;
        commit;
      end loop;
      close books_cur;
      
      exception
        when too_large_discount then
          raise_application_error(-20007, 'Discount cannot be more than 99%');
    end set_discount_for_publisher;

end books_store;



-- ===========================================================
-- ===================== Create triggers =====================
-- ===========================================================
create or replace trigger update_books_count_after_buy
  after insert on sales
  for each row
  declare
    books_count integer;
  begin
    select books.available_count into books_count from books where id = :NEW.book_id;
    
    if books_count - :NEW.books_count <= 0 then
      raise_application_error(-10002, 'You cannot buy 0 or less books');
    else
      update books set available_count = available_count - :NEW.books_count
      where id = :NEW.book_id;
    end if;
  end;

create or replace trigger update_supply_registry
  after insert or update of available_count on books
  referencing NEW as new_book OLD as old_book
  for each row
  declare
    books_increase boolean;
  begin
    if :new_book.available_count < 0 then
      raise_application_error(-60001, 'Negative books count');
    end if;
    
    if inserting then
      insert into supply_registry values (supply_registry_seq.nextval, sysdate,
        :new_book.id, :new_book.available_count);
    elsif updating then
      books_increase := (:new_book.available_count - :old_book.available_count > 0);
      if books_increase then
        insert into supply_registry values (supply_registry_seq.nextval, sysdate,
          :new_book.id, :new_book.available_count - :old_book.available_count);
      end if;
    end if;
  end;

create or replace trigger log_server_errors
  after servererror on database
  declare
    sql_text ora_name_list_t;
    stmt clob;
    n number;
  begin
    n := ora_sql_txt(sql_text);

    if n > 1000 then n := 1000;
    end if;
    
    for i in 1..n loop
      stmt := stmt || sql_text(i);
    end loop;
    
    insert into errors_registry
      (id, error_datetime, error_user, db_name, error_stack, captured_sql)
    values
      (errors_registry_seq.nextval, systimestamp, sys.login_user,
      sys.database_name, dbms_utility.format_error_stack, stmt);
    commit;
  end;
