import React from 'react'
import '../styles/components/Header.scss'

export function toggleNavMenu() {
    const nav_bar = document.querySelector("#nav-bar");
    const overlay = document.querySelector("#overlay");
    if (nav_bar.classList.contains('mobile-open')) { // close menu
        nav_bar.classList.remove('mobile-open');
        overlay.classList.add('hidden');
    } else { // open menu
        nav_bar.classList.add('mobile-open');
        overlay.classList.remove('hidden');
    }
}

function Header(props) {
    let userName = props.userData["Name"]

    return (
        <div className="header-always-on-top">
            <button type="button" className="header-always-on-top__menu-toggle only-mobile" onClick={toggleNavMenu}><span className="material-icons-round">menu</span></button>
            <div className="header-always-on-top__profil">
                <div className="header-always-on-top__profil__name">{userName}</div>
                <span type="button" className="material-icons-outlined">arrow_drop_down</span>
            </div>
        </div>
    )
}

export default Header