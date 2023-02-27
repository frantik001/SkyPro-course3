const form = document.querySelector('.form');
const login = form.querySelector('.login');
const password = form.querySelector('.password');
const button = form.querySelector('.button');
login.addEventListener('blur', function () {
    if (login.value === '') {
        login.classList.add('login__empty')
    } else {
        login.classList.remove('login__empty')
    }
})
password.addEventListener('blur', function () {
    if (password.value === '') {
        password.classList.add('password__empty')
    } else {
        password.classList.remove('password__empty')
    }
})
form.addEventListener('submit', function (event) {
    if (login.value === '' || password.value === '') {
        event.preventDefault();
    }
})