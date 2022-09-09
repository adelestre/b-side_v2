import React from 'react'
import { BarInfoSong } from './Infotab'
import '../styles/components/Queue.scss'

function Queue(props) {
  const user = props.userData
  const albums = props.albumsData
  const artists = props.artistsData
  const songs = props.songsData
  const queue = user.Queue
  let count = 0;
  return (
    <div id='queue' className='queue'>
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

export default Queue