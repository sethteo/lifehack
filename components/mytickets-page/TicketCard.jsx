"use client"

import React, { useState } from 'react'
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegThumbsDown } from "react-icons/fa";
import { useGlobalContext } from '@/app/Context/store';
import Loading from '../Loading';
import ListTicketModal from './ListTicketModal';

const TicketCard = ({contractAddress, eventId, title, date, time, location, tokenId, isRedeemed, isInsured, catClass, imageURL, isCancelled, originalTicketPrice, isListed}) => {
    const {isLoading, setIsLoading, buyInsurance, isTronLinkConnected, redeemTicket, decodeHexString, setMyTickets, updateTicketStatus} = useGlobalContext()
    const [isPopupOpen, setIsPopupOpen] = useState(false); 


    const handleBuyInsurance = async () => {
        setIsLoading(true)
        if (!isTronLinkConnected()) {
          alert("Please connect your TronLink Wallet before buying ticket insurance")
          setIsLoading(false)
          return
        }
    
        try {
          const {success, error} = await buyInsurance(contractAddress, tokenId, originalTicketPrice)
    
          if (!success){
            throw new Error(decodeHexString(error.output.contractResult[0]))
          }
          updateTicketStatus(tokenId, {isInsured: true})
          alert("Purchase of ticket insurance successful!")
        } catch (err) {
          alert(`Error during transaction: ${err.message}`);
        } finally {
          setIsLoading(false)
        }
    }

    const handleRedeemTicket = async () => {
        setIsLoading(true)
        if (!isTronLinkConnected()) {
          alert("Please connect your TronLink Wallet before buying ticket insurance")
          setIsLoading(false)
          return
        }
    
        try {
          const {success, error} = await redeemTicket(contractAddress, tokenId)
    
          if (!success){
            throw new Error(decodeHexString(error.output.contractResult[0]))
          }
          updateTicketStatus(tokenId, {isRedeemed: true})
          alert("Ticket Redeemed Successfully!")
        } catch (err) {
          alert(`Error during transaction: ${err.message}`);
        } finally {
          setIsLoading(false)
        }
    }

    const handleCloseModal = () => {   
      setIsPopupOpen(false)
    }

  return (
    <div className='border-b-2 border-black mx-8 my-2 py-2 flex flex-row w-full'>
      {isPopupOpen && 
        <ListTicketModal 
          tokenId={tokenId}
          contractAddress={contractAddress}
          onClose={handleCloseModal} 
        />
      }
        <div>
            <img src={imageURL} className='w-40 h-40 rounded-md bg-blue-400' alt='NFT_Image'/>
        </div>
        <div className='mx-4 flex flex-col max-h-40 w-3/4 justify-center'>
            <div className='flex'>
                <span className='text-xl font-bold mr-3'>{title}</span>
                {isCancelled ? (
                    <span className='flex items-center text-red-500'>
                        <FaRegThumbsDown className='mr-1'/>
                        Event Cancelled
                    </span>
                ) : (
                    <span className='flex items-center text-green-500'>
                        <FaRegThumbsUp className='mr-1'/>
                        Event Active
                    </span>
                )}
            </div>
            <div>{date}</div>
            <div>{time}</div>
            <div>{location}</div>
            <div>Cat {catClass} Ticket</div>
            <div>Token ID: {tokenId}</div>
        </div>
        <div className=' flex flex-col justify-evenly items-center'>
            <button disabled={isInsured} className={`${isInsured ? "text-yellow-300 bg-gray-700 cursor-default" :"bg-yellow-300 hover:bg-yellow-400 text-black" } font-semibold text-lg w-28 py-1 rounded-md`} onClick={handleBuyInsurance}>
                {isInsured ? "Insured!": "Insure"}
            </button>
            <button disabled={isRedeemed} className={`${isRedeemed ? "text-yellow-300 bg-gray-700 cursor-default" :"bg-yellow-300 hover:bg-yellow-400 text-black" } font-semibold text-lg w-28 py-1 rounded-md`} onClick={handleRedeemTicket}>
                {isRedeemed ? "Redeemed!": "Redeem"}
            </button>
            <button disabled={isListed} className={`${isListed ? "text-yellow-300 bg-gray-700 cursor-default" :"bg-yellow-300 hover:bg-yellow-400 text-black" } font-semibold text-lg w-28 py-1 rounded-md`} onClick={() => setIsPopupOpen(true)}>
                {isListed ? "Listed!": "List"}  
            </button>
        </div>
    </div>
  )
}

export default TicketCard