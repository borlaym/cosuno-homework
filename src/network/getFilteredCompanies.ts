import { Company } from "../types";

export default function getFilteredCompanies(query: string, specialties: string[]): Promise<Company[]> {

  const specialtiesString = specialties.length > 0 ? '&specialties=' + specialties.join('&specialties=') : ''

  return fetch(`/api/search?q=${query}${specialtiesString}`)
    .then(res => res.json())
    .then(res => {
      if (res.error || !res.data) {
        console.error(res.error)
        throw new Error("Unable to fetch companies")
      } else {
        return res.data
      }
    })
}