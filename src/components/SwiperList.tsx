/* eslint-disable jsx-a11y/media-has-caption */
import { isPlainObject, map } from "lodash";
import { Swiper, SwiperSlide } from "swiper/react";
import Navigation from "swiper";

const SwiperList = ({
  items,
  components,
  css = "!w-full",
  slidesPerView = 4,
  slidesPerGroup = 4,
  spaceBetween = 4,
  rows = 1,
  loop = false,
  useEmpty,
  autoplay = false,
  centeredSlides = false,
  freeMode = true,
  slideCss = "aspect-square !h-auto",
  breakpoints,
}: any) => (
  <Swiper
    navigation
    observer
    observeParents
    modules={[Navigation]}
    className={css}
    slidesPerView={
      isPlainObject(slidesPerView) ? slidesPerView.lg : slidesPerView
    }
    autoplay={autoplay}
    centeredSlides={centeredSlides}
    loop={loop}
    freeMode={freeMode}
    grid={{ rows, fill: "row" }}
    slidesPerGroup={slidesPerGroup}
    direction="horizontal"
    spaceBetween={spaceBetween}
    breakpoints={
      breakpoints || {
        320: {
          grid: { rows: 1 },
          slidesPerView: isPlainObject(slidesPerView)
            ? slidesPerView.sm
            : "auto",
          slidesPerGroup: isPlainObject(slidesPerGroup) ? slidesPerGroup.sm : 1,
        },
        640: {
          slidesPerView: isPlainObject(slidesPerView)
            ? slidesPerView.md
            : slidesPerView / 2,
          grid: { rows, fill: "row" },
          slidesPerGroup: isPlainObject(slidesPerGroup) ? slidesPerGroup.md : 1,
        },
        900: {
          slidesPerView: isPlainObject(slidesPerView)
            ? slidesPerView.lg
            : slidesPerView,
          grid: { rows, fill: "row" },
          slidesPerGroup: isPlainObject(slidesPerGroup)
            ? slidesPerGroup.lg
            : slidesPerGroup,
        },
      }
    }
  >
    {map(items, (item, idx) => (
      <SwiperSlide className={slideCss} key={idx}>
        {item && components(item, idx)}
      </SwiperSlide>
    ))}
    {useEmpty && map(Array(useEmpty), (v) => <SwiperSlide>&nbsp;</SwiperSlide>)}
  </Swiper>
);

export default SwiperList;
