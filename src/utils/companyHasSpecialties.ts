import { Company } from "../types";

export default function companyHasSpecialties(company: Company, specialties: string[]): boolean {
  return !specialties.map(s => company.specialties.includes(s)).includes(false)
}