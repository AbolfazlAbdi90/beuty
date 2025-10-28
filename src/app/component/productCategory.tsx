import DataProductCategoru from "../ProductCategory/dataProductCategoru";

export default function ProductCategoryBox() {
  return (
    <div className="w-[342px] h-[1104px] md:w-full mx-auto md:h-[497px] mt-[-90px] md:mt-[-140px] rounded-t-4xl bg-[#30303D] rounded-3xl overflow-hidden flex flex-col items-center ">
  <div className="flex items-center justify-between w-full px-4 mt-16  ">
    <img className="md:mr-[560px]" src="/image/image-in-main/logo-inside-container/Vector 7.png" alt="" />
    <h1 className="text-white font-bold text-2xl text-center">دسته بندی محصولات</h1>
    <img className="md:ml-[560px]" src="/image/image-in-main/logo-inside-container/Vector 8.png" alt="" />
  </div>
  <DataProductCategoru />
  <img src="/image/image-in-main/Frame 1261157103.png" className="md:mt-8" alt="" />
</div>

  );
}
