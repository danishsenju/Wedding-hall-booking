"use client";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useId, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NoiseBackground } from "@/components/ui/noise-background";

const THEME_GRADIENT = [
  "rgb(255, 100, 150)",
  "rgb(100, 150, 255)",
  "rgb(255, 200, 100)",
];

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
  onSlideSelect?: (index: number) => void;
}

const Slide = ({
  slide,
  index,
  current,
  handleSlideClick,
  onSlideSelect,
}: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      slideRef.current.style.setProperty("--x", `${xRef.current}px`);
      slideRef.current.style.setProperty("--y", `${yRef.current}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSlideSelect?.(index);
  };

  const { src, button, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center opacity-100 transition-all duration-300 ease-in-out w-[min(70vmin,520px)] h-[min(70vmin,520px)] mx-[4vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
          color: "var(--text)",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            background: "var(--surface-1)",
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover transition-opacity duration-600 ease-in-out"
            style={{ opacity: current === index ? 1 : 0.5 }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                background:
                  "linear-gradient(0deg, rgba(6,20,27,0.75) 0%, rgba(6,20,27,0.15) 60%, transparent 100%)",
              }}
            />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <h2
            className="text-lg md:text-2xl lg:text-4xl font-light relative"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {title}
          </h2>
          <div className="flex justify-center mt-6">
            <NoiseBackground
              containerClassName="!rounded-full p-2 w-fit"
              gradientColors={THEME_GRADIENT}
              speed={0.08}
            >
              <button
                onClick={handleButtonClick}
                className="h-full w-full cursor-pointer rounded-full bg-gradient-to-r from-black via-black to-neutral-900 px-4 py-2 text-xs font-medium tracking-[0.18em] uppercase text-white transition-all duration-100 active:scale-[0.98]"
                style={{
                  fontFamily: "var(--font-body)",
                  boxShadow:
                    "0px 1px 0px 0px rgba(10,10,10,0.8) inset, 0px 1px 0px 0px rgba(38,38,38,0.8)",
                }}
              >
                {button}
              </button>
            </NoiseBackground>
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none ${
        type === "previous" ? "rotate-180" : ""
      }`}
      style={{
        border: "1px solid var(--border-hover)",
        color: "var(--text-muted)",
      }}
      title={title}
      onClick={handleClick}
    >
      <ArrowRight size={16} strokeWidth={1.5} />
    </button>
  );
};

interface SlideColor {
  primary: string;
  secondary: string;
}

interface CarouselProps {
  slides: SlideData[];
  slideColors?: SlideColor[];
  onSlideSelect?: (index: number) => void;
}

export default function Carousel({ slides, slideColors, onSlideSelect }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className="relative w-[min(70vmin,520px)] h-[min(70vmin,520px)] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      {/* Ambient color glow — fades between slide palette colors */}
      <AnimatePresence mode="sync">
        {slideColors && slideColors[current] && (
          <motion.div
            key={current}
            className="absolute pointer-events-none"
            style={{
              inset: "-60%",
              background: `radial-gradient(ellipse 40% 40% at 50% 50%, ${slideColors[current].primary} 0%, ${slideColors[current].secondary} 40%, transparent 65%)`,
              filter: "blur(72px)",
              zIndex: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
            onSlideSelect={onSlideSelect}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1.5rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
