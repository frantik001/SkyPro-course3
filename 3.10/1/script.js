const form = document.querySelector('.form');
const ratingButton = document.querySelectorAll('.rating__input');
const comment = document.querySelector('.comment');
const button = document.querySelector('.button');

ratingButton.forEach(element => {

    element.addEventListener('change', function (event) {

        const targetStar = document.querySelector('.rating__input:checked').value;

        ratingButton.forEach(item => {

            const currentLabel = item.previousElementSibling;

            if (item.value <= targetStar) {

                currentLabel.classList.add('rating__label_checked');

            } else {

                currentLabel.classList.remove('rating__label_checked');

            }
        });
    })
});

form.addEventListener('submit', function (event) {

    const checked = document.querySelectorAll('.rating__label_checked');

    if (checked.length == false) {
        console.log('Рейтинг не выбран');
        event.preventDefault();
    } if (comment.value.length < 10) {
        console.log('Нужно ввести более 10 символов');
        event.preventDefault();
    } else {
        event.preventDefault();
        const result = {
            rating: checked.length,
            comment: comment.value
        }
        console.log(result);
    }
})