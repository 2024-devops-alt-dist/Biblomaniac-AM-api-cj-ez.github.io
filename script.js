let currentPage = 1;
const booksPerPage = 6;
let allBooks = [];

async function fetchData(query) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
        );
        const data = await response.json();
        return data.items || []; 
    } catch (error) {
        console.log("Erreur", error);
        return []; 
    }
}

function displayBooks(books, containerSelector, isSeasonal = false) {
    const bookList = document.querySelector(containerSelector);
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p class="no-books-message">Aucun livre trouvé.</p>'; 
        return;
    }

    books.forEach(book => {
        const bookInfo = book.volumeInfo;

        const title = bookInfo.title || 'Unknown Title';
        const author = bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author';
        const categories = bookInfo.categories ? bookInfo.categories.join(', ') : 'No Category';
        const thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : '../images/default-book.jpg';
        const bookUrl = bookInfo.previewLink || '#';

        const articleClass = isSeasonal ? 'popular-book seasonal-book' : 'popular-book';
        const contentClass = isSeasonal ? 'popular-book-content-seasonal' : 'popular-book-content';

        const bookHTML = `
            <article class="${articleClass}">
                <figure>
                    <a href="${bookUrl}">
                        <img src="${thumbnail}" alt="Book cover" />
                    </a>
                </figure>
                <div class="${contentClass}">
                    <h3>${title}</h3>
                    <p>${author}</p>
                    <p>${categories}</p>
                </div>
            </article>
        `;

        bookList.innerHTML += bookHTML;
    });
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allBooks.length / booksPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} sur ${totalPages}`;
    document.getElementById('prev-button').disabled = currentPage === 1;
    document.getElementById('next-button').disabled = currentPage === totalPages;
}

function showPage(page) {
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToDisplay = allBooks.slice(startIndex, endIndex);
    displayBooks(booksToDisplay, '.book-list');
    updatePaginationControls();
}

async function loadDefaultBooks() {
    allBooks = await fetchData('books'); 
    currentPage = 1; 
    showPage(currentPage);
}

document.getElementById('prev-button').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

document.getElementById('next-button').addEventListener('click', () => {
    const totalPages = Math.ceil(allBooks.length / booksPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
    }
});

async function loadSeasonalBooks() {
    const currentMonth = new Date().getMonth();

    let seasonalQuery;
    if (currentMonth === 9) {
        seasonalQuery = 'horror OR thriller';
    } else if (currentMonth === 10 || currentMonth === 11) {
        seasonalQuery = 'romance OR christmas';
    } else {
        seasonalQuery = 'books';
    }

    const seasonalBooks = await fetchData(seasonalQuery);
    displayBooks(seasonalBooks.slice(0, 6), '.seasonal-book-list', true); // Limite 6 livres
}

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim(); 
    if (query) {
        fetchData(query).then(books => {
            allBooks = books;
            currentPage = 1;
            showPage(currentPage);
        }).catch(error => console.error('Erreur :', error));
    } else {
        loadDefaultBooks();
    }
});

// Charger des livres et des sélections saisonnières lorsque la page est chargée
window.addEventListener('load', () => {
    loadDefaultBooks();
    loadSeasonalBooks();
});
