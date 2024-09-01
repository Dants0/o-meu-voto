import Link from 'next/link'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import type { Candidate } from 'types/candidate'
import { serviceGetCandidate } from 'services'
import {
  CaretRight,
  City,
  IdentificationCard,
  Mailbox
} from '@phosphor-icons/react'
import { GetStaticPaths, GetStaticProps } from 'next'

import { Layout } from 'components'
import { Profile } from './components/Profile'
import { Tags } from './components/Tags'
import { News } from './components/News'
import { Properties } from './components/Properties'

import styles from './styles.module.scss'

const CandidatePage = (candidate: Candidate) => {
  const router = useRouter()

  if (!candidate) {
    return <></>
  }

  const hostCity = router.asPath.split('/candidato/')[0]

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">Eleições 2024</Link>

          <CaretRight size={12} />

          {/* router.goback() ??? */}
          <Link href={hostCity + '/candidatos'}>
            <City size={17} />
            <p>
              <span>{candidate.localCandidatura}</span>
            </p>
          </Link>

          <CaretRight size={12} />

          <span>
            <IdentificationCard size={17} />
            <p>
              Candidato(a) <span>{candidate.nomeUrna.toLocaleLowerCase()}</span>
            </p>
          </span>
        </div>

        <div className={styles.content}>
          <Profile {...candidate} />

          <div className={classNames('card', styles.info)}>
            <Tags {...candidate} />

            {candidate.emails && (
              <div>
                <h2>
                  <Mailbox />
                  Emails para contato
                </h2>

                <p>{candidate.emails.join(', ')}</p>
              </div>
            )}

            <News {...candidate} />

            <Properties {...candidate} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: 'blocking', paths: [] }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return serviceGetCandidate(params)
}

export default CandidatePage
