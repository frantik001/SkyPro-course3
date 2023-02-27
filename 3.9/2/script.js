const form = document.querySelector('.form');
const box = form.querySelector('.box')
const text = box.querySelector('.text');
const agree = box.querySelector('.agree');
const button = form.querySelector('.button');
form.addEventListener('submit', function (event) {
    const error = form.querySelector('.error')
    if (!error) {
        if (!(agree.checked)) {
            event.preventDefault();
            text.classList.add('text__false');
            const error = document.createElement('p');
            error.classList.add('error');
            error.textContent = 'Необходимо согласиться';
            form.appendChild(error);
        }
    } else {
        event.preventDefault();
    }
})
agree.addEventListener('change', function () {
    if (agree.checked) {
        text.classList.remove('text__false');
        const error = form.querySelector('.error')
        form.removeChild(error);
    }
})