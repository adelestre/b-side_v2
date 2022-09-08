import React from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import '../styles/components/Nowplaying.scss'
import { auth, db } from './Firebase'

let volume = {
    value: 0.125,
    muted: false,
}

let currentAudio = {
    exists: false,
    element: null
}

function initAudio(song) {
    const body = document.querySelector("body")
    const progress_fill = document.querySelector("#song-progress-fill");
    let audio = new Audio("./resssources/songs/" + song + ".mp3");
    audio.volume = volume.value;
    if (volume.muted)
        audio.muted = true;
    audio.addEventListener('timeupdate', () => {
        if (window.matchMedia("(max-width: 1149px)").matches) {
            progress_fill.style.width = `${(audio.currentTime / audio.duration) * 100}vw`;
        } else {
            progress_fill.style.width = `${(audio.currentTime / audio.duration) * 40}vw`;
        }
        if (audio.currentTime !== 0) {
            progress_fill.style.background = `linear-gradient(to right, #680075, #410f9b ${(audio.duration / audio.currentTime) * 100}%`;
        } else {
            progress_fill.style.background = "linear-gradient(to right, #680075, #45004ec9";
        }
        update_current_time();
    })
    currentAudio.exists = true;
    currentAudio.element = audio;
    body.appendChild(currentAudio.element);
}
function update_current_time() {
    // Update playing song's time display
    const current_time = document.querySelector("#current-time");
    if (currentAudio.exists) {
        let current_time_string = "";
        let min = Math.floor(currentAudio.element.currentTime / 60);
        current_time_string += min + ":";
        let sec = Math.floor(currentAudio.element.currentTime) - min * 60;
        if (sec < 10) {
            current_time_string += "0";
        }
        current_time_string += sec;
        current_time.innerHTML = current_time_string;
    }
}
function progressOnClick(e) {
    if (currentAudio.exists) {
        currentAudio.element.currentTime = (e.offsetX / e.target.offsetWidth) * currentAudio.element.duration;
    }
}
function modVolume(float) { // adds 'float' to volume
    const volume_slider_fill = document.querySelector("#volume-slider-fill");
    const volume_slider_thumb = document.querySelector("#volume-slider-thumb");
    let vol = volume_slider_thumb.value
    volume_slider_thumb.value = `${parseInt(vol) + float}`;
    volume.value = 0.25 - (volume_slider_thumb.value / 400)
    if (currentAudio.exists)
        currentAudio.element.volume = volume.value;
    volume_slider_fill.style.width = ((-volume.value) + 0.25) * 24 + "vw";
}
function toggleVolume() { // volume button toggle to mute music
    const volume_button = document.querySelector("#volume-button");
    if (volume.muted) {
        currentAudio.element.muted = false;
        volume.muted = false;
        volume_button.innerHTML = "volume_up";
    } else {
        currentAudio.element.muted = true;
        volume.muted = true;
        volume_button.innerHTML = "volume_off";
    }
}
function updateCurrentSong(song) {
    const current_song_img = document.querySelector(".now-playing-bar__current-song__img-area__img");
    const current_song_title = document.querySelector(".now-playing-bar__current-song__title-artist-container__title");
    const current_song_artist = document.querySelector(".now-playing-bar__current-song__title-artist-container__artist");
    const current_song_container = document.querySelector(".now-playing-bar__current-song");
    const pageTitle = document.querySelector('title');
    let tile = document.querySelector("#song" + song.data()["ID_Song"].toString());
    if (tile) {
        let other_tiles = document.querySelectorAll('.playing');
        other_tiles.forEach(element => { element.classList.remove('playing') })
        tile.classList.add('playing');
    }
    pageTitle.textContent = song.data()["Name"];
    getDoc(doc(db, "Artists", song.data()["ID_Artist"].toString())).then(artist => {
        getDoc(doc(db, "Albums", song.data()["ID_Album"].toString())).then(album => {
            current_song_img.src = (album.data()["img"]);
            current_song_title.textContent = (song.data()["Name"]);
            current_song_artist.textContent = (artist.data()["Name"]);
            if (!current_song_container.classList.contains('show'))
                current_song_container.classList.add('show');
        })
    })
}
//This plays a file, and call a callback once it completed (if a callback is set)
function play(ID_Song) {
    const music_duration = document.querySelector("#duration");
    getDoc(doc(db, "Songs", ID_Song.toString())).then((song) => {
        console.log(song)
        if (!currentAudio.exists) {
            initAudio(ID_Song);
        }
        updateCurrentSong(song);
        currentAudio.element.src = "https://storage.googleapis.com/b-side-songs/songs/" + ID_Song + ".mp3"
        music_duration.textContent = song.data()["Duration"];
    }).then(() => {
        resume();
        currentAudio.element.removeEventListener('ended', queueNext);
        currentAudio.element.addEventListener('ended', () => { queueNext() });
    })
}
function playOrPause() { // Play and Pause function
    if (currentAudio.exists && !currentAudio.element.paused && !currentAudio.element.ended) {
        pause();
    } else {
        resume();
    }
}
function resume() {
    const button_play = document.querySelector("#button-play");
    currentAudio.element.play();
    button_play.textContent = ('pause')
}

