import React, {useState} from 'react';
import {useParams} from "react-router";
import Button from "react-bootstrap/Button";
import Characters from "../constants/Characters";
import RemoteEventMocks from "./RemoteEventMocks";
import Player from "../model/Player";
import StartingCharacters from "./StartingCharacters";

const initialPlayers: Array<Player> = [];

interface RouteParams {
  id: string
}

const GameTable = () => {

  const {id} = useParams<RouteParams>();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [turn, setTurn] = useState(0);
  const storyteller = "you";

  const addPlayer = (player: Player[]) => {
    setPlayers(players.concat(player))
  }
  const nextTurn = () => {
    setTurn(turn + 1)
  }

  const startGame = () => {
    assignCharacters();
    nextTurn()
  }

  function assignCharacters() {
    const pickedCharacters = StartingCharacters.forNumberOfPlayers(players.length, isTestId ? id : undefined);
    pickedCharacters.forEach((character, i) => {
      assignCharacter(players[i].id, character)
    })
  }

  function assignCharacter(playerId: string, character: string) {
    const updatedPlayers: Array<Player> = [];
    players.forEach(player => {
      if (playerId === player.id) {
        player.character = character;
      }
      updatedPlayers.push(player)
    });
    setPlayers(updatedPlayers)
  }

  const isTestId = id === "bdd-1";
  const isFirstNight = turn === 1;
  const isNight = turn % 2 === 1;
  const isDay = turn != 0 && !isNight;

  let hasPlayers = players.length != 0;

  const debug = {id, players, storyteller, turn, isFirstNight, isNight, isDay};

  return (
    <>
      <section className={"grimoire"}>
        <h2>
          grimoire {id}:
          {isDay && <span className={"day"} role="img" aria-label="day">🌇</span>}
          {isNight && <span className={"night"} role="img" aria-label="night">🌃</span>}
        </h2>
        <h3>players</h3>
        {!hasPlayers && <span className={"noPlayers"}>no players</span>}
        {hasPlayers && players.map((player, i) =>
          <>
            <div key={i} className={"player player" + i}>
              {player.id}
              <select className={"isCharacter"} value={player.character} onChange={e => assignCharacter(player.id, e.target.value)}>
                <option value="unassigned"></option>
                {Characters.map((character, i) => <option key={i} value={character}>{character}</option>)}
              </select>
            </div>
          </>
        )}
      </section>

      <section className={"controls"}>
        <h2>game controls</h2>
        {turn === 0 && <Button className={"startGame"} onClick={() => startGame()}>start game when all players are present</Button>}
        {isNight && <Button className={"startNextDay"} onClick={() => nextTurn()}>start the next day</Button>}
        {isDay && <Button className={"startNextNight"} onClick={() => nextTurn()}>start the next night</Button>}
      </section>

      <section className={"gameTableProperties"}>
        <h3>debug info</h3>
        <dl>
          {Object.entries(debug).map((t, k) => <React.Fragment key={k}>
            <dt key={"dt" + k}>{t[0]}:</dt>
            <dd key={"dd" + k}><pre>{JSON.stringify(t[1], null,  2)} </pre></dd>
          </React.Fragment>)}
        </dl>
        {isTestId && <RemoteEventMocks addPlayer={addPlayer}/>}
      </section>
    </>
  );
}

export default GameTable;