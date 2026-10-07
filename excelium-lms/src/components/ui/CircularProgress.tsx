'use client'

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  showLabel?: boolean
}

export default function CircularProgress({
  progress,
  size = 60,
  strokeWidth = 4,
  color = '#C9A24B',
  trackColor = 'rgba(255,255,255,0.1)',
  showLabel = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="progress-ring"
        aria-label={`${Math.round(progress)}% complété`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold font-mono">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  )
}
