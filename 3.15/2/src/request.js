const noop = () => { };
const NO_PARAMS = {}

function request({
    method = 'GET',
    url,
    params = NO_PARAMS,
    type = 'json',
    checkStatusInResponse = false,
    onSuccess = noop,
    onError = noop
}) {
    const req = new XMLHttpRequest();

    req.open(method, url);
    const urlParams = new URLSearchParams(params);
    const queryString = urlParams.toString();

    req.open(method, url + (queryString ? `?${queryString}` : ''));
    req.responseType = type;

    req.onload = function (event) {
        const target = event.target;
        if (target.status !== 200) {
            onError(target.statusText);
            return;
        }
        if (checkStatusInResponse && target.response.status !== 'ok') {
            onError(target.statusText);
            return;
        }
        onSuccess(target.response);
    }
    req.onerror = function () {
        onError();
    }
    req.send();
}