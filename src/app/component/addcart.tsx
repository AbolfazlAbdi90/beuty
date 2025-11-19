"use client"
import { useState } from "react"
import { UseCartContext } from "../Context/CartContext"

interface Iprops {
  id:string
}
export default function Cart({id}:Iprops) {
  const {cartItems,handleIncrease,HandleCount,handleDecrease,handleRemove} = UseCartContext()
  console.log(cartItems)
  return (
    <div>
    <div className="flex gap-4 " >
        <button onClick={()=>handleIncrease(parseInt(id))} className=' cursor-pointer text-2xl px-6 py-1 bg-blue-500 text-white h-[56px] rounded-2xl ' >
           +
        </button>
        <h1 className="mt-4 font-bold text-2xl " >{HandleCount(parseInt(id))}</h1>
        <button onClick={()=>handleDecrease(parseInt(id))} className='cursor-pointer text-2xl px-6 py-1 bg-red-500 text-white h-[56px] rounded-2xl ' >
           -
        </button>
        
    </div>
    <button onClick={()=>handleRemove(parseInt(id))} className="bg-pink-700 px-7 py-2 cursor-pointer rounded-2xl text-white mt-3 mr-2.5 md:mr-6 " >حذف از سبد </button>
</div>
  )
}
