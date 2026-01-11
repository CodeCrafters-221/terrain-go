import React from 'react'

export default function Cta () {
  return (
    <div className='w-full max-w-200 bg-[#342618]/80 backdrop-blur-md border border-[#684d31] p-2 rounded-full shadow-2xl mt-6'>
        <form className='flex flex-col md:flex-row w-full gap-2 p-2'>
          <div className='flex flex-1 items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#684d31]'>
          <span class="material-symbols-outlined text-[#cbad90] mr-3">explore_nearby</span>
            <input type="text" placeholder='Quel quartier ? (ex: Mermoz)' className='w-full bg-transparent border-none text-white placeholder-[#cbad90] focus:ring-0 p-0 text-base'/>
          </div>
           
            <div className='flex w-full md:w-1/4 items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#684d31]'>
      <span class='material-symbols-outlined text-[#cbad90] mr-3'>calendar_month</span>
            <input type="text" placeholder='Date' className='w-full bg-transparent border-none text-white placeholder-[#cbad90] p-0 text-base'/>
            </div>
          <div>
     <button className="bg-primary rounded-full font-montserrat font-semibold text-text text-sm px-4 py-2">
          Rechercher
        </button>
          </div>
            
        </form>
        <div>
          <h2></h2>
          <h2></h2>
        </div>
    </div>
  )
}
