document.addEventListener('DOMContentLoaded', () => {
    // მოიტანეთ userData LocalStorage-დან
    const userData = JSON.parse(localStorage.getItem('userData'));

    // თუ userData არ არის, გამოაჩინეთ შეცდომა
    if (!userData) {
        console.error('No user data found in localStorage');
        return;
    }

    // მიაწვდეთ HTML ელემენტები
    const basicFilter = document.querySelector('input[type="checkbox"][data-filter="basic"]');
    const standartFilter = document.querySelector('input[type="checkbox"][data-filter="standart"]');
    const premiumFilter = document.querySelector('input[type="checkbox"][data-filter="premium"]');
    const proFilter = document.querySelector('input[type="checkbox"][data-filter="pro"]');
    const fetchBtn = document.getElementById('FetchBtn');
    const logout = document.getElementById('logout');

    // გადართეთ და მიაწვდით ფილტრები
    basicFilter.checked = userData.basic;
    basicFilter.disabled = !userData.basic;

    standartFilter.checked = userData.standart;
    standartFilter.disabled = !userData.standart;

    premiumFilter.checked = userData.premium;
    premiumFilter.disabled = !userData.premium;

    proFilter.checked = userData.pro;
    proFilter.disabled = !userData.pro;

    // მომხმარებლის სახელი მიაწვდით Login ღილაკზე
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.textContent = userData.username;
    loginBtn.href = "#"; // Optional: შეცვალეთ href საჭიროების მიხედვით

    // დაკლიკებების რაოდენობა და 10 წამით გამორთვის ფუნქცია
    let clickCount = 0;
    const handleClick = (maxClicks) => {
        clickCount++;
        if (clickCount >= maxClicks) {
            fetchBtn.disabled = true;
            localStorage.setItem('fetchBtnDisabledUntil', Date.now() + 10000); // 10 წამი მილიწამებში

            setTimeout(() => {
                fetchBtn.disabled = false;
                clickCount = 0;
                localStorage.removeItem('fetchBtnDisabledUntil');
            }, 10000); // 10 წამი მილიწამებში
        }
    };

    fetchBtn.addEventListener('click', () => {
        if (basicFilter.checked) {
            handleClick(10);
        } else if (standartFilter.checked) {
            handleClick(200);
        } else if (premiumFilter.checked) {
            handleClick(1000);
        } else if (proFilter.checked) {
            clickCount = 0; // პრო შემთხვევაში არანაირი ლიმიტები
        }
    });

    // შემოწმება ღილაკის დროის გამორთვის
    const disabledUntil = localStorage.getItem('fetchBtnDisabledUntil');
    if (disabledUntil && Date.now() < disabledUntil) {
        fetchBtn.disabled = true;

        setTimeout(() => {
            fetchBtn.disabled = false;
            clickCount = 0;
            localStorage.removeItem('fetchBtnDisabledUntil');
        }, disabledUntil - Date.now());
    }

    logout.addEventListener('click', () => {
        localStorage.removeItem('userData');
        window.location.href = "index.html"; // გადაამისამართეთ მომხმარებელი საწყის გვერდზე
    });
});
