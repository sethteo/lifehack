"use client"
import eventData from "../../../data/events.json"
import { LuCalendarDays } from "react-icons/lu";
import { LuClock } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import ConcertCard from "@/components/homepage/ConcertCard";
import { IoTicketOutline } from "react-icons/io5";
import { LuPlusCircle } from "react-icons/lu";
import { LuMinusCircle } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/app/Context/store";
import Loading from "@/components/Loading";

const EventPurchase = ({ params }) => {

  const {decodeHexString, isLoading, setIsLoading, mintTicket, isTronLinkConnected, getCatPrices, getMintLimit} = useGlobalContext()


  const [selectedCategory, setSelectedCategory] = useState(1) // actual cat index is different from the selected categoryyyyy
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [eventMintLimit, setEventMintLimit] = useState(null);
  const eventId = params.id
  const event = eventData.find(event => event.eventId === eventId)
  
  useEffect(() => {
    const getMintLimitPerAddress = async () => {
      const mintLimt = await getMintLimit(event.contractAddress)
      setEventMintLimit(mintLimt)
    }
    getMintLimitPerAddress()
  }, []);

  const incrementCat = () => {
    setSelectedCategory(prevCount => prevCount + 1)
  }

  const decrementCat = () => {
    setSelectedCategory(prevCount => prevCount - 1)
  }

  const incrementQuantity = () => {
    setSelectedQuantity(prevCount => prevCount + 1)
  }

  const decrementQuantity = () => {
    setSelectedQuantity(prevCount => prevCount - 1)
  }

  const handlePurchase = async () => {
    setIsLoading(true)
    if (!isTronLinkConnected()) {
      alert("Please connect your TronLink Wallet before purchasing a ticket!")
      setIsLoading(false)
      return
    }

    const selectedCatIndex = selectedCategory - 1

    console.log("current state information: ", selectedCatIndex, selectedQuantity)
    try {
      const ticketPrice = await getCatPrices(selectedCatIndex, event.contractAddress)
      const {success, error} = await mintTicket(selectedCatIndex, selectedQuantity, ticketPrice, event.contractAddress)

      if (!success){
        throw new Error(decodeHexString(error.output.contractResult[0]))
      }

      alert("Minting of NFT ticket successful!")
    } catch (err) {
      alert(`Error during transaction: ${err.message}`);
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="h-full w-full flex flex-col items-center justify-start py-10 bg-gray-200">
      {isLoading && <Loading/>}
      <div className="max-w-1/2 flex flex-col items-center justify-center bg-white rounded-md p-7 shadow-lg">
        <img src={event.eventImg} className="h-[400px] w-[800px] rounded-md"/>
        <div className="flex flex-col justify-start items-stretch w-[800px]">
          <div className="font-extrabold text-3xl my-5">
            {event.eventTitle}
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-3/4">
              <div className="text-xl font-semibold my-1">
                Date and Time
              </div>
              <div className="flex justify-start items-center my-0.5">
                <LuCalendarDays className="mr-3"/> {event.date}
              </div>
              <div className="flex justify-start items-center my-0.5">
                <LuClock className="mr-3"/> {event.time}
              </div>
              <div className="my-0.5 text-blue-500">
                + Add to Calendar
              </div>
              <div className="w-full">
                <div className="mt-4 mb-1 font-semibold text-xl">
                  Location
                </div>
                <div className="my-0.5 flex flex-row items-center">
                  <IoLocationOutline className="mr-3"/> 
                  <div className="w-3/4">
                    {event.location}
                  </div>
                </div>
                <img src="/images/stadium-google-map.png" className="h-50 w-96 my-2 rounded-md"/>
              </div>
              
            </div>
            <div className="w-1/4">
              <div className="flex flex-col">
                <div className="mb-1 font-semibold text-xl">
                  Ticket Information
                </div>
                {event.catPricing.map((price, index) => 
                  <div className="text-sm" key={index}>Cat {index + 1}: <span className="font-semibold">{price} TRX</span></div>
                )}
                <div className="text-sm">Mint Limit: <span className="font-semibold">{eventMintLimit} Ticket(s)</span></div>
              </div>
              <div className="flex flex-col items-start mt-2">
                <div className="font-medium text-lg">Select your Category</div>
                <div className="flex flex-row justify-evenly items-center w-3/4">
                <button onClick={decrementCat} disabled={selectedCategory <= 1}><LuMinusCircle className={`${selectedCategory <= 1 && "text-gray-400"}`}/></button>
                  {selectedCategory}
                  <button onClick={incrementCat} disabled={selectedCategory >= 4}><LuPlusCircle className={`${selectedCategory >= 4 && "text-gray-400"}`}/></button>
                </div>
              </div>
              <div className="flex flex-col items-start mt-2">
                <div className="font-medium text-lg">Select your Quantity</div>
                <div className="flex flex-row justify-evenly items-center w-3/4">
                  <button onClick={decrementQuantity} disabled={selectedQuantity <= 1}><LuMinusCircle className={`${selectedQuantity <= 1 && "text-gray-400"}`}/></button>
                  {selectedQuantity}
                  <button onClick={incrementQuantity} disabled={selectedQuantity >= eventMintLimit}><LuPlusCircle className={`${selectedQuantity >= eventMintLimit && "text-gray-400"}`}/></button>
                </div>
              </div>
              <div className="w-3/4 flex justify-center mt-3">
                <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold flex items-center justify-center
                  group transition duration-300 ease-in-out transform hover:scale-105 hover:z-10
                  hover:bg-yellow-300" onClick={handlePurchase}>
                    <IoTicketOutline className="mr-2" size={20}/>Buy Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[800px]">
          <div className="mt-4 mb-1 font-semibold text-xl">
            Event Description
          </div>
          <div className="my-0.5 items-center w-full text-sm">
            {event.description.map((paragraph) => <p key={event.eventId}>{paragraph}</p>)}
          </div>
          <br/>
          <div className="mt-4 mb-1 font-semibold text-xl">
            Other events you may like
          </div>
          <div className="my-0.5 items-center w-full flex flex-row justify-evenly">
            <ConcertCard
              eventId="2"
              img="/images/coldplay-concert.jpg"
              title="Coldplay Music of the Spheres"
              month="JUN"
              days="23-31"
              location="Singapore National Stadium"
              time="8:00PM - 10:00PM"
            />
            <ConcertCard
              eventId="3"
              img="/images/1975-concert.jpg"
              title="1975 Concert"
              month="AUG"
              days="22"
              location="Sands Expo and Convention Centre"
              time="8:00PM - 10:00PM"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPurchase;