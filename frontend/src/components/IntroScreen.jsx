import { useEffect } from "react";

export default function IntroScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        autoPlay
        muted
        playsInline
        className="h-full w-full object-contain bg-black"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </div>
  );
}