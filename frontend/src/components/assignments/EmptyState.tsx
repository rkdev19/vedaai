import Link from 'next/link'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background document */}
        <rect x="45" y="35" width="100" height="130" rx="8" fill="#E5E7EB" />
        <rect x="55" y="50" width="60" height="6" rx="3" fill="#D1D5DB" />
        <rect x="55" y="64" width="80" height="6" rx="3" fill="#D1D5DB" />
        <rect x="55" y="78" width="50" height="6" rx="3" fill="#D1D5DB" />
        <rect x="55" y="92" width="70" height="6" rx="3" fill="#D1D5DB" />

        {/* Magnifying glass circle */}
        <circle cx="115" cy="115" r="38" fill="white" stroke="#9CA3AF" strokeWidth="3" />
        <circle cx="115" cy="115" r="26" fill="#F3F4F6" />

        {/* X mark inside magnifying glass */}
        <line x1="105" y1="105" x2="125" y2="125" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="125" y1="105" x2="105" y2="125" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />

        {/* Magnifying glass handle */}
        <line x1="145" y1="145" x2="162" y2="162" stroke="#9CA3AF" strokeWidth="5" strokeLinecap="round" />

        {/* Sparkles */}
        <circle cx="48" cy="48" r="4" fill="#FCD34D" />
        <circle cx="158" cy="42" r="3" fill="#A78BFA" />
        <circle cx="35" cy="140" r="3" fill="#A78BFA" />
        <circle cx="165" cy="145" r="4" fill="#FCD34D" />
        <path d="M155 65 L158 58 L161 65 L168 68 L161 71 L158 78 L155 71 L148 68 Z" fill="#FCD34D" fillOpacity="0.8" />
      </svg>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900">No assignments yet</h2>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          Create your first assignment to start collecting and grading student submissions. You can
          set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
      </div>

      <Link
        href="/assignments/create"
        className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        + Create Your First Assignment
      </Link>
    </div>
  )
}