function pause() {
    const button_play = document.querySelector("#button-play");
    currentAudio.element.pause();
    button_play.textContent = ('play_arrow')
}
function queueNext() {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then(user => {
        let Q = user.data()["P_Queue"];
        if (Q.length !== 0) {
            play(Q.shift());
            updateDoc(doc(db, "Users", auth.currentUser.uid), {
                "P_Queue": Q
            })
        }
    })
}
function queuePrevious() {
    if (currentAudio.element.currentTime <= 3) {
        getDoc(doc(db, "Users", auth.currentUser.uid)).then(user => {
            let index = user.data()["Queue"].findIndex(song => song === user.data()["P_Queue"][0]);
            if (index - 2 >= 0) {
                play(user.data()["Queue"][index - 2]);
            } else {
                currentAudio.element.currentTime = 0;
                pause();
            }
        })
    } else {
        currentAudio.element.currentTime = 0;
    }
}
export function setQueue(arr, count) {
    if (count) {
        let i = count;
        while (i > 0) {
            arr.push(arr.shift());
            i--;
        }
    }
    let temp = [];
    arr.forEach(sng => {
        temp.push(sng);
    });
    temp.shift();
    updateDoc(doc(db, "Users", auth.currentUser.uid), {
        "Queue": arr,
        "P_Queue": temp
    })
    play(arr[0]);
}

function Nowplaying() {
    return (
        <div id="now-playing-bar" className="now-playing-bar">
            <div className="now-playing-bar__current-song">
                <div className="now-playing-bar__current-song__img-area">
                    <img className="now-playing-bar__current-song__img-area__img" alt=""></img>
                </div>
                <div className="now-playing-bar__current-song__title-artist-container">
                    <div className="now-playing-bar__current-song__title-artist-container__title"></div>
                    <div className="now-playing-bar__current-song__title-artist-container__artist"></div>
                </div>
            </div>
            <div className="now-playing-bar__time-controls-container">
                <div id="song-controls" className="now-playing-bar__time-controls-container__controls">
                    <button id="button-previous" className="now-playing-bar__time-controls-container__controls__previous material-icons-round" onClick={queuePrevious}>skip_previous</button>
                    <button id="button-play" className="now-playing-bar__time-controls-container__controls__play material-icons-round" onClick={() => {if (currentAudio.exists) playOrPause()}}>play_arrow</button>
                    <button id="button-next" className="now-playing-bar__time-controls-container__controls__next material-icons-round" onClick={queueNext}>skip_next</button>
                </div>
                <div id="song-timer-container" className="now-playing-bar__time-controls-container__timer">
                    <p id="current-time" className="now-playing-bar__time-controls-container__timer__duration">00:00</p>
                    <div id="song-progress" className="now-playing-bar__time-controls-container__timer__progress" onClick={progressOnClick}>
                        <div id="song-progress-fill" className="now-playing-bar__time-controls-container__timer__progress__fill"></div>
                    </div>
                    <p id="duration" className="now-playing-bar__time-controls-container__timer__duration">00:00</p>
                </div>
            </div>
            <div id="volume" className="now-playing-bar__volume">
                <button id="volume-button" className="now-playing-bar__volume__button material-icons-round" onClick={toggleVolume}>volume_up</button>
                <div id="volume-slider" className="now-playing-bar__volume__slider">
                    <div id="volume-slider-fill" className="now-playing-bar__volume__slider__fill"></div>
                    <input type="range" id="volume-slider-thumb" className="now-playing-bar__volume__slider__thumb" defaultValue="50" min="0" max="100" step="1" onInput={e => modVolume(0.25 - (e.target.value / 400))}></input>
                </div>
            </div>
        </div>
    )
}

export default Nowplaying