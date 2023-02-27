const form = document.querySelector('.form__create_pincode');
const input = document.querySelector('.input__create_pincode');
const button = document.querySelector('.button__save_pincode');
const form__check = document.querySelector('.form__write_pincode');
const input__check = document.querySelector('.input__write_pincode');
const input__box = document.querySelector('.input__box');
const delete__button = document.querySelector('.delete__button')
let writed__pincode = [];


if (localStorage.getItem('pincode') !== null) {
    form.classList.add('form__create_pincode-hidden');
    delete__button.classList.remove('delete__button-hidden');
    const pincode = localStorage.getItem('pincode');
    for (const number of pincode) {
        const entry__field = document.createElement('input');
        entry__field.classList.add('input__write_pincode');
        entry__field.type = 'number'
        entry__field.name = 'write__pincode'
        entry__field.id = 'write__pincode'
        input__box.appendChild(entry__field);
    }
    const entry__field = document.querySelectorAll('.input__write_pincode');
    entry__field[0].focus();
    for (let i = 0; i < entry__field.length; i++) {
        entry__field[i].addEventListener('input', function (event) {
            writed__pincode.push(entry__field[i].value)
            if (entry__field[i + 1]) {
                entry__field[i].nextElementSibling.focus();
            } else {
                entry__field[i].blur();
            }
        })
    }
    form__check.addEventListener('submit', function (event) {
        event.preventDefault();
        const compare = pincode.split('').toString() === writed__pincode.toString();
        const text = document.querySelector('.text');
        if (text) {
            text.remove();
        }
        if (compare === true) {
            const text = document.createElement('p');
            text.classList.add('text')
            text.textContent = 'Пин-код правильный'
            form__check.appendChild(text);
        } else {
            for (let i = 0; i < entry__field.length; i++) {
                entry__field[i].value = '';

            }
            writed__pincode = [];
            entry__field[0].focus();
            const text = document.createElement('p');
            text.classList.add('text')
            text.textContent = 'Пин-код неправильный'
            form__check.appendChild(text);
        }
    })
} else {
    form__check.classList.add('form__write_pincode-hidden');
    form.addEventListener('submit', function (event) {
        if (input.value.length >= 4 && input.value.length <= 6) {
            localStorage.setItem('pincode', input.value);
            form.classList.add('form__create_pincode-hidden');
            form__check.classList.remove('form__write_pincode-hidden');
        } else {
            event.preventDefault();
            const error = document.createElement('p');
            error.classList.add('error');
            error.textContent = 'Длина пин-кода должна быть в пределах 4-6 символов';
            form.insertBefore(error, button);
        }
    });
}
delete__button.addEventListener('click', function () {
    localStorage.removeItem('pincode');
    window.location.href = "index.html";
})