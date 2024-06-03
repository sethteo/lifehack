"use client"
import React from 'react'
import { useGlobalContext } from './Context/store'
import Nav from '@/components/Nav'
import HomeHero from '@/components/homepage/HomeHero'
import CategoryFeed from '@/components/homepage/CategoryFeed'
import ConcertFeed from '@/components/homepage/ConcertFeed'

const Home = () => {
  const {testContextValue} = useGlobalContext()
  return (
    <section className="w-full flex-center flex-col h-full">
      <HomeHero/>
      <CategoryFeed/>
      <ConcertFeed/>
    </section>
  )
}

export default Home