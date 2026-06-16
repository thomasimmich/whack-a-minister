export function PixiLikeText({
  colors,
  fontSize,
  id,
  maxWidth,
  strokeWidth = 4,
  text,
}: {
  colors: string[];
  fontSize: number;
  id: string;
  maxWidth?: number;
  strokeWidth?: number;
  text: string;
}) {
  const shadowBlur = 4;
  const shadowOffsetX = 5.2;
  const shadowOffsetY = 3;
  const horizontalPad = Math.ceil(strokeWidth / 2 + shadowBlur + shadowOffsetX + 4);
  const verticalPad = Math.ceil(strokeWidth / 2 + shadowBlur + shadowOffsetY + 2);
  const capHeight = fontSize * 0.72;
  const lineHeight = fontSize * 1.42;
  const lines = wrapText(
    text,
    fontSize,
    maxWidth ? maxWidth - horizontalPad * 2 : undefined,
  );
  const longestLineWidth = Math.max(
    ...lines.map((line) => estimateTextWidth(line, fontSize)),
  );
  const width = Math.ceil(
    maxWidth
      ? Math.min(maxWidth, longestLineWidth + horizontalPad * 2)
      : longestLineWidth + horizontalPad * 2,
  );
  const textBlockHeight = capHeight + Math.max(0, lines.length - 1) * lineHeight;
  const height = Math.ceil(textBlockHeight + verticalPad * 2);
  const centerX = width / 2;
  const firstBaselineY = (height - textBlockHeight) / 2 + capHeight;

  return (
    <svg
      aria-label={text}
      className="mx-auto  block overflow-visible"
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={`${id}-gradient`}
          x1="0"
          x2="0"
          y1="0"
          y2={height}
        >
          {colors.map((color, index) => (
            <stop
              key={color}
              offset={`${(index / Math.max(colors.length - 1, 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
        <filter
          height="180%"
          id={`${id}-shadow`}
          width="180%"
          x="-40%"
          y="-40%"
        >
          <feDropShadow
            dx={5.2}
            dy={3}
            floodColor="#000000"
            floodOpacity="0.9"
            stdDeviation={4}
          />
        </filter>
      </defs>
      <text
        dominantBaseline="alphabetic"
        fill={`url(#${id}-gradient)`}
        filter={`url(#${id}-shadow)`}
        fontFamily="Arial, sans-serif"
        fontSize={fontSize}
        fontStyle="italic"
        fontWeight="700"
        paintOrder="stroke fill"
        stroke="#000000"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        textAnchor="middle"
        x={centerX}
        y={firstBaselineY}
      >
        {lines.map((line, index) => (
          <tspan key={`${line}-${index}`} x={centerX} dy={index === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  );
}

function wrapText(text: string, fontSize: number, maxTextWidth?: number) {
  const explicitLines = text.split("\n");

  if (!maxTextWidth) {
    return explicitLines;
  }

  return explicitLines.flatMap((explicitLine) => {
    const words = explicitLine.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;

      if (currentLine && estimateTextWidth(nextLine, fontSize) > maxTextWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = nextLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [explicitLine];
  });
}

function estimateTextWidth(text: string, fontSize: number) {
  return text.length * fontSize * 0.62;
}
