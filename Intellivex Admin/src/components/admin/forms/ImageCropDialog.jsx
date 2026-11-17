import { useEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const VIEW = 288 // crop window, px
const OUT = 800 // saved image is OUT×OUT (smaller if the crop has fewer real pixels)
const MAX_ZOOM = 4

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/**
 * Square crop with drag-to-move and zoom (slider, wheel or +/-), shown through a
 * circle like a profile photo. `onDone` gets the cropped File; `onCancel` keeps nothing.
 */
export default function ImageCropDialog({ file, onDone, onCancel }) {
  const [src, setSrc] = useState(null)
  const [img, setImg] = useState(null) // { w, h, el }
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 }) // image top-left inside the window
  const drag = useRef(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const base = img ? VIEW / Math.min(img.w, img.h) : 1 // "cover" scale at zoom 1
  const scale = base * zoom
  const fit = (p, s = scale) =>
    img ? { x: clamp(p.x, VIEW - img.w * s, 0), y: clamp(p.y, VIEW - img.h * s, 0) } : p

  const onLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
    const s = VIEW / Math.min(w, h)
    setImg({ w, h, el: e.currentTarget })
    setZoom(1)
    setPos({ x: (VIEW - w * s) / 2, y: (VIEW - h * s) / 2 })
  }

  // Zoom around the window centre so the face stays put.
  const zoomTo = (next) => {
    const z = clamp(next, 1, MAX_ZOOM)
    const s = base * z
    const cx = (VIEW / 2 - pos.x) / scale
    const cy = (VIEW / 2 - pos.y) / scale
    setZoom(z)
    setPos(fit({ x: VIEW / 2 - cx * s, y: VIEW / 2 - cy * s }, s))
  }

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  }
  const onPointerMove = (e) => {
    if (drag.current) setPos(fit({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }))
  }
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 20 : 5
    const d = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key]
    if (!d) return
    e.preventDefault()
    setPos(fit({ x: pos.x + d[0], y: pos.y + d[1] }))
  }

  const save = () => {
    const side = VIEW / scale // crop size in original pixels
    const out = Math.round(Math.min(OUT, side))
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = out
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img.el, -pos.x / scale, -pos.y / scale, side, side, 0, 0, out, out)
    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    canvas.toBlob(
      (blob) => onDone(new File([blob], file.name.replace(/\.\w+$/, type === 'image/png' ? '.png' : '.jpg'), { type })),
      type,
      0.92,
    )
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop photo</DialogTitle>
          <DialogDescription>Drag to move, zoom with the slider or mouse wheel.</DialogDescription>
        </DialogHeader>

        <div
          role="application"
          aria-label="Crop area. Use arrow keys to move the photo."
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          onWheel={(e) => zoomTo(zoom - e.deltaY * 0.002)}
          onKeyDown={onKeyDown}
          className="relative mx-auto cursor-grab touch-none overflow-hidden rounded-lg bg-muted outline-none select-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
          style={{ width: VIEW, height: VIEW }}
        >
          {src && (
            <img
              src={src}
              alt=""
              draggable={false}
              onLoad={onLoad}
              className="absolute top-0 left-0 max-w-none origin-top-left"
              style={img ? { width: img.w * scale, height: img.h * scale, transform: `translate(${pos.x}px, ${pos.y}px)` } : { opacity: 0 }}
            />
          )}
          {/* Circle guide: how the website shows it */}
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_999px_rgba(0,0,0,0.5)] ring-2 ring-white/80" />
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={() => zoomTo(zoom - 0.25)} aria-label="Zoom out">
            <ZoomOut className="size-4" />
          </Button>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => zoomTo(Number(e.target.value))}
            aria-label="Zoom"
            className="h-1.5 flex-1 cursor-pointer accent-primary"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => zoomTo(zoom + 0.25)} aria-label="Zoom in">
            <ZoomIn className="size-4" />
          </Button>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={!img}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
