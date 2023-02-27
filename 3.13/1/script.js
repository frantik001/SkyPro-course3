const block = document.querySelector('.block')
const input = block.querySelector('.block__input');
const button = block.querySelector('.block__button');

function showLink(linkData) {
    const link = document.createElement('a');
    link.classList.add('block__link')
    link.textContent = '1pt.co/' + linkData.short
    link.href = 'https://1pt.co/' + linkData.short
    block.appendChild(link);
}

button.addEventListener('click', function () {
    const request = new XMLHttpRequest();
    button.setAttribute('disabled', 'disabled');

    request.open('GET', 'https://api.1pt.co/addURL?long=' + input.value);

    request.send();

    request.onload = function () {
        button.removeAttribute('desabled');
        const data = JSON.parse(request.response);
        showLink(data);
    }
})