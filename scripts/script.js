//1. BOUTON NYA
// Récupère le bouton par son ID
const nyaButton = document.getElementById('nya');

// Crée un nouvel objet Audio pour le fichier nya.mp3
const nyaAudio = new Audio('nya.mp3');

// Ajoute un événement au clic du bouton
nyaButton.addEventListener('click', function() {
    // Joue le son quand le bouton est cliqué
    nyaAudio.play();
});

//2. CONTROLES DU LECTEUR
let songs = [];
let currentSongIndex = 0;
const audio = document.getElementById("audio");
const songTitle = document.getElementById("song-title");
const playPauseButton = document.getElementById("playpause");
const playPauseImg = playPauseButton.querySelector("img");

// Indicateur pour vérifier si c'est la première interaction
let isFirstInteraction = true;

// Récupère les éléments nécessaires
let listeButton;
let playlist;
let playlistList;


async function loadSongs() {
    const response = await fetch("songs.php");
    const data = await response.json();
    songs = data;
    if (songs.length > 0) {
        playSong(0);
        populatePlaylist(); // Remplir la liste des musiques
    }
}

function playSong(index) {
    currentSongIndex = index;
    const fileName = songs[index];
    audio.src = `songs/${fileName}`;
    
    // Extraire le nom du fichier sans l'extension .mp3
    const title = fileName.replace('.mp3', '');
    songTitle.textContent = title;

    audio.load();
    audio.play();
}

// Fonction pour gérer le bouton de lecture
function togglePlay() {
    if (audio.paused) {
        // Lire la musique
        audio.play().then(() => {
            console.log("Lecture de la musique");
            // Mettre à jour l'image en "pause.png" après le début de la lecture
            playPauseImg.src = 'images/pause.png';
        }).catch((error) => {
            console.error("Erreur de lecture :", error);
            // Ne pas changer l'image si la lecture échoue
        });
    } else {
        // Mettre en pause la musique
        audio.pause();
        console.log("Pause de la musique");
        // Mettre à jour l'image en "play.png"
        playPauseImg.src = 'images/play.png';
    }
}

// Ajouter un événement au bouton de lecture
document.addEventListener("DOMContentLoaded", () => {
    listeButton = document.getElementById("liste");
    playlist = document.getElementById("playlist");
    playlistList = document.getElementById("playlist-list");

    // Ajouter un événement au bouton "liste"
    if (listeButton) {
        listeButton.addEventListener('click', () => {
            togglePlaylist();
            console.log("Clic bouton liste");

        });
    }

    if (playPauseButton) {
        playPauseButton.addEventListener('click', () => {
            if (isFirstInteraction) {
                // Première interaction : lancer la lecture
                isFirstInteraction = false;
                togglePlay();
            } else {
                // Interactions suivantes : basculer entre lecture et pause
                togglePlay();
            }
        });
    }
});

// Fonction pour changer de chanson
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Lancer le chargement des chansons
loadSongs();


//3. PLAYLIST
// Fonction pour afficher/masquer la liste des musiques
function togglePlaylist() {
    if (playlist.style.display === "block") {
        playlist.style.display = "none"; // Masquer la liste
    } else {
        playlist.style.display = "block"; // Afficher la liste
    }
}

//Fct pour remplir la liste de musiques
function populatePlaylist() {
    //vide la liste actuelle
    playlistList.innerHTML = "";

    //ajoute chaque musique à la liste
    songs.forEach((song, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = song.replace('.mp3', ''); //on enlève l'extension
        listItem.addEventListener('click', () => {
            playSong(index); //lecture de la musique sélectionnée
            togglePlaylist(); //on masque la liste juste après
        });
        playlistList.appendChild(listItem);
    });
}


//4. BARRE DE PROGRESSION
//récupère la barre de progression de audio
const progressBar = document.getElementById("progress");

//maj de la barre de progression pdt la lecture
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
});

//cliquer à un moment précis de la musique (marche pas)
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

// Met à jour la variable CSS --progress
function updateProgress() {
    const progressValue = progressBar.value; // Valeur actuelle de la barre (0 à 100)
    progressBar.style.setProperty('--progress', `${progressValue}%`);
}

// Écoute les changements de la barre de progression
progressBar.addEventListener('input', updateProgress);

// Initialise la variable CSS au chargement de la page
updateProgress();


const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

// Met à jour le temps actuel et la durée totale
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;

    // Afficher le temps actuel
    currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    // Afficher la durée totale
    duration.textContent = formatTime(audio.duration);
});

// Fonction pour formater le temps (MM:SS)
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}



//5. BARRE DE VOLUME
// Récupère la barre de volume et l'élément audio
const volumeBar = document.getElementById("volume-bar");

// Met à jour le volume en fonction de la valeur de la barre de volume
volumeBar.addEventListener('input', () => {
    const volume = volumeBar.value / 100; // Convertit la valeur (0-100) en un volume (0-1)
    audio.volume = volume; // Applique le volume à l'élément audio
});

// Initialise le volume au chargement de la page
audio.volume = volumeBar.value / 100;