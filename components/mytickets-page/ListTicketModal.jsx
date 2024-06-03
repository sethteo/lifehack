import React, { useState } from 'react';
import { IoClose } from "react-icons/io5"; 
import { useGlobalContext } from '@/app/Context/store';

const ListTicketModal = ({ tokenId, contractAddress, onClose }) => {
    const {listTicket, setIsLoading, updateTicketStatus, isTronLinkConnected, decodeHexString, approveNFTContractToMarketplace} = useGlobalContext()
    const [listedTRXPrice, setListedTRXPrice] = useState()


    // Function to stop click propagation
    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    const listTicketForSale = async () => {
        if (!listedTRXPrice) { 
            alert("Please enter a price.");
            return;
        }

        onClose()
        setIsLoading(true)
        if (!isTronLinkConnected()) {
          alert("Please connect your TronLink Wallet before buying ticket insurance")
          setIsLoading(false)
          return
        }
    
        try {
          const {success, error} = await listTicket(contractAddress, tokenId, listedTRXPrice)
    
          if (!success){
            throw new Error(decodeHexString(error.output.contractResult[0]))
          }
          updateTicketStatus(tokenId, {isListed: true})
          alert("Ticket Listed Successfully!")
        } catch (err) {
          alert(`Error during transaction: ${err.message}`);
        } finally {
          setIsLoading(false)
        }
    }

    const handleMarketplaceApproval = async () => {
        setIsLoading(true)
        if (!isTronLinkConnected()) {
          alert("Please connect your TronLink Wallet before buying ticket insurance")
          setIsLoading(false)
          return
        }
    
        try {
          const {success, error} = await approveNFTContractToMarketplace(contractAddress, tokenId)
    
          if (!success){
            throw new Error(decodeHexString(error.output.contractResult[0]))
          }
          alert("Marketplace Approved Successfully!")
        } catch (err) {
          alert(`Error during transaction: ${err.message}`);
        } finally {
          setIsLoading(false)
        }
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20" onClick={onClose}>
      <div className="bg-white p-5 rounded-lg w-1/2 h-1/2 overflow-y-auto flex flex-col" onClick={handleModalClick}>
        <div className='w-full flex justify-end'>
            <button onClick={onClose} className="text-lg self-end">
                <IoClose />
            </button>
        </div>
        
        <div className='flex flex-col w-full justify-center items-center p-2 flex-grow'>
            <div className='text-xl font-bold'>Step 1: Approve The Marketplace For Transactions With Your Ticket</div>
            <button className='bg-yellow-300 hover:bg-yellow-400 text-black font-semibold text-lg w-28 py-1 rounded-md mt-5' onClick={handleMarketplaceApproval}>Approve</button>
            <div className='text-xl font-bold mt-5'>Step 2: Set Your Listing Price</div>
            <input type='number' placeholder='Price in TRX' className="border rounded-md w-3/4 h-10 mt-5" value={listedTRXPrice} onChange={e => setListedTRXPrice(e.target.value)} />
            <button className='bg-yellow-300 hover:bg-yellow-400 text-black font-semibold text-lg w-28 py-1 rounded-md mt-5' onClick={listTicketForSale}>List</button>
        </div>
      </div>
    </div>
  );
};

export default ListTicketModal;