import { useEffect, useRef, useState, type ReactNode } from 'react'

const PAGE_WIDTH = 794

type Props = {
  children: ReactNode
  label: string
}

export function PreviewFrame({ children, label }: Props) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.48)

  useEffect(() => {
    const node = outerRef.current
    if (!node) return
    const fit = () => {
      const width = node.clientWidth
      setScale(Math.min(1, Math.max(0.28, width / PAGE_WIDTH)))
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="preview-outer" ref={outerRef}>
      <p className="preview-label">{label}</p>
      <div className="preview-clip" style={{ height: `${PAGE_WIDTH * (297 / 210) * scale}px` }}>
        <div className="preview-scale" style={{ transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  )
}
