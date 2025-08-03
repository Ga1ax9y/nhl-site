import { Link } from "react-router-dom";

export default function Header(){
    return (
        <>
            <header className="header">
                <Link className="header__logo" to="/">
                    <img
                    className="header__logo-img"
                    src="/nhl-logo.png"
                    height="65"
                    width="75"
                    alt="nhl logo" />
                </Link>
                <nav className="header__nav">
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
            </header>
        </>
    )
}
