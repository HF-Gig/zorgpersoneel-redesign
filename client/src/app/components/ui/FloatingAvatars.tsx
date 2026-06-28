import { motion } from "motion/react";

interface StaffProfile {
  id: string;
  name: string;
  role: string;
  gender: "male" | "female";
  left: string;
  top: string;
}

const STAFF_PROFILES: StaffProfile[] = [
  {
    id: "emma",
    name: "Emma",
    role: "Jeugdzorgwerker",
    gender: "female",
    left: "5%",
    top: "12%", // Top-left corner (above header)
  },
  {
    id: "daan",
    name: "Daan",
    role: "GGZ Begeleider",
    gender: "male",
    left: "8%",
    top: "85%", // Bottom-left corner (below buttons)
  },
  {
    id: "sophie",
    name: "Sophie",
    role: "Gezinstherapeut",
    gender: "female",
    left: "48%",
    top: "14%", // Top-middle gap
  },
  {
    id: "luuk",
    name: "Luuk",
    role: "Orthopedagoog",
    gender: "male",
    left: "44%",
    top: "84%", // Bottom-middle gap
  },
  {
    id: "milan",
    name: "Milan",
    role: "PMT Therapeut",
    gender: "male",
    left: "72%",
    top: "8%", // Top-right corner (above 3D card)
  },
  {
    id: "lisa",
    name: "Lisa",
    role: "Sociaal Werker",
    gender: "female",
    left: "92%",
    top: "22%", // Far right middle-top
  },
  {
    id: "thomas",
    name: "Thomas",
    role: "Begeleider Jeugd",
    gender: "male",
    left: "85%",
    top: "82%", // Bottom-right corner (below 3D card)
  },
];

const FemaleDoctorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-10 h-10 md:w-12 md:h-12 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    {/* Head/face silhouette */}
    <circle cx="12" cy="7.5" r="4.5" />
    {/* Hair details representing a lady */}
    <path
      d="M7 8.5c0-3.5 2.5-5 5-5s5 1.5 5 5c0 1.5-.5 3-1.5 3s-1.5-1.5-1.5-1.5-1 1.5-2 1.5-2-1.5-2-1.5-1 1.5-1.5 1.5c-1 0-1.5-1-1.5-3z"
      fill="currentColor"
      opacity="0.25"
    />
    {/* Shoulders */}
    <path d="M4 20c0-3 3-5.5 8-5.5s8 2.5 8 5.5" strokeLinecap="round" />
    {/* Doctor collar / V-neck */}
    <path d="M9.5 14.5l2.5 3.5 2.5-3.5" />
    {/* Stethoscope */}
    <path d="M8 15.5c0 2 1.5 3.5 4 3.5s4-1.5 4-3.5" strokeWidth="1.2" />
    <path d="M12 19v2.5M10.5 21.5h3" strokeWidth="1.2" />
  </svg>
);

const MaleDoctorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-10 h-10 md:w-12 md:h-12 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    {/* Head/face */}
    <circle cx="12" cy="7.5" r="4" />
    {/* Short hair style */}
    <path d="M8 7c0-2.5 2-4.5 4-4.5s4 2 4 4.5" fill="currentColor" opacity="0.25" />
    {/* Shoulders */}
    <path d="M4 20c0-3 3-5 8-5s8 2 8 5" strokeLinecap="round" />
    {/* Tie or Collar */}
    <path d="M11 15v3.5l1 1 1-1V15" />
    {/* Stethoscope */}
    <path d="M8 15.5c0 2 1.5 3.5 4 3.5s4-1.5 4-3.5" strokeWidth="1.2" />
    <path d="M12 19v2.5M10.5 21.5h3" strokeWidth="1.2" />
  </svg>
);

export default function FloatingAvatars() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 hidden lg:block">
      {STAFF_PROFILES.map((staff, index) => {
        // Drifting parameters
        const xAmplitude = 10 + (index % 3) * 5;
        const yAmplitude = 14 + (index % 2) * 6;
        const duration = 6 + (index % 3) * 1.5;

        const gradientBg =
          staff.gender === "female"
            ? "from-pink-500 to-rose-400 ring-pink-400/30 group-hover:from-pink-600 group-hover:to-rose-500"
            : "from-blue-500 to-sky-400 ring-blue-400/30 group-hover:from-blue-600 group-hover:to-sky-500";

        const accentShadow =
          staff.gender === "female"
            ? "shadow-pink-500/10 group-hover:shadow-pink-500/30"
            : "shadow-blue-500/10 group-hover:shadow-blue-500/30";

        return (
          <motion.div
            key={staff.id}
            className="absolute pointer-events-auto group"
            style={{
              left: staff.left,
              top: staff.top,
            }}
            animate={{
              x: [0, xAmplitude, -xAmplitude, 0],
              y: [0, yAmplitude, -yAmplitude, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Doctor Icon Bubble */}
              <div
                className={`relative p-3 rounded-full bg-gradient-to-br ${gradientBg} ring-4 backdrop-blur-md shadow-xl transition-all duration-500 ${accentShadow} hover:scale-110 cursor-pointer flex items-center justify-center`}
              >
                {staff.gender === "female" ? <FemaleDoctorIcon /> : <MaleDoctorIcon />}
              </div>

              {/* Hover Info Card */}
              <div className="absolute top-full mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 pointer-events-none z-50">
                <div className="glass rounded-xl px-4 py-2 border border-border/40 shadow-xl text-center min-w-[140px]">
                  <p className="font-semibold text-foreground text-sm leading-tight">
                    {staff.name}
                  </p>
                  <p className="text-muted-foreground text-[11px] mt-0.5 whitespace-nowrap">
                    {staff.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
