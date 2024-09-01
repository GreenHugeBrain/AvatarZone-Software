document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("myForm");
    const emailLogin = document.getElementById("email");
    const passwordLogin = document.getElementById("password");
    const submitLogin = document.getElementById("submit");

    const loginUser = () => {
        submitLogin.addEventListener('click', (e) => {
            e.preventDefault();
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
                    console.error("Tokens not found in the response");
                }
            })
            .catch(err => console.log(err));
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
        .catch(err => console.log(err));
    };

    loginUser();
});
