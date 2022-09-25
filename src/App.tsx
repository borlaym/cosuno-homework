import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled'
import getAllCompanies from './network/getAllCompanies';
import { Company } from './types';
import CompanyListItemView from './components/CompanyListItem';
import SpecialtyPill from './components/SpecialtyPill';
import companyHasSpecialties from './utils/companyHasSpecialties';
import { debounce, isEqual } from 'lodash'
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

const SearchContainer = styled.div<{ isLoading: boolean }>`
  width: 100%;
  margin-bottom: 30px;
  max-width: 300px;
  position: relative;

  ::after {
    content: 'Loading...';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    text-align: center;
    display: ${props => props.isLoading ? 'block' : 'none'};
    padding: 3px;
  }
`

const SearchBar = styled.input`
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
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
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const currentFilters = useRef<[string, string[]]>(["", []]) // Needed to check when a result arrives if it still matches the current filter

  useEffect(function resetOnRenderAndBackendChange() {
    setSearchTerm("")
    setSelectedSpecialties([])
    currentFilters.current = ["", []]
    getAllCompanies()
      .then(setAllCompanies)
      .catch((err: Error) => setError(err.message))
  }, [useBackendSearch])

  const search = useCallback((query: string, selectedSpecialties: string[]) => {
    setIsUpdateLoading(true)
    getFilteredCompanies(query, selectedSpecialties)
      .then(res => {
        // Check if the values we started the search with still match the current filters
        if (query === currentFilters.current[0] && isEqual(selectedSpecialties, currentFilters.current[1])) {
          setAllCompanies(res)
        }
      })
      .catch(setError)
      .finally(() => setIsUpdateLoading(false))
  }, [])

  const debouncedSearch = useCallback(debounce((query: string) => {
    search(query, selectedSpecialties)
  }, 500), [selectedSpecialties, search])

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setSearchTerm(newValue)
    currentFilters.current = [newValue, currentFilters.current[1]]
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
        currentFilters.current = [currentFilters.current[0], newValue]
        return newValue
      } else {
        const newValue = [...previousValue, specialty]
        if (useBackendSearch) {
          search(searchTerm, newValue)
        }
        currentFilters.current = [currentFilters.current[0], newValue]
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
  }, []).sort() || []

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
      <SearchContainer isLoading={isUpdateLoading}>
        <SearchBar
          type="search"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
        />
      </SearchContainer>

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
