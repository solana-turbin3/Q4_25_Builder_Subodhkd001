import React, { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaDollarSign, FaDonate, FaEdit, FaTrashAlt } from 'react-icons/fa'
import { Campaign } from '@/utils/interfaces'
import { toast } from 'react-toastify'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  donateToCampaign,
  fetchAllDonations,
  fetchCampaignDetails,
  getProvider,
} from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { useDispatch } from 'react-redux'
import { mintDonationNft } from '@/services/metaplex'

const CampaignDonate: React.FC<{ campaign: Campaign; pda: string }> = ({
  campaign,
  pda,
}) => {
  const { publicKey, sendTransaction, signTransaction, wallet } = useWallet()
  const [amount, setAmount] = useState('')
  const { setWithdrawModal, setDelModal } = globalActions
  const dispatch = useDispatch()

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (Number(amount) + campaign.amountRaised > campaign.goal) {
      return toast.warn('Amount exceeds campaign goal')
    }

    if (!publicKey) return toast.warn('Please connect wallet')

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const tx: any = await donateToCampaign(
            program!,
            publicKey!,
            pda!,
            Number(amount)
          )

          setAmount('')
          await fetchCampaignDetails(program!, pda)
          await fetchAllDonations(program!, pda)

          // Mint NFT as donation receipt
          if (wallet && program) {
            try {
              const { connection } = (program.provider as any)
              const { mintAddress } = await mintDonationNft({
                connection,
                walletAdapter: wallet.adapter,
                donor: publicKey!,
                campaignId: campaign.cid,
                amountLamports: BigInt(Math.round(Number(amount) * 1_000_000_000)),
              })
              toast.success(
                (
                  <span>
                    NFT minted: <code>{mintAddress}</code>
                  </span>
                ),
                { autoClose: 8000 }
              )
            } catch (e) {
              console.error('NFT mint failed:', e)
              toast.warn('Donation succeeded but NFT mint failed')
            }
          }

          console.log(tx)
          resolve(tx)
        } catch (error) {
          reject(error)
        }
      }),
      {
        pending: 'Approve transaction...',
        success: 'Transaction successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const isCreator = publicKey && campaign.creator === publicKey.toBase58()

  return (
    <div>
      {!isCreator && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaDonate className="text-green-600" />
            Donate
          </h2>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="donationAmount"
              className="block text-gray-700 font-semibold mb-2"
            >
              Amount (SOL)
            </label>
            <input
              type="text"
              name="donationAmount"
              placeholder={`1 SOL (${(
                campaign.goal - campaign.amountRaised
              ).toFixed(2)} SOL remaining)`}
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setAmount(value)
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              min="1"
              required
            />
            <button
              type="submit"
              disabled={
                !amount ||
                !campaign.active ||
                campaign.amountRaised >= campaign.goal
              }
              className={`mt-4 w-full bg-green-600 hover:bg-green-700 ${!amount ||
                !campaign.active ||
                campaign.amountRaised >= campaign.goal
                ? 'opacity-50 cursor-not-allowed'
                : ''
                } text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2`}
            >
              <FaDonate />
              Donate Now
            </button>
          </form>
        </div>
      )}

      {publicKey && isCreator && (
        <div className="mt-6 flex flex-wrap gap-2 md:flex-nowrap md:gap-0">
          <Link
            href={`/campaign/edit/${pda}`}
            className="bg-transparent hover:bg-green-600 text-green-600 hover:text-white
              font-semibold py-2 px-4 flex-1 md:rounded-l-lg flex items-center justify-center
              border border-green-600 hover:border-transparent"
          >
            <FaEdit />
            Edit
          </Link>
          {campaign.active && (
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white
              font-semibold py-2 px-4 flex-1 flex items-center justify-center"
              onClick={() => dispatch(setDelModal('scale-100'))}
            >
              <FaTrashAlt />
              Delete
            </button>
          )}

          <button
            className="bg-transparent hover:bg-green-600 text-green-600 hover:text-white
              font-semibold py-2 px-4 flex-1 md:rounded-r-lg flex items-center justify-center
              border border-green-600 hover:border-transparent"
            onClick={() => dispatch(setWithdrawModal('scale-100'))}
          >
            <FaDollarSign />
            Withdraw
          </button>
        </div>
      )}
    </div>
  )
}

export default CampaignDonate
