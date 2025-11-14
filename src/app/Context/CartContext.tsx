"use client"
import { createContext, useState } from "react";

interface CartContextProviderProps{
    children:React.ReactNode
}
interface CartItems {
    id:number;
    qty:number
}

const CartContext = createContext({})

 export function CartContextProvider ({children}:CartContextProviderProps) {
    const [cartItems,setCartItems] = useState<CartItems[]>([])
    return(
        <CartContext.Provider value={{cartItems}} >
        {children}
    </CartContext.Provider>
    )
}