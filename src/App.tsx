import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled'
import getAllCompanies from './network/getAllCompanies';
import { Company } from './types';
import CompanyListItemView from './components/CompanyListItem';
import SpecialtyPill from './components/SpecialtyPill';
import companyHasSpecialties from './utils/companyHasSpecialties';

const RootContainer = styled.div`
  padding: 50px 20px;
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

const SpecialtyContainer = styled.div`
  margin-bottom: 10px;
`

function App() {

  const [allCompanies, setAllCompanies] = useState<Company[] | undefined>(undefined)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])

  useEffect(function fetchAllCompaniesOnRender() {
    getAllCompanies()
      .then(setAllCompanies)
      .catch((err: Error) => setError(err.message))
  }, [])

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }, [])

  const allSpecialties: string[] = allCompanies?.flatMap(c => c.specialties).reduce((acc: string[], item: string) => {
    if (!acc.includes(item)) {
      return [...acc, item]
    } else {
      return acc
    }
  }, []) || []

  const handleSpecialtyChange = useCallback((specialty: string) => {
    setSelectedSpecialties(previousValue => {
      if (previousValue.includes(specialty)) {
        return previousValue.filter(s => s !== specialty)
      } else {
        return [...previousValue, specialty]
      }
    })
  }, [])

  const filteredResults = allCompanies?.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(company => selectedSpecialties.length === 0 || companyHasSpecialties(company, selectedSpecialties))
    .sort((a, b) => a.name < b.name ? -1 : 1)

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
      <SpecialtyContainer>
        {allSpecialties.map(specialty => (
          <SpecialtyPill key={specialty} name={specialty} showCheckbox isChecked={selectedSpecialties.includes(specialty)} onClick={handleSpecialtyChange} />
        ))}
      </SpecialtyContainer>
      <ListContainer>
        {filteredResults?.map(company => (
          <CompanyListItemView company={company} key={company.id} />
        ))}
      </ListContainer>
    </RootContainer>
  );
}

export default App;
