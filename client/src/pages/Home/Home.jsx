import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Home.scss";
import Category from "../../components/Category/Category";
import { CategoryServices } from "../../services/category.service";
const slides = [
  {
    img: "https://laptopaz.vn/media/banner/15_Jul9529d59a1b6e971d114ed85137829529.jpg",
    path: "",
  },
  {
    img: "https://laptopaz.vn/media/banner/25_Apr1fcbb54161d203349c5673bf76123541.jpg",
    path: "",
  },
  {
    img: "https://laptopaz.vn/media/banner/27_Apr9e4cc4b34e7d7b5067654fbb723ae11e.jpg",
    path: "",
  },
];

const videos = [
  {
    img: "https://laptopaz.vn/media/news/120_506_maxresdefault__1_.jpg",
    path: "https://www.youtube.com/embed/wCtdvXmHGI8",
    title:
      "RTX 3050 6GB VRAM mới xứng đáng trở thành Card Đồ Hoạ Quốc dân tiếp theo!!!",
  },
  {
    img: "https://laptopaz.vn/media/news/120_505_maxresdefault.jpg",
    path: "https://www.youtube.com/embed/bdWeN-tdUrk",
    title:
      "Asus Zenbook Q409ZA - Laptop Rẻ Nhất sở hữu màn 2K OLED chỉ 14 triệu",
  },
  {
    img: "https://laptopaz.vn/media/news/120_498_44444.jpg",
    path: "https://www.youtube.com/embed/UHudxPLWopM",
    title: "Đánh giá Lenovo Legion 5 Pro 2023",
  },
];
export const Home = () => {
  const [categories, setCategories] = useState();
  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, err } = await CategoryServices.getAllCategories();
      if (data) {
        setCategories(data.data.categories);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="container">
      <Link to="/invoice/112">TEST</Link>;
      <section className="banner">
        <div className="banner__top">
          <div className="banner__slide">
            {slides && (
              <Swiper className="mySwiper">
                {slides.map((slide, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Link to="/">
                        <img src={slide.img} alt="banner" />
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>
          <div className="banner__imgs">
            <Link to="/">
              <img
                src="https://laptopaz.vn/media/banner/14_Oct2abfc06f2548c018b6afe6bf064f3ab2.jpg"
                alt="banner"
              />
            </Link>
            <Link to="/">
              <img
                src="https://laptopaz.vn/media/banner/13_Oct2d10cdfdfc80145ac11dc99f38a937ba.jpg"
                alt="banner"
              />
            </Link>
          </div>
        </div>
        <div className="banner__bottom">
          <Link to="/">
            <img
              src="https://laptopaz.vn/media/banner/17_Apr640d9f51e5f0b43bf20c1df070f85a8f.jpg"
              alt="banner"
            />
          </Link>
          <Link to="/">
            <img
              src="https://laptopaz.vn/media/banner/17_Apree234d549c2f48d8aba0aa375d9fdef9.jpg"
              alt="banner"
            />
          </Link>
        </div>
      </section>
      {categories &&
        categories.map((category, index) => {
          return (
            <Category
              key={index}
              title={category.name}
              query={{
                ["category"]: category.slug,
              }}
            />
          );
        })}
      <Category
        title={"Top sản phẩm bán chạy"}
        query={{
          order: "sellCount",
        }}
      />
      <section className="video-ads">
        <h3 className="video-ads__title">Video LAPTOP</h3>
        <div className="video-ads__body">
          <div className="video-ads__list">
            {videos &&
              videos.map((video, index) => {
                return (
                  <div className="video-ads__item" key={index}>
                    <img
                      src={video.img}
                      alt={video.title}
                      onClick={() => setCurrentVideo(video)}
                    />
                    <p>{video.title}</p>
                  </div>
                );
              })}
          </div>
          <div className="video-ads__show">
            <iframe
              width={"100%"}
              height={"100%"}
              key={currentVideo.title}
              src={currentVideo.path}
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};
