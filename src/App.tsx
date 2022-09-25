import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled'
import getAllCompanies from './network/getAllCompanies';
import { Company } from './types';
import CompanyListItemView from './components/CompanyListItem';
import SpecialtyPill from './components/SpecialtyPill';
import companyHasSpecialties from './utils/companyHasSpecialties';
import { debounce } from 'lodash'
import getFilteredCompanies from './network/getFilteredCompanies';

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

  const [useBackendSearch, setUseBackendSearch] = useState(false)
  const [allCompanies, setAllCompanies] = useState<Company[] | undefined>(undefined)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])

  useEffect(function resetOnRenderAndBackendChange() {
    setSearchTerm("")
    setSelectedSpecialties([])
    getAllCompanies()
      .then(setAllCompanies)
      .catch((err: Error) => setError(err.message))
  }, [useBackendSearch])

  const search = useCallback((query: string, selectedSpecialties: string[]) => {
    getFilteredCompanies(query, selectedSpecialties)
      .then(setAllCompanies)
      .catch(setError)
  }, [])

  const debouncedSearch = useCallback(debounce((query: string) => {
    search(query, selectedSpecialties)
  }, 500), [selectedSpecialties, search])

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setSearchTerm(newValue)
    if (useBackendSearch) {
      debouncedSearch(newValue)
    }
  }, [debouncedSearch, useBackendSearch])

  const handleUseBackendChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUseBackendSearch(event.target.checked)
  }, [])



  const handleSpecialtyChange = useCallback((specialty: string) => {
    setSelectedSpecialties(previousValue => {
      if (previousValue.includes(specialty)) {
        const newValue = previousValue.filter(s => s !== specialty)
        if (useBackendSearch) {
          search(searchTerm, newValue)
        }
        return newValue
      } else {
        const newValue = [...previousValue, specialty]
        if (useBackendSearch) {
          search(searchTerm, newValue)
        }
        return [...previousValue, specialty]
      }
    })
  }, [useBackendSearch, search, searchTerm])

  const filteredResults = useBackendSearch ? allCompanies : allCompanies?.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(company => selectedSpecialties.length === 0 || companyHasSpecialties(company, selectedSpecialties))

  const sortedResults = filteredResults?.sort((a, b) => a.name < b.name ? -1 : 1)

  const allSpecialties: string[] = sortedResults?.flatMap(c => c.specialties).reduce((acc: string[], item: string) => {
    if (!acc.includes(item)) {
      return [...acc, item]
    } else {
      return acc
    }
  }, []) || []

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
      <p>Use backend search <input type="checkbox" checked={useBackendSearch} onChange={handleUseBackendChange} /></p>
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
        {sortedResults?.map(company => (
          <CompanyListItemView company={company} key={company.id} />
        ))}
      </ListContainer>
    </RootContainer>
  );
}

export default App;
