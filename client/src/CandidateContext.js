import React, { createContext, useState, useContext } from 'react';

const CandidatesContext = createContext();

export const useCandidates = () => useContext(CandidatesContext);

export const CandidatesProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);

  const value = {
    candidates,
    setCandidates,
  };

  return <CandidatesContext.Provider value={value}>{children}</CandidatesContext.Provider>;
};