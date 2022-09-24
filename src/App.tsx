import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled'
import getAllCompanies from './network/getAllCompanies';
import { Company } from './types';
import CompanyListItemView from './components/CompanyListItem';

const RootContainer = styled.div`
  padding: 50px 20px;
  margin: 20px;
  background: beige;
  color: black;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;

`

function App() {

  const [allCompanies, setAllCompanies] = useState<Company[] | undefined>(undefined)
  const [error, setError] = useState("")

  useEffect(function fetchAllCompaniesOnRender() {
    getAllCompanies()
      .then(setAllCompanies)
      .catch(err => setError)
  }, [])

  if (typeof allCompanies == "undefined") {
    return <RootContainer>
      <p>Loading...</p>
    </RootContainer>
  }

  if (error.length !== 0) {
    return <RootContainer>
      <p>{error}</p>
    </RootContainer>
  }

  return (
    <RootContainer>
      <ListContainer>
        {allCompanies.map(company => (
          <CompanyListItemView company={company} key={company.id} />
        ))}
      </ListContainer>
    </RootContainer>
  );
}

export default App;
