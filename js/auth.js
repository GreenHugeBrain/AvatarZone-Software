document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("myForm");
    const emailLogin = document.getElementById("email");
    const passwordLogin = document.getElementById("password");
    const submitLogin = document.getElementById("submit");
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    form.appendChild(errorContainer);

    const loginUser = () => {
        submitLogin.addEventListener('click', (e) => {
            e.preventDefault();
            errorContainer.innerHTML = ''; // Clear any previous error messages

            if (!emailLogin.value || !passwordLogin.value) {
                errorContainer.innerHTML = 'Please fill in all fields.';
                return;
            }

            fetch('https://avatarzone-api.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailLogin.value,
                    password: passwordLogin.value
                })
            })
            .then(response => response.json())
            .then(res => {
                if (res.token && res.refreshToken) {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("refreshToken", res.refreshToken);
                    fetchUserData(res.token, emailLogin.value);
                } else {
                    errorContainer.innerHTML = 'Login failed. Please check your credentials and try again.';
                }
            })
            .catch(err => {
                console.error(err);
                errorContainer.innerHTML = 'An error occurred. Please try again later.';
            });
        });
    };

    const fetchUserData = (token, email) => {
        fetch('https://avatarzone-api.onrender.com/user-loader', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(userData => {
            localStorage.setItem("userData", JSON.stringify(userData));
            window.location.href = 'index.html';
        })
        .catch(err => {
            console.error(err);
            errorContainer.innerHTML = 'Failed to fetch user data. Please try again later.';
        });
    };

    loginUser();
});
