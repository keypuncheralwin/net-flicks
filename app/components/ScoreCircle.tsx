interface ScoreCircleProps {
  score: number;
}

export default function ScoreCircle(props: ScoreCircleProps) {
  const percentage = Math.round(props.score * 10); // Convert to percentage
  let circleColor = 'text-red-500'; // Default to red for low scores

  if (percentage >= 70) {
    circleColor = 'text-green-500'; // Green for high scores
  } else if (percentage >= 55) {
    circleColor = 'text-yellow-500'; // Yellow for medium scores
  }

  const size = 34; // SVG dimensions (width/height)
  const strokeWidth = 4;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = ((100 - percentage) / 100) * circumference;

  return (
    <div className="relative z-100">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={circleColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-white">
        {percentage}%
      </span>
    </div>
  );
}
