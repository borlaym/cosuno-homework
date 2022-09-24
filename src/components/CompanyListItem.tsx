import React from 'react'
import { Company } from '../types'
import styled from '@emotion/styled'
import SpecialtyPill from './SpecialtyPill'

const Container = styled.article`
  display: flex;
  align-items: center;
  justify-content: stretch;
  border: 1px solid black;
  padding: 5px;
  margin: 5px 0;
  background: white;
`

const Logo = styled.img`
  margin-right: 5px;
  width: 160px;
  height: 160px;
`

const TextDetails = styled.div``
const Name = styled.h2`
  font-size: 1.1;
  font-weight: bold;
  padding: 0;
`
const Location = styled.p``
const PillContainer = styled.div``

type Props = {
  company: Company
}
export default function CompanyListItemView({
  company
}: Props) {
  return (
    <Container>
      <Logo src={company.logo} alt={`${company.name} logo`} />
      <TextDetails>
        <Name>{company.name}</Name>
        <Location>{company.city}</Location>
        <PillContainer>
          {company.specialties.sort().map(specialty => <SpecialtyPill name={specialty} key={specialty} />)}
        </PillContainer>
      </TextDetails>
    </Container>
  )
}