/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { map } from "lodash";
import { isMobile } from "react-device-detect";
import Pagination from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

const PreviewSlide = ({ slide, idx }: any) => {
  const swiper = useSwiper();
  const handleClick = () => {
    swiper?.slideNext();
  };
  return (
    <div
      className="absolute w-[360px] h-[202.5px] !min-w-[360px] !min-h-[202.5px] bottom-[240px] right-6 shadow-2xl rounded-3xl clickable"
      onClick={() => handleClick()}
    >
      {slide.type === "video" ? (
        <video
          className="w-[360px] h-[202.5px] !min-w-[360px] !min-h-[202.5px] shadow-2xl rounded-3xl"
          autoPlay
          muted
          loop
          id={`preview-slide-${idx}`}
          playsInline
        >
          <source
            src={isMobile ? slide.mobileSrc || slide.src : slide.src}
            type="video/mp4"
          />
        </video>
      ) : (
        <img
          className="w-[360px] h-[202.5px] object-cover shadow-2xl rounded-3xl"
          src={slide.src}
          alt={`preview-slide-${idx}`}
        />
      )}
    </div>
  );
};

const VideoSlidesBackground = ({ slides, delay = 27000 }: any) => (
  <div className="absolute">
    <Swiper
      className="w-full h-full"
      autoplay={{ delay }}
      loop
      direction={isMobile ? "horizontal" : "vertical"}
      modules={[Pagination]}
      pagination={
        slides &&
        slides?.length > 1 && {
          clickable: true,
          renderBullet: (index, className) => {
            const title = slides[index].title;
            return `<div class=${className}>${title}<div ></div></div>`;
          },
        }
      }
    >
      {slides &&
        slides.length > 0 &&
        map(slides, (slide, idx: number) => (
          <SwiperSlide>
            <div className="absolute w-full h-full overlay">&nbsp;</div>
            {slide.type === "video" ? (
              <video autoPlay muted loop id={`main-slide-${idx}`} playsInline>
                <source
                  src={isMobile ? slide.mobileSrc || slide.src : slide.src}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                className="w-full h-full object-cover"
                src={slide.src}
                alt={`main-slide-${idx}`}
              />
            )}
            {!isMobile && idx + 1 < slides.length && (
              <PreviewSlide slide={slides[idx + 1]} idx={idx + 1} />
            )}
            {!isMobile && idx + 1 === slides.length && slides.length > 1 && (
              <PreviewSlide slide={slides[0]} idx={0} />
            )}
          </SwiperSlide>
        ))}
    </Swiper>
  </div>
);

export default VideoSlidesBackground;
