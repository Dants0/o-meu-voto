import classNames from 'classnames'
import { useRouter } from 'next/router'
import { BookmarkSimple } from '@phosphor-icons/react'

import { useCandidates } from 'hooks'
import { maskToParamsURL, normalizeString } from 'utils/mask'
import type { Candidate, CandidateSimple } from 'types/candidate'

import styles from './styles.module.scss'

const Candidate = (candidate: CandidateSimple) => {
  const { asPath } = useRouter()
  const baseUrl = asPath.split('/candidatos')[0]

  const code = candidate.numero.toString().split('')
  const name = maskToParamsURL(candidate.nomeUrna)

  const href = baseUrl + `/candidato/${candidate.id}-${name}`

  return (
    <a href={href} className={classNames('card', styles.candidate)}>
      <div className={styles.info}>
        <strong>{candidate.nomeUrna}</strong>
        <p>{candidate.nomeCompleto}</p>
      </div>

      <div className={styles.code}>
        {code.map((item, index) => (
          <span key={index + candidate.nomeUrna}>{item}</span>
        ))}
      </div>
    </a>
  )
}

interface SectionProps {
  title: string
  candidates: CandidateSimple[]
}

const Section = ({ title, candidates }: SectionProps) => (
  <section className={styles.section}>
    <h2>
      <BookmarkSimple weight="fill" />
      {title}
    </h2>

    {candidates.length === 0 ? (
      <p>A lista de candidatos está fazia.</p>
    ) : (
      <div className={styles.candidates}>
        {candidates.map(candidate => (
          <Candidate {...candidate} key={candidate.id + candidate.nomeUrna} />
        ))}
      </div>
    )}
  </section>
)

export const Candidates = () => {
  const { candidates, filter } = useCandidates()

  // TODO - Add empty state
  if (candidates.councilor.length === 0 && candidates.mayor.length === 0) {
    return <></>
  }

  const clearString = (str: string) => {
    if (!str) return ''
    return normalizeString(str).toLocaleLowerCase()
  }

  const handleFilterCandidates = (list: CandidateSimple[]) => {
    const search = clearString(filter.candidateName)

    if (!search && filter.parties.length === 0) {
      return list
    }

    return list.filter(candidate => {
      let isMatch = true
      const { nomeUrna, nomeCompleto, partidoSigla } = candidate

      if (filter.parties.length > 0) {
        isMatch = filter.parties.includes(partidoSigla)
      }

      if (isMatch && search.length > 0) {
        isMatch =
          clearString(nomeUrna).includes(search) ||
          clearString(nomeCompleto).includes(search)
      }

      return isMatch
    })
  }

  const mayorFiltered = handleFilterCandidates(candidates.mayor)
  const councilorFiltered = handleFilterCandidates(candidates.councilor)

  return (
    <div className={styles.container}>
      <Section title="Cargo de Prefeito" candidates={mayorFiltered} />
      <Section title="Cargo de Vereador" candidates={councilorFiltered} />
    </div>
  )
}
