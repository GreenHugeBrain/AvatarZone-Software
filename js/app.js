document.getElementById('listFiltersBtn').addEventListener('click', function() {
    document.getElementById('filtersAside').classList.add('show');
});

document.getElementById('closeAsideBtn').addEventListener('click', function() {
    document.getElementById('filtersAside').classList.remove('show');
});