import { useEffect, useState } from 'react';
import './App.css';
import Game from './Game';
import Login from './Login';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Leaderboard from './components/Leaderboard';
// require('dotenv').config()
import jwtDecode from 'jwt-decode';

function App() {
    const [user, setUser] = useState(false);
	const [hs, setHS] = useState(-1);
	const [name, setName] = useState("John")
	const [savedGame, setSavedGame] = useState([]);
	const [savedTurnCount, setSavedTurn] = useState(0)
	axios.defaults.withCredentials = true
	const getUser = async () => {
		try {
			if(localStorage.getItem('token')) {
				let token = localStorage.getItem('token')
				let user = jwtDecode(token)
				axios.defaults.headers.common['auth-token'] = `${token}`;
				setUser(true)
				setName(user.name)
				let response = await axios.get('http://localhost:5000/api/auth/login')
				// let response = await axios.get('https://memory-game-backend-8zmy.onrender.com/api/auth/login')
				if(response?.data) {
					setHS(response.data.highScore)
					if(response.data.gameState) {
						let state = response.data.gameState.state, turns = response.data.gameState.turns;
						setSavedGame([...state])
						setSavedTurn(turns)
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => { getUser() }, []);

	return (
	<div className="App">
		<Router>
			<Switch>
			<Route exact path="/" component={() => (user ? <Game cardState={savedGame} turnCount={savedTurnCount} highScore={hs} name={name}/> : <Login/>)}/>
			<Route exact path="/leaderboard" component={Leaderboard}/>
			</Switch>
		</Router>
	</div>
	);
}

export default App;
