const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = form.username.value;
    const password = form.password.value;
    const passwordError = document.querySelector('.password.error');
    const usernameError = document.querySelector('.username.error');
    try {
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.errors) {
            passwordError.textContent = data.errors.password;
            usernameError.textContent = data.errors.username;
        } else {
            console.log('User logged in as', data.user.username);
            location.assign(data.redirect);
        }
    } catch (err) {
        console.log(err);
    }
});