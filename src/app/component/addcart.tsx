"use client"
import { useState } from "react"


export default function Cart() {
  const [item,setItem] = useState(0)
  const handelIncrease = ()=>{
    return setItem(item+1)
  }
  const handelDecrease = ()=>{
    return setItem(item-1)
  }
  return (
    <div className="flex gap-4 " >
        <button onClick={handelIncrease} className=' cursor-pointer text-2xl px-6 py-1 bg-blue-500 text-white h-[56px] rounded-2xl ' >
           +
        </button>
        <h1 className="mt-4" >{item}</h1>
        <button onClick={handelDecrease} className='cursor-pointer text-2xl px-6 py-1 bg-red-500 text-white h-[56px] rounded-2xl ' >
           -
        </button>
    </div>

  )
}
