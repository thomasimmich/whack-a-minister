// import { useEffect, useState } from "react";

// const OrientationLock = () => {
//   const [isPortrait, setIsPortrait] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkOrientation = () => {
//       const isMobileDevice = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//       const isPortraitMode = window.innerHeight > window.innerWidth;
      
//       setIsMobile(isMobileDevice);
//       setIsPortrait(isPortraitMode && isMobileDevice);
//     };

//     checkOrientation();
//     window.addEventListener("resize", checkOrientation);
//     window.addEventListener("orientationchange", checkOrientation);

//     return () => {
//       window.removeEventListener("resize", checkOrientation);
//       window.removeEventListener("orientationchange", checkOrientation);
//     };
//   }, []);

//   if (!isMobile || !isPortrait) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
//       <div className="text-center p-8 max-w-md">
//         <div className="text-6xl mb-8 rotate-90-once">📱</div>
//         <h2 className="text-3xl font-bold text-white mb-4">Please Rotate Your Device</h2>
//         <p className="text-xl text-white/80">
//           This game is best played in landscape mode. Please rotate your device to continue.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default OrientationLock;

