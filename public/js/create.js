const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = form.title.value;
    const description = form.description.value;
    const content = form.content.value;
    try {
        const res = await fetch('/blogs', {
            method: 'POST',
            body: JSON.stringify({ title, description, content }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.errors) {
            const errorField = document.querySelector('.error');
            errorField.textContent = data.errors;
        } else {
            location.assign(data.redirect);
        }
    } catch (err) {
        console.log(err);
    }
});