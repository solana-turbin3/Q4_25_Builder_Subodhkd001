'use client'

import CampaignCard from '@/components/CampaignCard'
import { useEffect, useMemo, useState } from 'react'
import {
  fetchActiveCampaigns,
  getProviderReadonly,
} from '@/services/blockchain'
import { Campaign } from '@/utils/interfaces'
import Hero from '@/components/landing/Hero'
import ProblemSolution from '@/components/landing/ProblemSolution'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import NFTEvolution from '@/components/landing/NFTEvolution'
import TargetUsers from '@/components/landing/TargetUsers'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Page() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const program = useMemo(() => getProviderReadonly(), [])

  useEffect(() => {
    fetchActiveCampaigns(program!).then((data) => setCampaigns(data))
  }, [program])

  return (
    <div>
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Features />
      <NFTEvolution />
      <TargetUsers />
      <CTA />
      <Footer />
    </div>
  )
}
