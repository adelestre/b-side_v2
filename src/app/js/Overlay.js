import React from 'react'
import { toggleNavMenu } from './Header'
import '../styles/globals/boilerplate.scss'

function Overlay() {
  return (
    <div id="overlay" className="overlay hidden" onClick={toggleNavMenu}></div>
  )
}

export default Overlay