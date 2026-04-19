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

/**
 * Returns an SVG of a number line plot with X marks above the numbers.
 */
export function drawNumberLinePlot(points: { value: number; count: number }[], minVal: number, maxVal: number, step: number = 1): string {
  const width = 450
  const height = 180
  const paddingX = 30
  const paddingY = 40
  const chartWidth = width - paddingX * 2
  
  const span = maxVal - minVal
  const segments = span / step
  const segmentWidth = chartWidth / segments

  let line = `<line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="currentColor" stroke-width="2"/>`
  let ticks = ''
  let marks = ''

  for (let i = 0; i <= segments; i++) {
    const x = paddingX + i * segmentWidth
    const val = minVal + i * step
    ticks += `<line x1="${x}" y1="${height - paddingY - 5}" x2="${x}" y2="${height - paddingY + 5}" stroke="currentColor" stroke-width="2"/>`
    ticks += `<text x="${x}" y="${height - paddingY + 20}" fill="currentColor" font-size="12" text-anchor="middle" font-weight="bold">${val}</text>`
  }

  points.forEach((p) => {
    const x = paddingX + ((p.value - minVal) / span) * chartWidth
    for (let i = 0; i < p.count; i++) {
      const y = height - paddingY - 15 - i * 15
      marks += `<text x="${x}" y="${y}" fill="${svgConfig.accent}" font-size="14" text-anchor="middle" font-weight="bold">x</text>`
    }
  })

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
      ${line}
      ${ticks}
      ${marks}
    </svg>
  `
}

/**
 * Returns an SVG of a 3D rectangular prism made of unit cubes.
 */
export function draw3DCubeStack(width: number, height: number, depth: number): string {
  const size = 30
  const offset = 12
  const svgWidth = (width + depth) * size + 50
  const svgHeight = height * size + depth * offset + 50
  
  let cubes = ''
  
  for(let z = depth - 1; z >= 0; z--) {
    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        const px = 20 + x * size + (depth - 1 - z) * offset
        const py = svgHeight - 20 - (y + 1) * size - (depth - 1 - z) * offset
        
        const front = `<rect x="${px}" y="${py}" width="${size}" height="${size}" fill="rgba(79,142,247,0.3)" stroke="${svgConfig.accent}" stroke-width="1.5" stroke-linejoin="round"/>`
        const top = `<polygon points="${px},${py} ${px+offset},${py-offset} ${px+size+offset},${py-offset} ${px+size},${py}" fill="rgba(79,142,247,0.5)" stroke="${svgConfig.accent}" stroke-width="1.5" stroke-linejoin="round"/>`
        const right = `<polygon points="${px+size},${py} ${px+size+offset},${py-offset} ${px+size+offset},${py+size-offset} ${px+size},${py+size}" fill="rgba(79,142,247,0.2)" stroke="${svgConfig.accent}" stroke-width="1.5" stroke-linejoin="round"/>`
        
        cubes += top + front + right
      }
    }
  }

  return `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
      ${cubes}
    </svg>
  `
}
