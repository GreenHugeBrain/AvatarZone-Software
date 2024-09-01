let allListings = []; // Store all fetched listings
let filtersApplied = false; // Flag to check if filters have been applied

async function fetchListings() {
    const url = 'https://listings-api-bssa.onrender.com/api/listings';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
        }

        allListings = await response.json();
        console.log(allListings);
        if (!filtersApplied) {
            displayListings(allListings);
        } else {
            applyFilters();
        }
    } catch (error) {
        console.error('Error fetching listings:', error);
        const errorElement = document.getElementById('error');
        if (errorElement) {
            errorElement.innerText = 'Error fetching listings. Please try again later.';
        }
    }
}

function applyFilters() {
    filtersApplied = true;
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const minPrice = parseFloat(document.getElementById('minPriceRange')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPriceRange')?.value) || Infinity;
    const minFloat = parseFloat(document.getElementById('minFloat')?.value) || 0;
    const maxFloat = parseFloat(document.getElementById('maxFloat')?.value) || 1;
    const startDate = document.getElementById('startDate')?.value ? new Date(document.getElementById('startDate').value) : null;
    const endDate = document.getElementById('endDate')?.value ? new Date(document.getElementById('endDate').value) : null;

    const filteredListings = allListings.filter(listing => {
        const listingDate = new Date(listing.created_at);
        const listingPrice = listing.price / 100; // Assuming price is in cents
        const listingFloat = parseFloat(listing.item.float_value);

        return (
            (typeFilter === '' || (typeFilter === 'skin' && listing.item.type === 'skin')) &&
            listingPrice >= minPrice && listingPrice <= maxPrice &&
            listingFloat >= minFloat && listingFloat <= maxFloat &&
            (!startDate || listingDate >= startDate) &&
            (!endDate || listingDate <= endDate)
        );
    });

    // Sort by price (highest first), then by date (newest first), and then by float (lowest first)
    const sortedListings = filteredListings.sort((a, b) => {
        const priceComparison = b.price - a.price;
        if (priceComparison !== 0) return priceComparison;
        const dateComparison = new Date(b.created_at) - new Date(a.created_at);
        if (dateComparison !== 0) return dateComparison;
        return parseFloat(a.item.float_value) - parseFloat(b.item.float_value);
    });

    displayListings(sortedListings);
}   

function displayListings(listings) {
    const listingsContainer = document.getElementById('steamListings');
    listingsContainer.innerHTML = '';

    if (listings.length === 0) {
        listingsContainer.innerHTML = '<p>No listings found matching the current filters.</p>';
        return;
    }

    listings.forEach(listing => {
        const listingElement = document.createElement('div');
        listingElement.classList.add('listing', 'card', 'mb-3');
        listingElement.innerHTML = `
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="https://steamcommunity-a.akamaihd.net/economy/image/${listing.item.icon_url}" alt="${listing.item.item_name}" class="listing-image" />
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <h5 class="card-title">${listing.item.item_name}
                            <a class="Profile" href="https://steamcommunity.com/profiles/${listing.seller.steam_id}/" target="_blank">Seller Profile</a>
                        </h5>
                        <p class="card-text">${listing.item.description}</p>
                        <p class="card-text">
                            <span class="quality">Quality: ${listing.item.quality}</span>
                            <span class="float">Float: ${listing.item.float_value}</span>
                            <span class="price">Listed Price: $${(listing.price / 100).toFixed(2)}</span>
                        </p>
                        <small class="text-muted">Listed on: ${new Date(listing.created_at).toLocaleString()}</small>
                    </div>
                </div>
            </div>
        `;
        listingsContainer.appendChild(listingElement);
    });
}   

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchListings(); // Fetch listings on page load

    const fetchBtn = document.getElementById('FetchBtn');
    if (fetchBtn) {
        fetchBtn.addEventListener('click', fetchListings);
    }

    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            filtersApplied = true;
            applyFilters();
        });
    }

    const listFiltersBtn = document.getElementById('listFiltersBtn');
    if (listFiltersBtn) {
        listFiltersBtn.addEventListener('click', function() {
            const filtersAside = document.getElementById('filtersAside');
            if (filtersAside) {
                filtersAside.classList.add('show');
            }
        });
    }

    const closeAsideBtn = document.getElementById('closeAsideBtn');
    if (closeAsideBtn) {
        closeAsideBtn.addEventListener('click', function() {
            const filtersAside = document.getElementById('filtersAside');
            if (filtersAside) {
                filtersAside.classList.remove('show');
            }
        });
    }

    // Initialize price range labels
    const minPriceRange = document.getElementById('minPriceRange');
    const maxPriceRange = document.getElementById('maxPriceRange');
    const minPriceLabel = document.getElementById('minPriceLabel');
    const maxPriceLabel = document.getElementById('maxPriceLabel');

    if (minPriceRange && minPriceLabel) {
        minPriceRange.addEventListener('input', function() {
            minPriceLabel.textContent = '$' + this.value;
        });
    }

    if (maxPriceRange && maxPriceLabel) {
        maxPriceRange.addEventListener('input', function() {
            maxPriceLabel.textContent = '$' + this.value;
        });
    }
});