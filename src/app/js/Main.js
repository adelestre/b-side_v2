import { useState, useEffect } from 'react'
import { db } from './Firebase'
import { doc, collection } from 'firebase/firestore'
import {  useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { useNavigate } from 'react-router-dom';
import Queue from './Queue';
import Infotab from './Infotab';
import Header from './Header';
import Overlay from './Overlay';
import { Navbar, displayArtistInfoNavBar } from './Navbar';
import Nowplaying from './Nowplaying';
import '../styles/components/Main.scss'

function Main(props) {
    let navigate = useNavigate()
    const user = props.user
    const [userData] = useDocument(doc(db, "Users", user.uid))
    const [albumsData] = useCollection(collection(db, "Albums"))
    const [artistsData] = useCollection(collection(db, "Artists"))
    const [songsData] = useCollection(collection(db, "Songs"))
    const [displayAlbum, setDisplayAlbum] = useState({bool: false, album: {}})
    useEffect(() => {
        navigate("/")
    }, [navigate]);
    function displayRandomAlbums(int) { // display in main {int} random albums from the whole database
        if (albumsData) {
            let arr = [];
            let i = int;
            let jsx = []
            while (i > 0) {
                let randalbum = albumsData.docs[Math.floor(Math.random() * albumsData.docs.length)];
                if (!arr.includes(randalbum.data()["ID_Album"])) {
                    arr.push(randalbum.data()["ID_Album"]);
                    i--;
                    jsx.push(createAlbumTile(randalbum));
                }
            }
            return (
                <div id="container-album" className="main__center__container-album">
                    {jsx.map(a => {return a})}
                </div>
            )
        }
    }
    function displayAllAlbums() {
        if (albumsData) {
            let jsx = []
            for (let id = 0; id < albumsData.size; ++id) {
                jsx.push(createAlbumTile(albumsData.docs.find(album => album.data()["ID_Album"] === id)))
            }
            return (
                <div id="container-album" className="main__center__container-album">
                    {jsx.map(a => {return a})}
                </div>
            )
        }
    }
    function displayArtistAlbums(ID_Artist) { //display in main all albums by an artist ID
        if (albumsData) {
            let jsx = []
            albumsData.docs.forEach(album => {
                console.log()
                if (album.data()["ID_Artist"] === ID_Artist) {
                    jsx.push(createAlbumTile(album));
                }
            })
            return (
                <div id="container-album" className="main__center__container-album">
                    {jsx.map(a => {return a})}
                </div>
            )
        }
    }
    function displayAlbumInfo(alb, art) {
        const infotab = document.querySelector("#info-tab");
        setDisplayAlbum({bool: true, album: alb, artist: art})
        displayArtistInfoNavBar(art);
        infotab.classList.add('show');
    }
    function createAlbumTile(album) {
        if (artistsData) {
            let art = artistsData.docs.find(doc => doc.data()["ID_Artist"] === album.data()["ID_Artist"])
            return (
                <div className='album' onClick={e => displayAlbumInfo(album, art)} key={album.data()["ID_Album"]}>
                    <div className='album__content'>
                        <img src={album.data()["img"]} className='album__content__img' alt=""></img>
                        <div className='album__content__title'>{album.data()["Name"]}</div>
                        <div className='album__content__artist'>{art.data()["Name"]}</div>
                    </div>
                </div>
            )
        }
    }
    if (userData) {
        return (
            <div>
                <div id="main" className="main">
                    <div id="main-header" className="main__header">
                        <div className="main__header__welcome">Hello {userData.data()["Name"]}</div>
                    </div>
                    <div className="main__center">
                        <div className="main__center__album-section-title">Albums</div>
                        {false && displayRandomAlbums(36)}
                        {true && displayAllAlbums()}
                    </div>
                </div>
                <Infotab displayAlbum={displayAlbum} />
                <Queue userID={user.uid} albumsData={albumsData} artistsData={artistsData} songsData={songsData} />
                <Header userData={userData.data()}/>
                <Overlay userData={userData.data()}/>
                <Navbar userData={userData.data()} albumsData={albumsData} artistsData={artistsData} />
                <Nowplaying userData={userData.data()} albumsData={albumsData} artistsData={artistsData} />
            </div>
        )
    }
}

export default Main