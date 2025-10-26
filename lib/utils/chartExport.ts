/**
 * Chart Export Utilities
 * Handles exporting charts to various formats (SVG, PNG, CSV, JSON)
 */

/**
 * Export an SVG element to a downloadable SVG file
 */
export function exportSVG(svgElement: SVGElement, filename: string = 'chart.svg') {
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)

  const downloadLink = document.createElement('a')
  downloadLink.href = svgUrl
  downloadLink.download = filename
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(svgUrl)
}

/**
 * Export an SVG element to a PNG file
 */
export function exportPNG(
  svgElement: SVGElement,
  filename: string = 'chart.png',
  scale: number = 2 // For high-DPI displays
) {
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    console.error('Could not get canvas context')
    return
  }

  const img = new Image()
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  img.onload = () => {
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    ctx.scale(scale, scale)
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(url)

    canvas.toBlob((blob) => {
      if (blob) {
        const pngUrl = URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = filename
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(pngUrl)
      }
    })
  }

  img.src = url
}

/**
 * Export data to CSV format
 */
export function exportCSV(data: any[], filename: string = 'data.csv') {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = filename
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

/**
 * Export data to JSON format
 */
export function exportJSON(data: any, filename: string = 'data.json') {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = filename
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

/**
 * Export a chart container (finds SVG inside)
 */
export function exportChartContainer(
  containerRef: HTMLElement | null,
  format: 'svg' | 'png' | 'csv' | 'json',
  data?: any,
  filename?: string
) {
  if (!containerRef) {
    console.error('Container ref is null')
    return
  }

  const chartName = filename || 'chart'

  switch (format) {
    case 'svg': {
      const svgElement = containerRef.querySelector('svg')
      if (svgElement) {
        exportSVG(svgElement, `${chartName}.svg`)
      } else {
        console.error('No SVG element found in container')
      }
      break
    }

    case 'png': {
      const svgElement = containerRef.querySelector('svg')
      if (svgElement) {
        exportPNG(svgElement, `${chartName}.png`)
      } else {
        console.error('No SVG element found in container')
      }
      break
    }

    case 'csv': {
      if (data) {
        exportCSV(data, `${chartName}.csv`)
      } else {
        console.error('No data provided for CSV export')
      }
      break
    }

    case 'json': {
      if (data) {
        exportJSON(data, `${chartName}.json`)
      } else {
        console.error('No data provided for JSON export')
      }
      break
    }

    default:
      console.error(`Unsupported export format: ${format}`)
  }
}

/**
 * Copy SVG to clipboard
 */
export async function copySVGToClipboard(svgElement: SVGElement) {
  const svgData = new XMLSerializer().serializeToString(svgElement)

  try {
    await navigator.clipboard.writeText(svgData)
    return true
  } catch (err) {
    console.error('Failed to copy SVG to clipboard:', err)
    return false
  }
}

/**
 * Print a chart
 */
export function printChart(svgElement: SVGElement, chartTitle: string = 'Chart') {
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const printWindow = window.open('', '_blank')

  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${chartTitle}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            svg {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${svgData}
          <script>
            window.onload = () => {
              window.print()
              window.onafterprint = () => window.close()
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }
}
