window.application = {
    blocks: {},
    screens: {},
    renderScreen: function (screenName) {

        if (!(screenName in application.screens)) {
            console.log("Такого экрана cуществует");
            return;
        }

        application.screens[`${screenName}`]();
    },
    renderBlock: function (blockName, container, ...args) {

        if (!(blockName in application.blocks)) {
            console.log("Такого блока не cуществует");
            return;
        }

        application.blocks[`${blockName}`](container, ...args);
    },
    timers: [],

    token: localStorage.getItem("token"),

    idGame: localStorage.getItem("idGame"),
};

const app = document.querySelector(".app");
const backURL = "https://skypro-rock-scissors-paper.herokuapp.com";

window.addEventListener("DOMContentLoaded", () => {

    syncronToken();

    if (!application.token) {
        application.renderScreen("login");
        return;
    }

    if (!application.idGame) {
        application.renderScreen("lobby");
        return;
    }

    application.renderScreen("game");
});

const syncronToken = () => {

    const token = localStorage.getItem("token");

    fetch(
        `https://skypro-rock-scissors-paper.herokuapp.com/player-status?token=${token}`
    )

        .then((res) => res.json())

        .then((result) => {

            if (result.status !== "error") {

                application.token = token;

                localStorage.setItem("token", token);

                if (result["player-status"].status === "game") {

                    application.idGame = result["player-status"].game.id;

                    localStorage.setItem("idGame", result["player-status"].game.id);
                }
                return;
            }
            localStorage.removeItem("token");

            localStorage.removeItem("idGame");

            application.token = application.idGame = "";
        });
};

function clear() {

    if (application.timers.length > 0) {
        application.timers.forEach((timer) => clearInterval(timer));
        application.timers = [];
    }
}

function loginBlock(container) {
    const form = document.createElement("form");
    form.classList.add("form__login");
    const formControl = document.createElement("div");
    formControl.classList.add("form__control");
    form.appendChild(formControl);
    const formBtnBox = document.createElement("div");
    formBtnBox.classList.add("form__control");
    form.appendChild(formBtnBox);
    const input = document.createElement("input");
    input.placeholder = "Логин";
    input.type = "text";
    input.classList.add("form__input");
    formControl.appendChild(input);
    const btn = document.createElement("button");
    btn.textContent = "Войти";
    btn.classList.add("btn", "btn__login");
    formBtnBox.appendChild(btn);
    container.appendChild(form);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!input.value) {
            input.classList.add("form__input_error");
            return;
        }
        input.classList.remove("form__input_error");
        fetch(`${backURL}/login?login=${input.value}`)
            .then((res) => res.json())
            .then((result) => {
                localStorage.setItem("token", result.token);
                application.token = result.token;
                return fetch(`${backURL}/player-status?token=${application.token}`);
            })
            .then((res) => res.json())
            .then((result) => {
                if (result["player-status"].status === "lobby") {
                    application.renderScreen("lobby");
                } else {
                    application.idGame = result["player-status"].game.id;
                    application.renderScreen("game");
                }
            });
    });
}

function loginScreen() {
    app.textContent = "";
    application.renderBlock("loginBlock", app);
}

function lobbyBlock(container) {
    fetch(`${backURL}/player-list?token=${application.token}`)
        .then((res) => res.json())
        .then((result) => {
            const players = result.list;
            container.textContent = "";
            for (const player of players) {
                const login = document.createElement("li");
                if (player.you) {
                    login.classList.add("player__you");
                }
                login.classList.add("player");
                login.textContent = player.you ? `Вы: ${player.login}` : player.login;
                container.appendChild(login);
            }
        });
}

function lobbyScreen() {
    clear();
    app.textContent = "";

    const listPlayer = document.createElement("ul");
    listPlayer.classList.add("player__list");
    const playGame = document.createElement("div");
    playGame.classList.add("button__list");
    lobbyBlock(listPlayer);

    application.timers.push(
        setInterval(() => {
            lobbyBlock(listPlayer);
        }, 1000)
    );

    const buttonPlay = document.createElement("button");
    buttonPlay.textContent = "Играть";
    buttonPlay.classList.add("btn", "btn__play");
    buttonPlay.addEventListener("click", () => {
        fetch(`${backURL}/start?token=${application.token}`)
            .then((res) => res.json())
            .then((result) => {
                localStorage.setItem("idGame", result["player-status"].game.id);
                application.idGame = result["player-status"].game.id;
                application.renderScreen("game");
            });
    });
    playGame.appendChild(buttonPlay);

    app.appendChild(listPlayer);
    app.appendChild(playGame);
}

