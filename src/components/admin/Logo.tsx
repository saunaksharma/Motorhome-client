import React from 'react'

// Brand mark on the admin login / create-account screens.
export function Logo() {
  return (
    <div className="ma-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/emblem.png" alt="" className="ma-logo__emblem" />
      <span className="ma-logo__name">Motorhome Adventures</span>
      <span className="ma-logo__sub">Website Admin</span>
    </div>
  )
}
