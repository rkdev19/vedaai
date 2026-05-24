interface Props {
  title: string
  description?: string
}

export default function ComingSoon({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        {description ?? "We're working on this feature. It'll be available soon!"}
      </p>
      <span className="mt-6 inline-block bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
        Coming Soon
      </span>
    </div>
  )
}
