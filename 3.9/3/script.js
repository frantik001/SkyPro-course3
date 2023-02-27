const form = document.querySelector('.form');
const div = form.querySelector('.div');
const male = div.querySelector('.male');
const female = div.querySelector('.female');
const button = form.querySelector('.button');
form.addEventListener('submit', function (event) {
    const text = form.querySelector('.text');
    if (text) {
        text.remove();
        if (male.checked) {
            event.preventDefault();
            const text = document.createElement('p');
            text.classList.add('text');
            text.textContent = "Мужчинам вход запрещен";
            form.appendChild(text);
        }
        if (female.checked) {
            event.preventDefault();
            const text = document.createElement('p');
            text.classList.add('text');
            text.textContent = "Женщинам вход запрещен";
            form.appendChild(text);
        }
    } else {
        if (male.checked) {
            event.preventDefault();
            const text = document.createElement('p');
            text.classList.add('text');
            text.textContent = "Мужчинам вход запрещен";
            form.appendChild(text);
        }
        if (female.checked) {
            event.preventDefault();
            const text = document.createElement('p');
            text.classList.add('text');
            text.textContent = "Женщинам вход запрещен";
            form.appendChild(text);
        }
    }
})
