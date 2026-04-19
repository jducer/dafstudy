// lib/diagrams.ts
// Utility functions for generating inline SVG diagrams for math questions

export const svgConfig = {
  width: 400,
  height: 250,
  stroke: 'currentColor',
  fill: 'rgba(79,142,247,0.1)',
  accent: '#4f8ef7',
}

/**
 * Returns an SVG of a coordinate plane with optional plotted points.
 */
export function drawCoordinatePlane(points: { x: number; y: number; label?: string }[] = []): string {
  const size = 200
  const padding = 20
  const max = 10
  const step = size / max

  let grid = ''
  for (let i = 0; i <= max; i++) {
    const pos = i * step
    grid += `<line x1="${padding}" y1="${padding + pos}" x2="${padding + size}" y2="${padding + pos}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`
    grid += `<line x1="${padding + pos}" y1="${padding}" x2="${padding + pos}" y2="${padding + size}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`
    if (i % 2 === 0 && i !== 0) {
      grid += `<text x="${padding + pos}" y="${padding + size + 15}" fill="currentColor" font-size="10" text-anchor="middle">${i}</text>`
      grid += `<text x="${padding - 10}" y="${padding + size - pos + 4}" fill="currentColor" font-size="10" text-anchor="end">${i}</text>`
    }
  }

  // Axes
  const axes = `
    <line x1="${padding}" y1="${padding + size}" x2="${padding + size + 10}" y2="${padding + size}" stroke="currentColor" stroke-width="2" marker-end="url(#arrow)"/>
    <line x1="${padding}" y1="${padding + size}" x2="${padding}" y2="${padding - 10}" stroke="currentColor" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="${padding + size + 15}" y="${padding + size + 4}" fill="currentColor" font-size="12" font-weight="bold">x</text>
    <text x="${padding - 4}" y="${padding - 15}" fill="currentColor" font-size="12" font-weight="bold">y</text>
  `

  let plotted = ''
  points.forEach((p) => {
    const cx = padding + p.x * step
    const cy = padding + size - p.y * step
    plotted += `<circle cx="${cx}" cy="${cy}" r="4" fill="${svgConfig.accent}"/>`
    if (p.label) {
      plotted += `<text x="${cx + 8}" y="${cy - 8}" fill="${svgConfig.accent}" font-size="12" font-weight="bold">${p.label}</text>`
    }
  })

  return `
    <svg viewBox="0 0 ${size + padding * 2} ${size + padding * 2}" width="100%" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
        </marker>
      </defs>
      ${grid}
      ${axes}
      ${plotted}
    </svg>
  `
}

/**
 * Returns an SVG of a simple polygon given its vertices.
 */
export function drawPolygon(points: [number, number][], attrs: string = ''): string {
  const pointsStr = points.map((p) => p.join(',')).join(' ')
  return `
    <svg viewBox="0 0 100 100" width="100%" height="150" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${pointsStr}" fill="${svgConfig.fill}" stroke="${svgConfig.accent}" stroke-width="2" ${attrs}/>
    </svg>
  `
}

/**
 * Returns an SVG of a simple bar chart.
 */
export function drawBarChart(data: { label: string; value: number }[], yMax: number): string {
  const width = 300
  const height = 150
  const paddingX = 40
  const paddingY = 20
  
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingY * 2
  const barWidth = chartWidth / data.length - 10
  
  let bars = ''
  let xAxis = `<line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX + 20}" y2="${height - paddingY}" stroke="currentColor" stroke-width="2"/>`
  let yAxis = `<line x1="${paddingX}" y1="${height - paddingY}" x2="${paddingX}" y2="${paddingY - 10}" stroke="currentColor" stroke-width="2"/>`
  
  data.forEach((d, i) => {
    const x = paddingX + 10 + i * (barWidth + 10)
    const barH = (d.value / yMax) * chartHeight
    const y = height - paddingY - barH
    bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="${svgConfig.accent}" rx="2"/>`
    bars += `<text x="${x + barWidth / 2}" y="${height - paddingY + 15}" fill="currentColor" font-size="10" text-anchor="middle">${d.label}</text>`
    bars += `<text x="${x + barWidth / 2}" y="${y - 5}" fill="currentColor" font-size="10" text-anchor="middle" font-weight="bold">${d.value}</text>`
  })

  // Y-axis labels
  const yLabels = `
    <text x="${paddingX - 10}" y="${height - paddingY}" fill="currentColor" font-size="10" text-anchor="end">0</text>
    <text x="${paddingX - 10}" y="${paddingY}" fill="currentColor" font-size="10" text-anchor="end">${yMax}</text>
  `

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
      ${xAxis}
      ${yAxis}
      ${yLabels}
      ${bars}
    </svg>
  `
}

/**
 * Returns an SVG representing a fraction using shaded rectangles.
 */
export function drawFractionBox(numerator: number, denominator: number): string {
  const boxW = 40
  const boxH = 40
  const spacing = 5
  const totalW = (boxW + spacing) * denominator + spacing
  
  let boxes = ''
  for (let i = 0; i < denominator; i++) {
    const isShaded = i < numerator
    const fill = isShaded ? svgConfig.accent : 'transparent'
    boxes += `<rect x="${spacing + i * (boxW + spacing)}" y="${spacing}" width="${boxW}" height="${boxH}" fill="${fill}" stroke="currentColor" stroke-width="2" rx="4"/>`
  }

  return `
    <svg viewBox="0 0 ${totalW} ${boxH + spacing * 2}" width="100%" height="100" xmlns="http://www.w3.org/2000/svg">
      ${boxes}
    </svg>
  `
}
