"use client";
import { easeIn } from "framer-motion";
import { createContext, useContext, useState } from "react";

interface CartContextProviderProps {
  children: React.ReactNode;
}
interface CartItems {
  id: number;
  qty: number;
}
interface IUseCartContext {
  cartItems: CartItems[];
  handleIncrease: (id: number) => void;
  HandleCount: (id: number) => number;
  handleTotalyQty: number;
  handleDecrease: (id: number) => void;
}
const CartContext = createContext({} as IUseCartContext);

export const UseCartContext = () => {
  return useContext(CartContext);
};

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const HandleCount = (id: number) => {
    return cartItems.find((item) => item.id == id)?.qty || 0;
  };
  const handleTotalyQty = cartItems.reduce((totaly, item) => {
    return totaly + item.qty;
  }, 0);
  const handleIncrease = (id: number) => {
    setCartItems((cartItems) => {
      let IsNotExist = cartItems.find((item) => item.id == id) == null;
      if (IsNotExist) {
        return [...cartItems, { id: id, qty: 1 }];
      } else {
        return cartItems.map((item) => {
          if (item.id == id) {
            return {
              ...item,
              qty: item.qty + 1,
            };
          } else {
            return item;
          }
        });
      }
    });
  };
  const handleDecrease = (id: number) => {
    setCartItems((cartItems) => {
      let isLastOne = cartItems.find((item) => item.id == id)?.qty == 1;
      if (isLastOne) {
        return cartItems.filter((item) => item.id != id);
      }
      return cartItems.map((item) => {
        if (item.id == id) {
          return {
            ...item,
            qty: item.qty - 1,
          };
        } else {
          return item;
        }
      });
    });
  };
  return (
    <CartContext.Provider
      value={{ cartItems, handleIncrease, HandleCount, handleTotalyQty,handleDecrease }}
    >
      {children}
    </CartContext.Provider>
  );
}
