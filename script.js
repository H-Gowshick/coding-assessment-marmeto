// Wait for the DOM content to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // API URL for fetching data
    const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
    
    // Retrieve the selected category from local storage or default to an empty string
    let currentCategory = localStorage.getItem('selectedCategory') || '';

    // Function to fetch data from the API
    function fetchData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                renderCards(data); // Call the renderCards function with the fetched data
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to render product cards based on the fetched data
    function renderCards(data) {
        // Find the category data based on the current selected category
        const categoryData = data.categories.find(category => category.category_name.toLowerCase() === currentCategory.toLowerCase());
        const cardsContainer = document.querySelector('.cards'); // Get the container for product cards
        cardsContainer.innerHTML = ''; // Clear previous card content

        if (categoryData) {
            // Iterate through each product in the category data
            categoryData.category_products.forEach(product => {
                const card = document.createElement('div'); // Create a div element for the card
                const titleWords = product.title.split(' '); // Split title into words
                const truncatedTitle = titleWords.slice(0, 2).join(' '); // Take first two words
                const displayTitle = titleWords.length > 2 ? truncatedTitle + '..' : truncatedTitle; // Add two dots if title is truncated
                
                // Set inner HTML for the card element
                card.innerHTML = `
                    <img src="${product.image}" /> // Product image
                    ${product.badge_text ? `<div class="badge-text">${product.badge_text}</div>` : ''} // Product badge text if available
                    <div class="card-row-one">
                        <p id="title">${displayTitle}</p> // Product title
                        <span>.</span>
                        <p id="vender">${product.vendor}</p> // Product vendor
                    </div>
                    <div class="card-row-two">
                        <p id="price">Rs ${product.price}.00</p> // Product price
                        <p id="compare_at_price">Rs ${product.compare_at_price}.00</p> // Compare at price
                        <p id="offer">${calculateOffer(product.price, product.compare_at_price)}</p> // Offer information
                    </div>
                    <div class="add-to-cart-btn">
                        <button>Add to Cart</button> // Add to cart button
                    </div>
                `;
                cardsContainer.appendChild(card); // Append the card to the cards container
            });
        }
    }

    // Function to calculate the discount percentage
    function calculateOffer(price, compareAtPrice) {
        const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
        return `${discount.toFixed(0)}% Off`; // Return formatted discount percentage
    }

    // Get all category buttons
    const categoryButtons = document.querySelectorAll('.choices-btn-group button');
    // Add event listener to each category button
    categoryButtons.forEach(button => {
        // Highlight the selected category button when the page loads
        if (button.textContent.trim() === currentCategory) {
            button.classList.add('selected'); // Add 'selected' class to the button
        }
        // Add click event listener to each button
        button.addEventListener('click', function () {
            const isSelected = this.classList.contains('selected'); // Check if the button is already selected
            
            // Remove 'selected' class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Hide cards if the same button is clicked again
            if (isSelected) {
                currentCategory = ''; // Clear the current category
                localStorage.removeItem('selectedCategory'); // Remove category from local storage
                fetchData(); // Fetch data without filtering by category
            } else {
                // Add 'selected' class to clicked button
                this.classList.add('selected');
                currentCategory = this.textContent.trim(); // Get the text content of the clicked button
                localStorage.setItem('selectedCategory', currentCategory); // Store selected category in local storage
                fetchData(); // Fetch data based on the selected category
            }
        });
    });

    fetchData(); // Fetch data when the page loads
});
