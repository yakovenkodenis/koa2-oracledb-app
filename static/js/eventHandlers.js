
const booksCSVinput = document.getElementById('get_books_csv_input'),
      booksCSVbtn = document.getElementById('get_books_csv_btn'),
      countBooksInput = document.getElementById('count_all_books_input'),
      countBooksBtn = document.getElementById('count_all_books_btn');

booksCSVbtn.addEventListener('click', e => {
    e.preventDefault();
    const id = booksCSVinput.value;
    $.getJSON(`/api/v1/books_csv_by_publisher?id=${id}`, data => {
        alert(data);
    });
});

countBooksBtn.addEventListener('click', e => {
    e.preventDefault();
    const id = countBooksInput.value;
    $.getJSON(`/api/v1/count_all_books_by_author?id=${id}`, data => {
        alert(data);
    });
});
