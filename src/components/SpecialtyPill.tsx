import React from 'react'
import styled from '@emotion/styled'

const Pill = styled.div`
  display: inline-block;
  padding: 3px;
  border-radius: 5px;
  background: darkgray;
  color: white;
  margin: 3px 6px;
  cursor: pointer;
`

type Props = {
  name: string;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onClick?: (name: string) => void
}
export default function SpecialtyPill({
  name,
  onClick,
  showCheckbox,
  isChecked
}: Props) {
  return (
    <Pill onClick={onClick ? () => onClick(name) : undefined}>
      {name}
      {showCheckbox && <input type="checkbox" checked={isChecked || false} readOnly />}
    </Pill>
  )
}