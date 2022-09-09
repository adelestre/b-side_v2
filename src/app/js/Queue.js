import React from 'react'
import { BarInfoSong } from './Infotab'
import '../styles/components/Queue.scss'

export function displayQueue() {
  const queue = document.querySelector("#queue")
  queue && queue.classList.add("show")
}

export function removeQueueTab() {
  const queue = document.querySelector("#queue")
  queue && queue.classList.remove("show")
}

function Queue(props) {
  const user = props.userData
  const albums = props.albumsData
  const artists = props.artistsData
  const songs = props.songsData
  const queue = user.Queue
  let count = 0;
  if (user && albums && artists && songs) {
    return (
      <div id='queue' className='queue'>
        <button id="info-button-back" className="queue__button-back"><span className="material-icons-round" onClick={e => removeQueueTab()}>arrow_back_ios</span></button>
        <div className='queue__header'>
          <div className='queue__header__content'>
            <div className='queue__header__content__top'>
              <div className='queue__header__content__top__queue'>Queue</div>
              <div className='queue__header__content__top__nowplaying'>Now playing</div>
            </div>
          </div>
        </div>
        <div className='queue__content'>
          {queue && queue.map(song_ID => {
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