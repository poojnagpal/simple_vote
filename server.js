// "Simple Voting Server".
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors()); // Use CORS to allow cross-origin requests


app.use(express.json());
const jsonFilePath = './candidates.json';

function readJsonFile() {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
  }

  let candidates = [
    {   
    "name": "Pooja",
    "party": "democrat",
    "votes": 0
    
  }
]
  function updateJsonFile(updates) {
    // const data = readJsonFile();
    
    // Update the data object with new key-value pairs
    // Object.keys(updates).forEach(key => {
    //   data[key] = updates[key];
    // });

  
    // Write the updated object back to the file
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
  }


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


app.post('/add_candidate', (req, res) => {
  const { name, party } = req.body;   
  if (candidates[name]) {
    res.status(400).send('Candidate already exists');
    return;
  }  
  candidates.push({
        name, party, votes: 0
    })
    console.log(name, party)
  res.send(candidates);
});
//list of candidates, each candidate name and vote count, add candidate to that list
//route to vote

app.post('/vote', (req, res) => {
  const { name, party } = req.body;
  console.log(candidates, name)
  let vote = 0
  for (let i = 0; i < candidates.length; i++) {
    if (candidates[i].name === name) {
        candidates[i].votes += 1;
      vote = candidates[i].votes
      found = true;
      break;
    }

  }
  console.log(found)
  if (!found) {
    res.sendStatus(404).send('Candidate not found');
    return;
  }
console.log('vote', vote)

res.status(200).send({'vote': vote});
  return vote
});

app.get('/get-candidates', (req, res) => {
    
    res.send(candidates);
  });
  

