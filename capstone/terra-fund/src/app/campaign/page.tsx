'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Campaign } from '@/utils/interfaces'
import { fetchActiveCampaigns, getProviderReadonly } from '@/services/blockchain'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const program = useMemo(() => getProviderReadonly(), [])

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        if (program) {
          const data = await fetchActiveCampaigns(program)
          setCampaigns(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [program])

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 pt-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600 mt-4">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6 pt-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h4 className="text-lg text-red-600 mb-2">Error loading campaigns</h4>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (campaigns.length === 0) {
    return (
      <div className="container mx-auto p-6 pt-24">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-800">
            No campaigns available at the moment
          </h2>
          <p className="text-gray-600 mt-4">
            Be the first to create a campaign and make a difference!
          </p>

          <div className="mt-6">
            <Link
              href="/create"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Create a Campaign
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          // Calculate progress percentage
          const progressPercentage = Math.min(
            ((campaign.amountRaised || 0) / (campaign.goal || 1)) * 100,
            100
          )

          return (
            <div
              key={campaign.cid}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Campaign Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Campaign Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
                    <div
                      className="bg-green-600 h-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-green-700 font-semibold">
                      <span>💰</span>
                      <span>
                        {(campaign.amountRaised || 0).toFixed(2)}SOL Raised
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span>👥</span>
                      <span>{campaign.donors || 0}Donors</span>
                    </div>
                  </div>
                </div>

                {/* View Campaign Button */}
                <Link href={`/campaign/${campaign.publicKey}`}>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
                    View Campaign
                  </button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}