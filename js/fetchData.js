// Function to fetch and display CSFloat listings
async function fetchListings() {
    const apiKey = 'KI2mYSeW0QqUNwbY5p5P_nTTeCxBn07-'; // Replace with your API key
    const url = `https://csfloat.com/api/v1/listings`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Function to display listings
        displayListings(data);
    } catch (error) {
        console.error('Error fetching listings:', error);
        document.getElementById('error').innerText = 'Error fetching listings. Please try again later.';
    }
}

// Function to display the fetched listings
function displayListings(listings) {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '';

    if (Array.isArray(listings) && listings.length > 0) {
        listings.forEach(listing => {
            const item = listing.item;
            const seller = listing.seller;
            
            const listingElement = document.createElement('div');
            listingElement.classList.add('listing');

            listingElement.innerHTML = `
                <h2>${item.market_hash_name}</h2>
                <img src="${item.icon_url}" alt="${item.market_hash_name}" />
                <p>Price: $${(listing.price / 100).toFixed(2)}</p>
                <p>Float Value: ${item.float_value.toFixed(2)}</p>
                <p>Wear Name: ${item.wear_name}</p>
                <p>Description: ${item.description}</p>
                <p>Seller: ${seller.username}</p>
                <a href="${item.inspect_link}" target="_blank">Inspect Item</a>
            `;

            listingsContainer.appendChild(listingElement);
        });
    } else {
        listingsContainer.innerHTML = '<p>No listings found.</p>';
    }
}

// Call the function to fetch and display listings when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchListings();
});
