document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
    let currentCategory = localStorage.getItem('selectedCategory') || '';

    function fetchData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                renderCards(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function renderCards(data) {
        const categoryData = data.categories.find(category => category.category_name.toLowerCase() === currentCategory.toLowerCase());
        const cardsContainer = document.querySelector('.cards');
        cardsContainer.innerHTML = '';

        if (categoryData) {
            categoryData.category_products.forEach(product => {
                const card = document.createElement('div');
                const titleWords = product.title.split(' '); // Split title into words
                const truncatedTitle = titleWords.slice(0, 2).join(' '); // Take first two words
                const displayTitle = titleWords.length > 2 ? truncatedTitle + '..' : truncatedTitle; // Add two dots if title is truncated
                card.innerHTML = `
                    <img src="${product.image}" />
                    ${product.badge_text ? `<div class="badge-text">${product.badge_text}</div>` : ''}
                    <div class="card-row-one">
                        <p id="title">${displayTitle}</p>
                        <span>.</span>
                        <p id="vender">${product.vendor}</p>
                    </div>
                    <div class="card-row-two">
                        <p id="price">Rs ${product.price}.00</p>
                        <p id="compare_at_price">Rs ${product.compare_at_price}.00</p>
                        <p id="offer">${calculateOffer(product.price, product.compare_at_price)}</p>
                    </div>
                    <div class="add-to-cart-btn">
                        <button>Add to Cart</button>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
        }
    }

    function calculateOffer(price, compareAtPrice) {
        const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
        return `${discount.toFixed(0)}% Off`;
    }

    const categoryButtons = document.querySelectorAll('.choices-btn-group button');
    categoryButtons.forEach(button => {
        // Highlight the selected category button when the page loads
        if (button.textContent.trim() === currentCategory) {
            button.classList.add('selected');
        }
        button.addEventListener('click', function () {
            const isSelected = this.classList.contains('selected');

            // Remove 'selected' class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('selected'));

            // Hide cards if the same button is clicked again
            if (isSelected) {
                currentCategory = '';
                localStorage.removeItem('selectedCategory'); // Remove category from local storage
                fetchData();
            } else {
                // Add 'selected' class to clicked button
                this.classList.add('selected');
                currentCategory = this.textContent.trim();
                localStorage.setItem('selectedCategory', currentCategory); // Store selected category in local storage
                fetchData();
            }
        });
    });

    fetchData();
});
