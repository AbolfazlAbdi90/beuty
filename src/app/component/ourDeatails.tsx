import React from 'react'
import Container from './container'

export default function OurDeatails() {
    const OurDEtails = [
        {img:"/image/image-in-main/ourDeatils/wallet-check.png",title:"پرداخت امن با درگاه امن",discreption:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله است"},
        {img:"/image/image-in-main/ourDeatils/grammerly.png",title:"رضایت بیش از ۱ میلیون مشتری",discreption:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله است"},
        {img:"/image/image-in-main/ourDeatils/24-support.png",title:"پشتیبانی ۲۴ ساعته",discreption:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله است"},
    ]
  return (
   <Container>
    <div className='grid grid-cols-1 md:grid-cols-3 p-4 gap-6  ' >
        
            {OurDEtails.map((item,index)=>(
                <div className='shadow-2xl p-4 rounded-2xl ' key={index} >
                    <img src={item.img} alt="wallet" />
                    <h1 className='mt-2 font-bold text-2xl'>{item.title}</h1>
                    <p className='mt-2' >{item.discreption}</p>
                </div>
            ))}
        
    </div>
   </Container>
  )
}
