let popularBooks = [];

async function fetchData(query) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&orderBy=relevance&printType=books`
        );
        const data = await response.json();
        console.log(data);
        return data.items || [];
        
    } catch (error) {
        console.error("Erreur de récupération des livres:", error);
        return [];
    }
}

async function displayTopRatedBooks() {
    const container = document.querySelector('.popular-book-list-home');
    container.innerHTML = '';

    popularBooks = await fetchData();

    const topRatedBooks = popularBooks.slice(0, 10);
    const maxTitleLength = 30;

    topRatedBooks.forEach(book => {
        const bookId = book.id;
        const bookInfo = book.volumeInfo;
        const bookTitle = truncateTitle(bookInfo.title || 'Titre inconnu', maxTitleLength);
        const bookAuthors = bookInfo.authors ? bookInfo.authors.join(', ') : 'Auteur inconnu';
        const bookThumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : '../images/default-book.jpg';
        const bookcategories = bookInfo.categories ? bookInfo.categories.join(', ') : 'Pas de catégorie';
        const bookUrl = `pages/book_details.html?id=${bookId}`;

        const bookElement = document.createElement('article');
        bookElement.classList.add('popular-book-home');

        bookElement.innerHTML = `
            <figure>
                <a href="${bookUrl}">
                    <img src="${bookThumbnail}" alt="Couverture du livre" />
                </a>
            </figure>
            <div class="popular-book-content">
                <h3>${bookTitle}</h3>
                <p>${bookAuthors}</p>
                <p>${bookcategories}</p>
            </div>
        `;

        container.appendChild(bookElement);
    });
}

window.addEventListener('load', displayTopRatedBooks);

function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.slice(0, maxLength - 3) + '...'; 
    }
    return title; 
}