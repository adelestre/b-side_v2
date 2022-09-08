import React from 'react'
import { setQueue } from './Nowplaying';
import { db } from './Firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import '../styles/components/Infotab.scss'

export function backHome() {
    const infotab = document.querySelector("#info-tab");
    const artist_infos = document.querySelector('.nav-bar__content__infos');
    const menu = document.querySelector(".nav-bar__content__menu");
    artist_infos.classList.add('hide');
    menu.classList.add('up');
    infotab.classList.remove('show');
}

function select_song(e) {
    const selected_songs = document.querySelectorAll(".info-tab__content__song.selected");
    selected_songs.forEach((selected_song) => {
        selected_song.classList.remove("selected");
    })
    e.target.parentNode.classList.add('selected');
}

function AlbumInfoSongs(song, artist, album, count) {
    return (
        <div id={"song" + song.data()["ID_Song"]} key={"song" + song.data()["ID_Song"]} className={"info-tab__content__song album" + album.data()["ID_Album"]} onClick={select_song}>
            <div className="info-tab__content__song__left-content">
                <button className="material-icons-round" onClick={e => setQueue(album.data()['ID_Songs'], count)}>play_arrow</button>
                <div className="info-tab__content__song__left-content__img-container">
                    <img src={album.data()["img"]} alt=""></img>
                </div>
                <div className="info-tab__content__song__left-content__artist-title-container">
                    <div className="info-tab__content__song__left-content__artist-title-container__title">{song.data()["Name"]}</div>
                    <div className="info-tab__content__song__left-content__artist-title-container__artist">{artist.data()["Name"]}</div>
                </div>
            </div>
             <div className="info-tab__content__song__middle-content">
                <div className="info-tab__content__song__middle-content__album">{album.data()["Name"]}</div>
             </div>
            <div className="info-tab__content__song__right-content">
                <button className="info-tab__content__song__right-content__like material-icons-round">favorite_border</button>
                <div className="info-tab__content__song__right-content__duration">{song.data()["Duration"]}</div>
                <div className="info-tab__content__song__right-content__options material-icons-round">more_vert</div>
            </div>   
        </div>
    )
}

function AlbumInfoHeader(props) {
    const album = props.album
    const artist = props.artist
    document.querySelector('.info-tab__header__background').style.backgroundImage = "url(https://storage.googleapis.com/b-side-songs/albums/banner" + album.data()["ID_Album"].toString() + ".jpg)"
    return (
        <div className="info-tab__header__content">
            <div className="info-tab__header__content__top">
                <img src={album.data()["img"]} alt="" className="info-tab__header__content__top__img"></img>
                <div className="info-tab__header__content__top__info">
                    <div className="info-tab__header__content__top__info__type">album</div>
                    <div className={"info-tab__header__content__top__info__name" + (album.data()["Long"] ? " long" : "")}>{album.data()["Name"]}</div>
                    <div className="info-tab__header__content__top__info__details">
                        <div className="info-tab__header__content__top__info__details__author">{artist.data()["Name"]}</div>
                        <div className="info-tab__header__content__top__info__details__date">{album.data()["Date"]}</div>
                        <div className="info-tab__header__content__top__info__details__count">{album.data()["ID_Songs"].length + " songs, " + album.data()["Duration"]}</div>
                    </div>
                </div>

            </div>
            <div className="info-tab__header__content__bot">
                <button className="info-tab__header__content__bot__button" onClick={e => setQueue(album.data()['ID_Songs'], 0)}>
                    <span className="material-icons-round">play_circle_filled</span>
                </button>
            </div>

        </div>
    )
}


function AlbumInfoContent(props) { // Loads all songs from Artist
    const album = props.album
    const artist = props.artist
    let count = 0;
    const [songs] = useCollection(query(collection(db, "Songs"), where("ID_Album", "==", album.data()["ID_Album"]), orderBy("ID_Song")))
    return (
        <div className="info-tab__content">
            {songs && songs.docs.map(song => {
                return AlbumInfoSongs(song, artist, album, count++)
            })}
        </div>
    )
}

function Infotab(props) {
    const displayAlbum = props.displayAlbum

    return (
        <div id="info-tab" className="info-tab">
            <div className="info-tab__header">
                <div className="info-tab__header__background"></div>
                <button id="info-button-back" className="info-tab__button-back"><span className="material-icons-round" onClick={backHome}>arrow_back_ios</span></button>
                {displayAlbum["bool"] && <AlbumInfoHeader album={displayAlbum["album"]} artist={displayAlbum["artist"]} />}
            </div>
            {displayAlbum["bool"] && <AlbumInfoContent album={displayAlbum["album"]} artist={displayAlbum["artist"]} />}
        </div>
    )
}

export default Infotab
