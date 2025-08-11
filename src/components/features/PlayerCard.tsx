import type { IPlayer } from "../../types/player";

interface PlayerCardProps {
    player: IPlayer
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <li className="roster__list-item">
      <div className="player-card">
        <div className="player-card__image-container">
          <img
            className="player-card__image"
            src={player.headshot}
            alt={`${player.firstName.default} ${player.lastName.default}`}
            loading="lazy"
          />
        </div>
        <h3 className="player-card__name">
          {player.firstName.default} {player.lastName.default}
        </h3>
        <div className="player-card__details">
          <span className="player-card__jersey">#{player.sweaterNumber}</span>
          <span className="player-card__position">{player.positionCode}</span>
          {/* <span className="player-card__stats">
            {player.stats?.goals || 0}G {player.stats?.assists || 0}A
          </span> */}
        </div>
      </div>
    </li>
  );
}
