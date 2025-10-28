// app/products/page.tsx
import Container from "../component/container";
import ProductList from "./ProductList";

export const metadata = {
  title: "لیست محصولات | Beautyland",
  description: "خرید بهترین محصولات مراقبت پوست و آرایش از بیوتی‌لند",
};

export default function ProductsPage() {
  return(
   <Container>
    <ProductList />;
   </Container>
  ) 
  
  
}
