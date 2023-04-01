import React from "react";
import './SingleCard.css'

const SingleCard = ({ card, handleSelect }) => {

    const handleClick = () => {
      handleSelect(card)
    }

    return (
        <>
         <div className="card" key={card.id}>
          <div className={card.flipped ? "flipped" : ""}>
            <img className="front" src={card.src} alt="card front" style={{ height:"150", width:"148px" }}/>
            <img className="back" src="/img/cover.png" alt="cover" style={{ border: "1px solid white", height:"150", width:"148px" }} onClick={handleClick}/>
          </div>
         </div>
        </>
    )
}

export default SingleCard;