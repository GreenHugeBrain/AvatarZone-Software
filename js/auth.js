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
                console.log(res);

                if (res.token && res.refreshToken) {
                    // Save tokens to localStorage
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("refreshToken", res.refreshToken);
                    window.location.href = 'index.html'
                } else {
                    console.error("Tokens not found in the response");
                }
            })
            .catch(err => console.log(err));
        });
    };

    loginUser();
});
    