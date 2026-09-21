'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

export type GalleryImage = { url: string; alt?: string; caption?: string }

// Image grid with a click-to-open lightbox.
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (images.length === 0) {
    return <p className="text-center text-muted-foreground">No images yet.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setOpenIndex(index)}
            className="relative aspect-square overflow-hidden rounded-xl"
            aria-label={`Open image ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={image.alt ?? ''}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button aria-label="Close" className="absolute right-4 top-4 text-white">
            <X className="size-7" />
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={images[openIndex].url}
              alt={images[openIndex].alt ?? ''}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
