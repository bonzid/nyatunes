//1. BOUTON NYA
const nyaButton=document.getElementById('nya');
const nyaAudio=new Audio('nya.mp3');
nyaButton.addEventListener('click',function(){
    nyaAudio.play();
});

//2. CONTROLES DU LECTEUR
let songs=[];
let currentSongIndex=0;
const audio=document.getElementById("audio");
const songTitle=document.getElementById("song-title");
const playPauseButton=document.getElementById("playpause");
const playPauseImg=playPauseButton.querySelector("img");


let isFirstInteraction=true;
let listeButton;
let playlist;
let playlistList;


async function loadSongs() {
    const response=await fetch("songs.php");
    const data=await response.json();
    songs=data;
    if (songs.length>0){
        playSong(0);
        populatePlaylist(); 
    }
}

function playSong(index) {
    currentSongIndex=index;
    const fileName=songs[index];
    audio.src=`songs/${fileName}`;
    
    const title=fileName.replace('.mp3','');
    songTitle.textContent=title;

    audio.load();
    audio.play();
}

function togglePlay(){
    if (audio.paused){
        audio.play().then(()=>{
            console.log("Lecture de la musique");
            playPauseImg.src='images/pause.png';
        }).catch((error)=>{
            console.error("Erreur de lecture :",error);
        });
    } else{
        audio.pause();
        console.log("Pause de la musique");
        playPauseImg.src='images/play.png';
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    listeButton=document.getElementById("liste");
    playlist=document.getElementById("playlist");
    playlistList=document.getElementById("playlist-list");

    if (listeButton){
        listeButton.addEventListener('click',()=>{
            togglePlaylist();
            //console.log("Clic bouton liste");
        });
    }

    if (playPauseButton){
        playPauseButton.addEventListener('click',()=>{
            if (isFirstInteraction){
                isFirstInteraction=false;
                togglePlay();
            } else{
                togglePlay();
            }
        });
    }
});


function nextSong(){
    currentSongIndex=(currentSongIndex + 1)%songs.length;
    playSong(currentSongIndex);
}

function prevSong(){
    currentSongIndex=(currentSongIndex-1+songs.length)%songs.length;
    playSong(currentSongIndex);
}

//lecture automatique
audio.addEventListener('ended',()=>{
    //console.log("musique finie, lecture de la suivante");
    setTimeout(()=>{
        nextSong(); 
    }, 2000); //2 secondes
});


loadSongs();


//3. PLAYLIST
function togglePlaylist(){
    if (playlist.style.display==="block"){
        playlist.style.display="none"; 
    }else{
        playlist.style.display="block";
    }
}

//Fct pour remplir la liste de musiques
function populatePlaylist(){
    //vide la liste actuelle
    playlistList.innerHTML="";

    //ajoute chaque musique à la liste
    songs.forEach((song,index)=>{
        const listItem=document.createElement("li");
        listItem.textContent=song.replace('.mp3', ''); 
        listItem.addEventListener('click',()=>{
            playSong(index); //lecture de la musique sélectionnée
            togglePlaylist(); //on masque la liste juste après
        });
        playlistList.appendChild(listItem);
    });
}


//4. BARRE DE PROGRESSION
//récupère la barre de progression de audio
const progressBar=document.getElementById("progress");

//maj de la barre de progression pdt la lecture
audio.addEventListener('timeupdate',()=>{
    const progress=(audio.currentTime/audio.duration)*100;
    progressBar.value=progress;
});

//cliquer à un moment précis de la musique (marche pas BUG)
progressBar.addEventListener('input',()=>{
    const seekTime=(progressBar.value/100)*audio.duration;
    audio.currentTime=seekTime;
});


function updateProgress(){
    const progressValue=progressBar.value; 
    progressBar.style.setProperty('--progress',`${progressValue}%`);
}

progressBar.addEventListener('input',updateProgress);

updateProgress();

const currentTime=document.getElementById("current-time");
const duration=document.getElementById("duration");

audio.addEventListener('timeupdate', ()=>{
    const progress=(audio.currentTime/audio.duration)*100;
    progressBar.value=progress;
    currentTime.textContent=formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata',()=>{
    duration.textContent=formatTime(audio.duration);
});

function formatTime(time){
    const minutes=Math.floor(time/60);
    const seconds=Math.floor(time%60)
    return `${minutes}:${seconds.toString().padStart(2,'0')}`;
}


//5. BARRE DE VOLUME
const volumeBar=document.getElementById("volume-bar");

volumeBar.addEventListener('input',()=>{
    const volume=volumeBar.value/100;
    audio.volume=volume; 
});

audio.volume=volumeBar.value/100;



//6. SHUFFLE
const shuffleButton=document.getElementById("shuffle");

//fct pour mélanger la liste des musiques -- algorithme de Fisher-Yates
function shuffleSongs(){
    for (let i=songs.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1)); 
        [songs[i],songs[j]]=[songs[j],songs[i]]; 
    }
    //console.log("Liste des musiques mélangée :", songs);
}

shuffleButton.addEventListener('click',()=>{
    shuffleSongs(); //mélange des musiques
    playSong(currentSongIndex); //on passe à la première musique de la liste
    updatePlaylistDisplay(); //maj de la liste
});

function updatePlaylistDisplay(){
    const playlistList=document.getElementById("playlist-list");
    playlistList.innerHTML=""; //vide la liste actuelle

    //ajout de chaque musique à la liste (après shuffle)
    songs.forEach((song,index)=>{
        const listItem=document.createElement("li");
        listItem.textContent=song.replace('.mp3',''); 
        listItem.addEventListener('click',()=>{
            playSong(index); 
        });
        playlistList.appendChild(listItem);
    });
}