import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const SearchBar = styled.input`
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 30px;
  max-width: 300px;
`

function App() {

  const [allCompanies, setAllCompanies] = useState<Company[] | undefined>(undefined)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(function fetchAllCompaniesOnRender() {
    getAllCompanies()
      .then(setAllCompanies)
      .catch(err => setError)
  }, [])

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }, [])

  const filteredResults = allCompanies?.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
      <SearchBar
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <ListContainer>
        {filteredResults?.map(company => (
          <CompanyListItemView company={company} key={company.id} />
        ))}
      </ListContainer>
    </RootContainer>
  );
}

export default App;
