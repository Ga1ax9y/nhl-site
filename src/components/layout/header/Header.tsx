import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header(){
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            <header className="header">
                <Link className="header__logo" to="/">
                    <img
                    className="header__logo-img"
                    src="/nhl-logo.png"
                    height="65"
                    width="60"
                    alt="nhl logo" />
                </Link>
                <button className={`header__burger button ${isMenuOpen ? 'open' : ''}`} aria-label="open menu" onClick={toggleMenu}>
                    <svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>

                <nav className="header__nav-desktop">
                    <ul className="header__nav-list">
                        <li>
                            <Link className="header__nav-link" to="/schedule">Календарь</Link>
                        </li>
                        <li>
                            <Link className="header__nav-link" to="/standings">Таблицы</Link>
                        </li>
                        <li>
                            <Link className="header__nav-link" to="/teams">Клубы</Link>
                        </li>
                        <li>
                            <Link className="header__nav-link" to="/stats">Статистика</Link>
                        </li>
                    </ul>
                </nav>
                {isMenuOpen && (
                    <div className="header__overlay">
                        <nav className="header__overlay-nav">
                            <ul className="header__overlay-list">
                                <li className="header__overlay-item">
                                    <Link className="header__overlay-link" to="/" onClick={toggleMenu}>
                                        Главная
                                    </Link>
                                </li>
                                <li className="header__overlay-item">
                                    <Link className="header__overlay-link" to="/teams" onClick={toggleMenu}>
                                        Команды
                                    </Link>
                                </li>
                                <li className="header__overlay-item">
                                    <Link className="header__overlay-link" to="/players" onClick={toggleMenu}>
                                        Игроки
                                    </Link>
                                </li>
                                <li className="header__overlay-item">
                                    <Link className="header__overlay-link" to="/schedule" onClick={toggleMenu}>
                                        Матчи
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </header>
        </>
    )
}
