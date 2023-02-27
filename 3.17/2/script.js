
// document.addEventListener('DOMContentLoaded', function () {
//     const pinlogin = new Pinlogin(document.querySelector('.pinlogin'), {
//         fields: 5,
//         complete: function (pin) {
//             alert('Awesome! You entered: ' + pin);

//             // further processing here
//         }
//     });
// })

const form = document.querySelector('.form__create_pincode');
const button = document.querySelector('.button__save_pincode');
const form__check = document.querySelector('.form__write_pincode');
const buttonCheck = document.querySelector('.button__check_pincode');
const delete__button = document.querySelector('.delete__button');

const checkpin = new Pinlogin(document.querySelector('.pincode__check'), {
    fields: 5,
    reset: false,
    complete: function (pin) {
        const pinCheck = localStorage.getItem('pincode');
        const text = document.querySelector('.text');
        if (text) {
            text.remove();
        }
        if (pinCheck == pin) {
            const text = document.createElement('p');
            text.classList.add('text')
            text.textContent = 'Пин-код правильный'
            form__check.appendChild(text);
        } else {
            const text = document.createElement('p');
            text.classList.add('text')
            text.textContent = 'Пин-код неправильный'
            form__check.appendChild(text);
            checkpin.reset();
        }
    }
});

let pinCreate = '';

const registerpin = new Pinlogin(document.querySelector('.registerpin'), {
    reset: false,
    autofocus: false,
    complete: function (pin) {

        pinCreate = pin;

        registerpinretype.focus(0);

        registerpin.disable();
    }
});

const registerpinretype = new Pinlogin(document.querySelector('.registerpinretype'), {
    reset: false,
    autofocus: false,
    complete: function (pin) {

        if (pinCreate !== pin) {
            pinCreate = '';

            registerpin.reset();
            registerpinretype.reset();

            registerpinretype.disable();

            registerpin.focus(0);

            alert('Пинкоды не совпадают');
        }
        else {

            localStorage.setItem('pincode', pinCreate);
            form.classList.add('form__create_pincode-hidden');
            form__check.classList.remove('form__write_pincode-hidden');
            delete__button.classList.remove('delete__button-hidden');
            checkpin.focus(0);
        }
    }
});

registerpinretype.disable();

if (localStorage.getItem('pincode') !== null) {
    form.classList.add('form__create_pincode-hidden');
    delete__button.classList.remove('delete__button-hidden');

} else {
    form__check.classList.add('form__write_pincode-hidden');

    registerpin.focus(0);

}
delete__button.addEventListener('click', function () {
    localStorage.removeItem('pincode');
    window.location.href = "index.html";
})