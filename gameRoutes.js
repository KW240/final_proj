const express = require("express");
const router = express.Router();
const { insert, findScores, remove} = require('./modules.js');

let data;

let state = {
  totalScore: 0,
  totalGuesses: 10,
  pokemonname: ""
};


async function getPokemonDescription() {
    const randomId = Math.floor(Math.random() * 1017) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}/`);
    const data = await response.json();
    state.pokemonname = data.name;
    const description = data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
    return description;
}

router.get("/", (req, res) => { 
    state.totalScore = 0;
    state.totalGuesses = 10;
    res.render('home');
});
router.get("/leaderboard2" , async (req,res)=> {
    data = await findScores();
    data.sort((a, b) => b.score - a.score);
    let lastEntry;
    if (data.length === 0){
        await insert(req.query.playerName, state.totalScore);
    } else if (data.length != 0){
        lastEntry = data[data.length - 1];
        if (lastEntry.name !== req.query.playerName) {
            await insert(req.query.playerName, state.totalScore);
        }
    }
    data = await findScores();
    data.sort((a, b) => b.score - a.score);

    let output = `<table><tr><th>Player</th><th>Score</th></tr>`;
    let counter = 0;

    if (data.length <= 20) {
        data.forEach(element => {
            output += `<tr><td>${++counter}. ${element.name}</td><td>${element.score}</td></tr>`;
        });
    } else {
        remove();
        data = await findScores();
        data.sort((a, b) => b.score - a.score); //if past 20 entries then the lowest score is removed
        data.forEach(element => {
            output += `<tr><td>${++counter}. ${element.name}</td><td>${element.score}</td></tr>`;
        });
    }
    output += `</table>`;
    res.render('leaderboard2', { output });
});
router.get("/leaderboard", async (req, res) => {
    data = await findScores();
    data.sort((a, b) => b.score - a.score);
    let output = `<table><tr><th>Player</th><th>Score</th></tr>`;
    let counter = 0;

    if (data.length <= 20) {
        data.forEach(element => {
            output += `<tr><td>${++counter}. ${element.name}</td><td>${element.score}</td></tr>`;
        });
    } else {
        remove(); 
        data.forEach(element => {
            output += `<tr><td>${++counter}. ${element.name}</td><td>${element.score}</td></tr>`;
        });
    }
    output += `</table>`;
    res.render('leaderboard', { output });
});

router.post("/guess",(req, res) => {
  const newScore = parseInt(req.body.currentScoreOutput);
  const newGuesses = parseInt(req.body.totalGuessesOutput);

  state.totalGuesses = newGuesses; 
  state.totalScore = newScore; 
  res.redirect("/guess"); 
});


router.get("/guess", async (req, res) => {
  const description = await getPokemonDescription();

  res.render("guess", {
    totalScore: state.totalScore,
    totalGuesses: state.totalGuesses,
    description: description,
    answer: state.pokemonname
  });
});

router.get("/entername", (req, res) => {
    res.render('entername', {});  
});

module.exports = router;