function gameWaitingScreen(container, info) {
    const spinner = document.querySelector(".spinner") || document.createElement("div");
    container.appendChild(spinner);
    spinner.classList.add("spinner");

    const spinnerAnimation = document.querySelector(".spinner__animation") || document.createElement("i");
    spinnerAnimation.classList.add('fa-solid', 'fa-circle-notch', 'fa-2xl', 'fa-spin-pulse');

    const spinnerInfo = document.querySelector(".spinner__info") || document.createElement("span");
    spinnerInfo.classList.add("spinner__info");
    spinnerInfo.textContent = info;
    spinner.appendChild(spinnerAnimation);
    spinner.appendChild(spinnerInfo);
}

function gameBlock(container) {
    const block =
        document.querySelector(".block") || document.createElement("div");
    block.classList.add("block");
    application.renderBlock("button", block, "rock", "Камень");
    application.renderBlock("button", block, "paper", "Бумага");
    application.renderBlock("button", block, "scissors", "Ножницы");

    container.appendChild(block);
}

function gameScreen() {
    clear();
    app.textContent = "";
    application.timers.push(
        setInterval(() => {
            fetch(
                `${backURL}/game-status?token=${application.token}&id=${application.idGame}`
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result["game-status"].status === "waiting-for-start") {
                        app.textContent = "";
                        application.renderBlock("waitingBlock", app, "Ожидание соперника");
                    } else if (result["game-status"].status === "waiting-for-your-move") {
                        app.textContent = "";
                        application.renderBlock("gameBlock", app);
                    } else if (
                        result["game-status"].status === "waiting-for-enemy-move"
                    ) {
                        app.textContent = "";
                        application.renderBlock(
                            "waitingBlock",
                            app,
                            "Ожидание хода соперника"
                        );
                    } else if (result["game-status"].status === "win") {
                        app.textContent = "";
                        application.renderBlock("endGame", app, "win");
                    } else if (result["game-status"].status === "lose") {
                        app.textContent = "";
                        application.renderBlock("endGame", app, "lose");
                    }
                });
        }, 1000)
    );
}

function buttonBlock(container, move, moveRus) {
    const blockRock =
        document.querySelector(`.block__${move}`) ||
        document.createElement("button");
    blockRock.classList.add(`block__${move}`);
    blockRock.textContent = `${moveRus}`;
    blockRock.addEventListener("click", () => {
        fetch(
            `${backURL}/play?token=${application.token}&id=${application.idGame}&move=${move}`
        );
    });
    container.appendChild(blockRock);
}

function endGameScreen(container, status) {
    const win = status === "win";
    const resultBlock =
        document.querySelector(".result__block") || document.createElement("div");
    resultBlock.classList.add("result__block");
    container.appendChild(resultBlock);
    const result = document.querySelector(".result") || document.createElement("h2");
    result.classList.add("result");
    result.textContent = win ? "Победа!" : "Вы проиграли";
    resultBlock.appendChild(result);

    const buttonBlock =
        document.querySelector(".button__block") || document.createElement("div");
    buttonBlock.classList.add("button__block");
    application.renderBlock("buttons", buttonBlock, "lobby");
    application.renderBlock("buttons", buttonBlock, "play");
    container.appendChild(buttonBlock);
}

function backButtonsScreen(container, status) {
    const lobbyStatus = status === "lobby";
    const lobby =
        document.querySelector(`.button__${status}`) ||
        document.createElement("button");
    lobby.textContent = lobbyStatus ? "В лобби" : "Играть ещё";
    lobby.classList.add("button", `button__${status}`);
    container.appendChild(lobby);

    lobby.addEventListener("click", () => {
        if (lobbyStatus) {
            application.idGame = "";
            localStorage.removeItem("idGame");
            application.renderScreen("lobby");
            return;
        }
        fetch(`${backURL}/start?token=${application.token}`)
            .then((res) => res.json())
            .then((result) => {
                localStorage.setItem("idGame", result["player-status"].game.id);
                application.idGame = result["player-status"].game.id;
                application.renderScreen("game");
            });
    });
}

application.blocks["loginBlock"] = loginBlock;
application.screens["login"] = loginScreen;
application.blocks["playerList"] = lobbyBlock;
application.screens["lobby"] = lobbyScreen;
application.blocks["waitingBlock"] = gameWaitingScreen;
application.blocks["gameBlock"] = gameBlock;
application.screens["game"] = gameScreen;
application.blocks["button"] = buttonBlock;
application.blocks["endGame"] = endGameScreen;
application.blocks["buttons"] = backButtonsScreen;