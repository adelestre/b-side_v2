import React from 'react'
import { setQueue } from './Nowplaying';
import { db } from './Firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import '../styles/components/Infotab.scss'

export function removeInfoTab() {
    const infotab = document.querySelector("#info-tab");
    const artist_infos = document.querySelector('.nav-bar__content__infos');
    const menu = document.querySelector(".nav-bar__content__menu");
    artist_infos.classList.add('hide');
    menu.classList.add('up');
    infotab.classList.remove('show');
}

export function select_song(e) {
    const selected_songs = document.querySelectorAll(".info-tab__content__song.selected");
    selected_songs.forEach((selected_song) => {
        selected_song.classList.remove("selected");
    })
    e.target.parentNode.classList.add('selected');
}

export function BarInfoSong(song, artist, album, count, classname) {
    return (
        <div id={"song" + song.data()["ID_Song"]} key={"song" + song.data()["ID_Song"]} className={classname+" album" + album.data()["ID_Album"]} onClick={select_song}>
            <div className={classname+"__left-content"}>
                {count >= 0 && <button className="material-icons-round" onClick={e => setQueue(album.data()['ID_Songs'], count)}>play_arrow</button>}
                <div className={classname+"__left-content__img-container"}>
                    <img src={album.data()["img"]} alt=""></img>
                </div>
                <div className={classname+"__left-content__artist-title-container"}>
                    <div className={classname+"__left-content__artist-title-container__title"}>{song.data()["Name"]}</div>
                    <div className={classname+"__left-content__artist-title-container__artist"}>{artist.data()["Name"]}</div>
                </div>
            </div>
             <div className={classname+"__middle-content"}>
                <div className={classname+"__middle-content__album"}>{album.data()["Name"]}</div>
             </div>
            <div className={classname+"__right-content"}>
                <button className={classname+"__right-content__like material-icons-round"}>favorite_border</button>
                <div className={classname+"__right-content__duration"}>{song.data()["Duration"]}</div>
                <div className={classname+"__right-content__options material-icons-round"}>more_vert</div>
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
                return BarInfoSong(song, artist, album, count++, "info-tab__content__song")
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
                <button id="info-button-back" className="info-tab__button-back"><span className="material-icons-round" onClick={removeInfoTab}>arrow_back_ios</span></button>
                {displayAlbum["bool"] && <AlbumInfoHeader album={displayAlbum["album"]} artist={displayAlbum["artist"]} />}
            </div>
            {displayAlbum["bool"] && <AlbumInfoContent album={displayAlbum["album"]} artist={displayAlbum["artist"]} />}
        </div>
    )
}

export default Infotab
