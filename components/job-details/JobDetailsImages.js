import React, { useState, Fragment } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FreeMode, Navigation, Thumbs } from "swiper";

function JobDetailsImages(props) {
  const { images, alt } = props;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <Fragment>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        // thumbs={{ swiper: thumbsSwiper }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="jobSliderBig"
      >
        {images && images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image src={image.stringValue} width={750} height={450} alt={alt} />  {/**   image  image.stringValue */}
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={false}
        spaceBetween={5}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="jobSliderThumbnails"
      >
      {images && images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image src={image.stringValue} width={150} height={100} alt={alt} />
        </SwiperSlide>
      ))}
      </Swiper>
    </Fragment>
  );
}

export default JobDetailsImages;
