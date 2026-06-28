import { motion } from "motion/react";
import { PROVINCE_PATHS } from "./provincePaths";

interface NetherlandsMapProps {
  highlightedProvince: string | null;
  onProvinceHover: (province: string | null) => void;
  className?: string;
}

export default function NetherlandsMap({
  highlightedProvince,
  onProvinceHover,
  className = "",
}: NetherlandsMapProps) {
  const provinces = Object.keys(PROVINCE_PATHS);

  return (
    <div className={`relative w-full aspect-[200/236] max-w-[400px] mx-auto ${className}`}>
      <svg
        viewBox="0 0 200 236"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] filter"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="provinces-group">
          {provinces.map((provinceName) => {
            const paths = PROVINCE_PATHS[provinceName];
            const isHighlighted = highlightedProvince === provinceName;

            return (
              <g
                key={provinceName}
                className="cursor-pointer group"
                onMouseEnter={() => onProvinceHover(provinceName)}
                onMouseLeave={() => onProvinceHover(null)}
              >
                {paths.map((pathData, index) => (
                  <motion.path
                    key={`${provinceName}-${index}`}
                    d={pathData}
                    initial={{ fill: "rgba(148, 163, 184, 0.12)", stroke: "rgba(148, 163, 184, 0.3)" }}
                    animate={{
                      fill: isHighlighted
                        ? "rgba(171, 92, 157, 0.75)" // brand purple highlight
                        : "rgba(44, 122, 185, 0.25)", // brand blue active coverage
                      stroke: isHighlighted
                        ? "#ab5c9d" // brand purple border
                        : "rgba(255, 255, 255, 0.6)",
                      strokeWidth: isHighlighted ? 1.5 : 0.75,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 15,
                    }}
                  />
                ))}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
