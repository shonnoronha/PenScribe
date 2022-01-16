const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const content = form.content.value.trim();
    try {
        const res = await fetch(`/blogs/detail/update/${form.id}`, {
            method: 'post',
            body: JSON.stringify({ title, description, content }),
            headers: { 'Content-Type': 'application/json' },
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