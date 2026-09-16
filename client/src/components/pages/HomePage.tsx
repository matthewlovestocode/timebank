import type { ReactNode } from 'react'
import { WelcomePanel } from '../marketplace/WelcomePanel'
import { PageLayout } from '../layout/PageLayout'

type HomePageProps = {
  navigation: ReactNode
}

export function HomePage({ navigation }: HomePageProps) {
  return (
    <PageLayout navigation={navigation}>
      <WelcomePanel />
    </PageLayout>
  )
}
