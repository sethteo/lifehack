"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { useGlobalContext } from '../Context/store'
import TicketCard from '@/components/mytickets-page/TicketCard'
import Loading from '@/components/Loading'
import ListTicketModal from '@/components/mytickets-page/ListTicketModal'

const MyTickets = () => {

  const {account, getAllOwnedTokens, myTickets, isLoading, } = useGlobalContext()
  const [selectedFilter, setSelectedFilter] = useState("Purchased")

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const filteredTickets = myTickets.filter(ticket => {
    switch(selectedFilter) {
      case 'Purchased':
        return true;
      case 'Listed':
        return ticket.isListed; // Update when listed is implemented
      case 'Redeemed':
        return ticket.isRedeemed;
      case 'Insured':
        return ticket.isInsured;
      default:
        return true;
    }
  });

  useEffect(() => {
    const fetchTickets = async () => {
      if (account) { 
        try {
          await getAllOwnedTokens(account);
        } catch (error) {
          console.error("Failed to fetch tickets:", error);
        }
      }
    };
    fetchTickets()
  }, [account])

  useEffect(() => {
    console.log(myTickets)
  }, [myTickets])

  return (
    <section className="w-full flex flex-col items-center">
      {isLoading && <Loading/>}
      <div className=' flex self-start mt-8 px-12'>
        <div className='flex flex-col items-center'>
          <h2 className="text-3xl font-bold">MY TICKETS</h2>
          <div className="w-36 border-b-2 border-black mt-2"></div>
        </div>
      </div>
      <div className='self-end mx-12 mt-1'>
        <select name="location" id="location" className="outline-none rounded-md py-2 px-4 bg-gray-800 text-white font-semibold" onChange={handleFilterChange}>
          <option>Purchased</option>
          <option>Listed</option>
          <option>Redeemed</option>
          <option>Insured</option>
        </select>
      </div>
      <div className='w-3/4 mb-10'>
        {!account && "Please connect your TronLink Wallet to see your NFTickets"}
        <br/>
        <div className='w-full flex justify-center'>
          {filteredTickets.length === 0 && "No tickets to display :("}
        </div>
        {filteredTickets.map(ticket => 
          <TicketCard
            contractAddress= {ticket.contractAddress}
            eventId={ticket.eventId}
            title={ticket.eventTitle}
            date={ticket.date}
            time={ticket.time}
            location={ticket.location}
            tokenId={ticket.tokenId}
            isRedeemed={ticket.isRedeemed}
            isInsured={ticket.isInsured}
            catClass={ticket.catClass}
            imageURL={ticket.imageURL}
            isCancelled={ticket.isCancelled}
            originalTicketPrice = {ticket.originalTicketPrice}
            isListed = {ticket.isListed}
          />
        )}
      </div>
    </section>
  )
}

export default MyTickets