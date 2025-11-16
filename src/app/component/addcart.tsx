"use client"
import { useState } from "react"
import { UseCartContext } from "../Context/CartContext"

interface Iprops {
  id:string
}
export default function Cart({id}:Iprops) {
  const {cartItems,handleIncrease,HandleCount,handleDecrease} = UseCartContext()
  console.log(cartItems)
  return (
    <div className="flex gap-4 " >
        <button onClick={()=>handleIncrease(parseInt(id))} className=' cursor-pointer text-2xl px-6 py-1 bg-blue-500 text-white h-[56px] rounded-2xl ' >
           +
        </button>
        <h1 className="mt-4" >{HandleCount(parseInt(id))}</h1>
        <button onClick={()=>handleDecrease(parseInt(id))} className='cursor-pointer text-2xl px-6 py-1 bg-red-500 text-white h-[56px] rounded-2xl ' >
           -
        </button>
    </div>

  )
}
