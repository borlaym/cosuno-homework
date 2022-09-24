import React from 'react'
import styled from '@emotion/styled'

const Pill = styled.div`
  display: inline-block;
  padding: 3px;
  border-radius: 5px;
  background: darkgray;
  color: white;
  margin: 3px;
`

type Props = {
  name: string
}
export default function SpecialtyPill({
  name
}: Props) {
  return (
    <Pill>{name}</Pill>
  )
}