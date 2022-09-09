import React from 'react'
import { BarInfoSong } from './Infotab'
import '../styles/components/Queue.scss'
import { useDocument } from 'react-firebase-hooks/firestore'
import { doc } from 'firebase/firestore'
import { db } from './Firebase'

export function displayQueue() {
  const queue = document.querySelector("#queue")
  queue && queue.classList.add("show")
}

export function removeQueueTab() {
  const queue = document.querySelector("#queue")
  queue && queue.classList.remove("show")
}

function Queue(props) {
  const userID = props.userID
  const [user] = useDocument(doc(db, "Users", userID))
  const albums = props.albumsData
  const artists = props.artistsData
  const songs = props.songsData
  if (user && albums && artists && songs) {
    let currentSongID = user.data()["C_Playing"]
    let currentSong = songs.docs.find(doc => doc.data()["ID_Song"] === currentSongID)
    let currentSongAlbum = albums.docs.find(doc => doc.data()["ID_Album"] === currentSong.data()["ID_Album"])
    let currentSongArtist = artists.docs.find(doc => doc.data()["ID_Artist"] === currentSong.data()["ID_Artist"])
    let count = 0;
    return (
      <div id='queue' className='queue'>
        <button id="info-button-back" className="queue__button-back"><span className="material-icons-round" onClick={e => removeQueueTab()}>arrow_back_ios</span></button>
        <div className='queue__header'>
          <div className='queue__header__content'>
            <div className='queue__header__content__top'>
              <div className='queue__header__content__top__queue'>Queue</div>
              <div className='queue__header__content__top__nowplaying'>Now playing</div>
              {BarInfoSong(currentSong, currentSongArtist, currentSongAlbum, -1, "queue__content__song")}
            </div>
          </div>
        </div>
        <div className='queue__content'>
          {user.data()["P_Queue"].map(song_ID => {
            const song = songs.docs.find(doc => doc.data()["ID_Song"] === song_ID)
            const album = albums.docs.find(doc => doc.data()["ID_Album"] === song.data()["ID_Album"])
            const artist = artists.docs.find(doc => doc.data()["ID_Artist"] === song.data()["ID_Artist"])
            return BarInfoSong(song, artist, album, count++, "queue__content__song")
          })}
        </div>
      </div>
    )
  }
}

export default Queue