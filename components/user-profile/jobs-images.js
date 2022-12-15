import Image from "next/image";

import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function JobsImages(props) {
  const { images, alt } = props;
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      navigation={true}
      pagination={{ clickable: true }}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image src={image} width={400} height={250} alt={alt} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default JobsImages;
