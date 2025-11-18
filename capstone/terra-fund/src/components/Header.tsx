'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaUserCircle, FaPlusCircle, FaBars, FaTimes, FaHome, FaCompass, FaHandHoldingHeart } from 'react-icons/fa'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { getProvider } from '@/services/blockchain'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  const { publicKey, sendTransaction, signTransaction } = useWallet()

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/campaign', label: 'Campaigns', icon: FaCompass },
  ]

  const authLinks = [
    { href: '/account', label: 'My Account', icon: FaUserCircle },
    { href: '/create', label: 'Create Campaign', icon: FaPlusCircle },
  ]

  return (
    <header className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-gray-800">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-2 rounded-lg shadow-lg group-hover:shadow-emerald-500/50 transition-all">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              TerraFund
            </span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-emerald-400'
                  }`}
                >
                  <Icon className="text-lg" />
                  {link.label}
                </Link>
              )
            })}

            {program && publicKey && authLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-emerald-400'
                  }`}
                >
                  <Icon className="text-lg" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Wallet Button (Desktop) */}
          {isMounted && (
            <div className="hidden md:block">
              <WalletMultiButton
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                  fontSize: '0.875rem',
                  padding: '0.625rem 1.25rem',
                  border: 'none',
                  transition: 'all 0.2s',
                  height: '42px'
                }}
                className="hover:shadow-emerald-500/50 hover:shadow-2xl hover:scale-105 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-200"
              />
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 text-2xl focus:outline-none hover:text-emerald-400 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-emerald-400'
                  }`}
                >
                  <Icon className="text-xl" />
                  {link.label}
                </Link>
              )
            })}

            {program && publicKey && (
              <>
                <div className="border-t border-gray-800 my-2"></div>
                {authLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive(link.href)
                          ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-emerald-400'
                      }`}
                    >
                      <Icon className="text-xl" />
                      {link.label}
                    </Link>
                  )
                })}
              </>
            )}

            {isMounted && (
              <div className="pt-4">
                <WalletMultiButton
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                    padding: '0.75rem 1.25rem',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  className="focus:ring-2 focus:ring-emerald-500 focus:outline-none hover:shadow-emerald-500/50 hover:shadow-2xl"
                />
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}