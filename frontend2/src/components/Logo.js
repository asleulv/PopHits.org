import Link from "next/link";
import { Star } from "lucide-react";
import { Playball } from "next/font/google";

const playball = Playball({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function Logo({ showLink = true, className = "" }) {
  const logoContent = (
    <div className={` ${className}`}>
      {/* Main logo on one line */}
      <div className="flex items-center gap-1">
        <div className="flex items-center">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500 flex-shrink-0" />
          <span
            className="text-5xl tracking-wide text-white drop-shadow-lg"
            style={{ fontFamily: playball.style.fontFamily, fontWeight: 400 }}
          >
            pophits
          </span>
          
          <span
            className="text-2xl md:text-3xl text-amber-400 drop-shadow-lg"
            style={{ fontFamily: playball.style.fontFamily, fontWeight: 400 }}
          >
            .org
          </span>
        </div>
      </div>
    </div>
  );

  if (showLink) {
    return (
      <Link href="/" className="group flex-shrink-0">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
