import React, { useState, useEffect, setMessage } from 'react';
import './App.css';
import { useCandidates } from './CandidatesContext';


function App() {
  const [formData, setFormData] = useState({
    name: '',
    votes: 0,
  });
  const [candidates, setCandidates] = useState([]);


  const handleChange = (e) => {
    const value = e.target.value; // Destructure name and value from event target
    setFormData(prevState => ({
      ...prevState,
      name: value, // Use the input's name to update the corresponding property
    }));
  };

  useEffect(() => {
    // Fetch initial candidates list when the component mounts
    const fetchCandidates = async () => {
      const response = await fetch('http://localhost:3001/get-candidates');
      const data = await response.json();
      setCandidates(data);
    };
    fetchCandidates();
  }, [setCandidates]);

  const handleVote = async (name, e) => {
    e.preventDefault();
    console.log({ name: name })

    try {
      const response = await fetch('http://localhost:3001/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
      });
      const voteResult = await response.json();
      console.log(voteResult)
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.name === name) {
          return { ...candidate, votes: voteResult.vote };
        }
        return candidate;
      });
      setCandidates(updatedCandidates);
      // console.log(name)
      if (!response.ok) {
        console.log(response)
        throw new Error('Network response was not ok');
      }
      // Handle success response, maybe clear form or show a success message
    } catch (error) {
      console.error('Error:', error);
      // Handle errors, maybe show an error message to the user
    }
    
  
  };
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:3001/get-candidates');
        const candidatesData = await response.json();
        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/add_candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Assuming the addition was successful, fetch the updated list of candidates
      const updatedCandidatesResponse = await fetch('http://localhost:3001/get-candidates');
      if (!updatedCandidatesResponse.ok) {
        throw new Error('Failed to fetch updated candidates');
      }
      const updatedCandidates = await updatedCandidatesResponse.json();
      setCandidates(updatedCandidates); // Update the candidates state with the new list
      // Optionally, reset the form data here if needed
      setFormData({ name: '', votes: 0 });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="Candidate"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <button style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', margin: '10px', borderRadius: '5px', cursor: 'pointer' }} type="submit">Submit</button>
        </form>
        <ul>
          {candidates.map((candidate, index) => (
            <div key={index}>
              <li>{candidate.name} - Votes: {candidate.votes}</li>
              <button style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', margin: '10px', borderRadius: '5px', cursor: 'pointer' }} onClick={(e) => handleVote(candidate.name, e)}>Update Vote</button>
            </div>
          ))}
        </ul>
      </header>
    </div>
  );
}


export default App;