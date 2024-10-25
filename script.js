let currentPage = 1;
const booksPerPage = 6;
let allBooks = [];

async function fetchData(query) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&printType=books&maxResults=40`
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

    const maxTitleLength = 30;

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookId = book.id;

        const title = truncateTitle(bookInfo.title || 'Titre inconnu', maxTitleLength);
        const author = bookInfo.authors ? bookInfo.authors.join(', ') : 'Auteur inconnu';
        const categories = bookInfo.categories ? bookInfo.categories.join(', ') : 'Pas de catégorie';
        const thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : '../images/default-book.jpg';
        const bookUrl = `book_details.html?id=${bookId}`;

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
    const seasonalTitleElement = document.getElementById('seasonal-title');

    switch (currentMonth) {
        case 9: // Octobre
            seasonalTitleElement.textContent = "NOTRE SELECTION POUR HALLOWEEN";
            seasonalQuery = 'horror OR thriller';
            break;
        case 10: // Novembre
        case 11: // Décembre
            seasonalTitleElement.textContent = "NOTRE SELECTION POUR NOEL";
            seasonalQuery = 'romance OR christmas';
            break;
        default: // Pour le reste de l'année
            seasonalTitleElement.textContent = "NOTRE SELECTION POUR VOUS";
            seasonalQuery = 'books';
            break;
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

// Fonction pour tronquer un titre si nécessaire
function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.slice(0, maxLength - 3) + '...'; 
    }
    return title; 
}