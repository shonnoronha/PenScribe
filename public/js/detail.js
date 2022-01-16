const deleteButton = document.querySelector('.deleteButton');
const updateButton = document.querySelector('.updateButton');
const request = () => {
    fetch(`/blogs/${deleteButton.id}`, {
        method: 'DELETE'
    })
        .then(data => data.json())
        .then(data => location.assign(data.redirect))
        .catch(err => console.log(err));
}
const edit = () => {
    location.assign(`update/${updateButton.id}`);
}