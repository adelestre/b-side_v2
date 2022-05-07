import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './Firebase'
import '../styles/components/Navbar.scss'

export function displayArtistInfoNavBar(artist) {
    const artist_img = document.querySelector(".nav-bar__content__infos__content__img-container__img")
    const artist_name = document.querySelector(".nav-bar__content__infos__content__artist-infos__name-container__name")
    const artist_infos = document.querySelector(".nav-bar__content__infos")
    const menu = document.querySelector(".nav-bar__content__menu")
    artist_img.src = artist.data()["img"];
    artist_name.textContent = artist.data()["Name"];
    if (artist_infos.classList.contains('hide')) {
        artist_infos.classList.remove('hide');
        menu.classList.remove("up")
    }
}
edeinodan
dimodoan

export function Navbar() {

    return (
        <div id="nav-bar" className="nav-bar">
            <div className="nav-bar__content">
                <div className="nav-bar__content__img-container">
                    <div className="nav-bar__content__img-container__img-content">
                        <img className="nav-bar__content__img-container__img-content__img" src="ressources/logo.png" alt="Logo"></img>
                    </div>
                </div>
                <div className="nav-bar__content__infos hide">
                    <div className="nav-bar__content__infos__content">
                        <div className="nav-bar__content__infos__content__img-container">
                            <img alt="" className="nav-bar__content__infos__content__img-container__img"></img>
                        </div>
                        <div className="nav-bar__content__infos__content__artist-infos">
                            <div className="nav-bar__content__infos__content__artist-infos__name-container">
                                <div className="nav-bar__content__infos__content__artist-infos__name-container__name"></div>
                                <img src="ressources/verified badge.svg" alt="" className="nav-bar__content__infos__content__artist-infos__name-container__verified"></img>
                            </div>
                            <div className="nav-bar__content__infos__content__artist-infos__followers-container">
                                <img src="ressources/followers.png" alt="" className="nav-bar__content__infos__content__artist-infos__followers-container__followers-logo"></img>
                                <div className="nav-bar__content__infos__content__artist-infos__followers-container__followers-count">5.36 M</div>
                            </div>
                            <button type="button" className="nav-bar__content__infos__content__artist-infos__follow"><span className="material-icons-outlined">group_add</span>Follow</button>
                        </div>
                    </div>
                </div>
                <div className="nav-bar__content__menu up">
                    <button type="button" className="nav-bar__content__menu__item__home"><span className="material-icons-round">home</span>Home</button>
                    <button type="button" className="nav-bar__content__menu__item__playlist"><span className="material-icons-round">playlist_play</span>Playlists</button>
                </div>
            </div>
            <button type="button" id="logout" className="nav-bar__content__logout"><span className="material-icons-round" onClick={e => signOut(auth)} >logout</span></button>
            <button type="button" id="settings_button" className="nav-bar__content__settings"><span className="material-icons-round">settings</span></button>
        </div>
    )
}