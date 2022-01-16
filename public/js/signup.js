const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = form.username.value;
    const password = form.password.value;
    const email = form.email.value;
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.password.error');
    const usernameError = document.querySelector('.username.error');
    try {
        const res = await fetch('/signup', {
            method: 'POST',
            body: JSON.stringify({ username, password, email }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.errors) {
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
            usernameError.textContent = data.errors.username;
        } else {
            location.assign(data.redirect);
        }
    } catch (err) {
        console.log(err);
    }
});