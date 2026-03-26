const config = window.RADIO_CONFIG;

const titleEl = document.getElementById("radio-title");
const taglineEl = document.getElementById("radio-tagline");
const descriptionEl = document.getElementById("radio-description");
const scheduleEl = document.getElementById("radio-schedule");
const logoEl = document.getElementById("radio-logo");
const playButton = document.getElementById("play-button");
const playLabel = document.getElementById("play-label");
const playIcon = document.getElementById("play-icon");
const playerStatus = document.getElementById("player-status");
const audio = document.getElementById("radio-player");

function applyConfig() {
    document.title = config.name;
    titleEl.textContent = config.name;
    taglineEl.textContent = config.tagline;
    descriptionEl.textContent = config.description;
    scheduleEl.textContent = config.schedule;

    logoEl.src = normalizeAssetPath(config.logo);
    logoEl.alt = `Logo de ${config.name}`;

    audio.src = config.streamUrl;

    const root = document.documentElement;
    root.style.setProperty("--color-bg", config.colors.bg);
    root.style.setProperty("--color-surface", config.colors.surface);
    root.style.setProperty("--color-primary", config.colors.primary);
    root.style.setProperty("--color-text", config.colors.text);
}

function normalizeAssetPath(path) {
    if (!path) {
        return "";
    }

    const isRemotePath = /^https?:\/\//i.test(path);
    const isFilePath = /^file:\/\//i.test(path);

    if (isRemotePath || isFilePath) {
        return path;
    }

    if (window.location.protocol === "file:" && path.startsWith("/")) {
        return `.${path}`;
    }

    return path;
}

function setPlayerState(isPlaying, message) {
    playButton.classList.toggle("is-playing", isPlaying);
    playButton.setAttribute("aria-pressed", String(isPlaying));
    playLabel.textContent = isPlaying ? "Pausar radio" : "Escuchar ahora";
    playIcon.textContent = isPlaying ? "||" : "▶";
    playerStatus.textContent = message;
}

playButton.addEventListener("click", async () => {
    if (audio.paused) {
        try {
            await audio.play();
            setPlayerState(true, "La radio se está reproduciendo.");
        } catch (error) {
            setPlayerState(false, "No se pudo iniciar el audio. Intenta nuevamente.");
        }
        return;
    }

    audio.pause();
    setPlayerState(false, "La radio está en pausa.");
});

audio.addEventListener("ended", () => {
    setPlayerState(false, "La transmisión terminó.");
});

audio.addEventListener("error", () => {
    setPlayerState(false, "Hubo un problema con la señal de audio.");
});

applyConfig();
