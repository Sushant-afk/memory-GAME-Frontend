import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './App.css';
import SingleCard from './components/SingleCard';

const cardList = [
    { "src": "/img/img1.png" }, { "src": "/img/img1.png" },
    { "src": "/img/img2.png" }, { "src": "/img/img2.png" },
    { "src": "/img/img3.png" }, { "src": "/img/img3.png" },
    { "src": "/img/img4.png" }, { "src": "/img/img4.png" },
    { "src": "/img/img5.png" }, { "src": "/img/img5.png" },
    { "src": "/img/img6.png" }, { "src": "/img/img6.png" },
]

const Game = ({ cardState, turnCount, highScore, name }) => {

    const [cards, setCards] = useState([...cardState])
    const [firstCard, setFirstCard] = useState(null)
    const [turns, setTurns] = useState(turnCount);
    // const [matchedCount, setMatchedCount] = useState(0)

    // console.log("State", cardState)

    const logout = async () => {
       try {
           localStorage.setItem('token', null)
       } catch (err) {
        console.log("err", err)
       }
       window.location.reload(false);
    };

    const initialState = async () => {
        try {
          // let res = await axios.get(`http://localhost:5000/api/game/prev-state`);
          let res = await axios.get(`https://memory-game-backend-8zmy.onrender.com/api/game/prev-state`);
          if(res?.data?.gameState?.state) {
            let istate = res.data.gameState.state;
            setCards(istate)
            setTurns(res.data.gameState.turns)
          }
        } catch (err) {
          console.log(err)
        }
    }

    useEffect(() => { initialState() }, [])

    // useEffect(() => { setCards(cardState); setTurns(turnCount); }, [cardState, turnCount]);

    const saveState = async (id) => {
      try {
          // console.log("B", cards)
          const tempCards = cards;
          tempCards[id].flipped = true
          const body =  JSON.stringify({ state: tempCards, turns: turns + 1 })
          // let res = await axios.post(`http://localhost:5000/api/game/save-state`, body, {headers: { 'Content-Type': 'application/json' }});
        await axios.post(`https://memory-game-backend-8zmy.onrender.com/api/game/save-state`, body, {headers: { 'Content-Type': 'application/json' }});
      } catch (err) {
        console.log("save state api call error ", err)
      }
    }

    const saveTurns = async () => {
      const body = JSON.stringify({ turns: turns + 1 })
      try {
        // const res1 = await axios.post(`http://localhost:5000/api/game/save-turns`, body, {headers: { 'Content-Type': 'application/json' }});
        const res1 = await axios.post(`https://memory-game-backend-8zmy.onrender.com/api/game/save-turns`, body, {headers: { 'Content-Type': 'application/json' }});
      } catch (err) {
        console.log("save turns api call error ", err);
      }
    }

    // shuffle cards for new game
    const shuffleCards = async () => {
      const shuffledCards = [...cardList]
      .sort(() => 0.5 - Math.random())
      .map((card, index) => ({ ...card, flipped: false, id: index }))
      setCards(shuffledCards)
      setTurns(0)
      setFirstCard(null)
      const body =  JSON.stringify({ state: [], turns: 0 })
      // await axios.post(`http://localhost:5000/api/game/save-state`, body, {headers: { 'Content-Type': 'application/json' }});
      await axios.post(`https://memory-game-backend-8zmy.onrender.com/api/game/save-state`, body, {headers: { 'Content-Type': 'application/json' }});
    }

    const handleSelect = (card) => {
      setTurns((turns) => turns + 1)
      setCards(prevCards => {
        return prevCards.map(prevCard => {
          if(prevCard.id == card.id) return { ...prevCard, flipped: true }
          else return prevCard;
        })
      })
      // console.log("A ", cards)
      if(!firstCard){
        setFirstCard(card);
        saveTurns();
      }
      else {
        if(card.src == firstCard.src) {
          // setMatchedCount(matchedCount+2)
          saveState(card.id);
        } else {
          // if didn't match flip the two selected cards
          setTimeout(() => {
            setCards(prevCards => {
              return prevCards.map(prevCard => {
                if(prevCard.id == card.id || prevCard.id == firstCard.id) return { ...prevCard, flipped: false }
                else return prevCard;
              })
            });
          }, 1000);
          saveTurns()
        }
        setFirstCard(null);
      }
    }

    return (
        <>
          <h2> Hi {name}! Welcome to Memory Game </h2>
          <button onClick={shuffleCards}> New Game </button>
          <button onClick={logout}> Logout </button>
          <Link to = "/leaderboard" style={{ textDecoration: "none", color: "white" }}> <button> Leaderboard </button> </Link>
          { highScore != -1 ? <p> Your high score: {highScore} </p> : <></>}
          <div className="card-grid">
            {cards.map(card => (
              <SingleCard key={card.id} card={card} handleSelect={handleSelect}/>
            ))}
          </div>
          <p> Moves: { turns } </p>
        </>
    );
}

export default Game;
