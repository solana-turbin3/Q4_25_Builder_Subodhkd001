'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import CampaignDetails from '@/components/CampaignDetails'
import CampaignDonate from '@/components/CampaignDonate'
import DonationsList from '@/components/DonationsList'
import WithdrawalList from '@/components/WithdrawalList'
import Image from 'next/image'
import WithdrawModal from '@/components/WithdrawModal'
import DeleteModal from '@/components/DeleteModal'
import {
  fetchAllDonations,
  fetchAllWithsrawals,
  fetchCampaignDetails,
  getProviderReadonly,
} from '@/services/blockchain'
import { RootState } from '@/utils/interfaces'
import { useSelector } from 'react-redux'

export default function CampaignPage() {
  const { cid } = useParams()
  const program = useMemo(() => getProviderReadonly(), [])
  const [isLoading, setIsLoading] = useState(true)

  const { campaign, donations, withdrawals } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    if (cid) {
      const fetchDetails = async () => {
        setIsLoading(true)
        try {
          await fetchCampaignDetails(program!, cid as string)
          await fetchAllDonations(program!, cid as string)
          await fetchAllWithsrawals(program!, cid as string)
        } catch (error) {
          console.error('Error fetching campaign details:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchDetails()
    }
  }, [program, cid])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    )
  }

  // Campaign not found state
  if (!campaign)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <h4 className="text-lg text-muted-foreground">Campaign not found</h4>
      </div>
    )

  return (
    <section className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image
          src={campaign.imageUrl}
          alt={campaign.title}
          width={1920}
          height={480}
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay: gradient & glass effect for title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-charcoal/80 to-transparent z-10 flex items-end md:items-center justify-center">
          <div className="rounded-2xl glass-effect p-6 md:p-10 mb-6 md:mb-0 mx-4 max-w-2xl w-full shadow-lg border border-white/15">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-xl">
              {campaign.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8 -mt-16 z-20">
        <div className="md:col-span-2 text-white bg-charcoal/80 rounded-2xl p-8 shadow-lg glass-effect border border-border">
          <CampaignDetails campaign={campaign} />
        </div>
        <div className="bg-charcoal/60 rounded-2xl p-8 shadow-md glass-effect border border-border flex flex-col justify-center">
          <CampaignDonate campaign={campaign} pda={cid as string} />
        </div>
      </div>

      {/* Donations and Withdrawals Sections */}
      <div className="container max-w-6xl mx-auto px-4 md:px-6 pb-12 grid md:grid-cols-2 gap-8">
        <div className="bg-muted/30 rounded-2xl p-6 shadow-md glass-effect border border-border">
          <DonationsList donations={donations} />
        </div>
        <div className="bg-muted/30 rounded-2xl p-6 shadow-md glass-effect border border-border">
          <WithdrawalList withdrawals={withdrawals} />
        </div>
      </div>

      {/* Modals are portal-based, include outside grid */}
      <WithdrawModal campaign={campaign} pda={cid as string} />
      <DeleteModal campaign={campaign} pda={cid as string} />
    </section>
  )
}