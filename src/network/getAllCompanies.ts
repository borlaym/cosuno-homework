import { Company } from "../types";

export default function getAllCompanies(): Promise<Company[]> {
  return fetch('/api/all')
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