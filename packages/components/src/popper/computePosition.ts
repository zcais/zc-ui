import type { ComputePositionOptions, PositionResult, PopperPlacement } from './types'

function getOppositePlacement(placement: PopperPlacement): PopperPlacement {
  const map: Record<PopperPlacement, PopperPlacement> = {
    top: 'bottom',
    'top-start': 'bottom-start',
    'top-end': 'bottom-end',
    bottom: 'top',
    'bottom-start': 'top-start',
    'bottom-end': 'top-end',
    left: 'right',
    'left-start': 'right-start',
    'left-end': 'right-end',
    right: 'left',
    'right-start': 'left-start',
    'right-end': 'left-end',
  }
  return map[placement]
}

function computeBasePosition(options: ComputePositionOptions): { x: number; y: number } {
  const { reference, popperSize, placement, offset } = options

  const refCenterX = reference.x + reference.width / 2
  const refCenterY = reference.y + reference.height / 2

  let x = 0
  let y = 0

  if (placement.startsWith('top')) {
    y = reference.y - popperSize.height - offset
    if (placement === 'top') {
      x = refCenterX - popperSize.width / 2
    } else if (placement === 'top-start') {
      x = reference.x
    } else if (placement === 'top-end') {
      x = reference.x + reference.width - popperSize.width
    }
  } else if (placement.startsWith('bottom')) {
    y = reference.y + reference.height + offset
    if (placement === 'bottom') {
      x = refCenterX - popperSize.width / 2
    } else if (placement === 'bottom-start') {
      x = reference.x
    } else if (placement === 'bottom-end') {
      x = reference.x + reference.width - popperSize.width
    }
  } else if (placement.startsWith('left')) {
    x = reference.x - popperSize.width - offset
    if (placement === 'left') {
      y = refCenterY - popperSize.height / 2
    } else if (placement === 'left-start') {
      y = reference.y
    } else if (placement === 'left-end') {
      y = reference.y + reference.height - popperSize.height
    }
  } else if (placement.startsWith('right')) {
    x = reference.x + reference.width + offset
    if (placement === 'right') {
      y = refCenterY - popperSize.height / 2
    } else if (placement === 'right-start') {
      y = reference.y
    } else if (placement === 'right-end') {
      y = reference.y + reference.height - popperSize.height
    }
  }

  return { x, y }
}

function checkOverflow(
  x: number,
  y: number,
  popperSize: { width: number; height: number },
  viewport: { width: number; height: number }
): boolean {
  return (
    x < 0 ||
    y < 0 ||
    x + popperSize.width > viewport.width ||
    y + popperSize.height > viewport.height
  )
}

function totalOverflow(
  x: number,
  y: number,
  popperSize: { width: number; height: number },
  viewport: { width: number; height: number }
): number {
  return (
    Math.max(0, -x) +
    Math.max(0, -y) +
    Math.max(0, x + popperSize.width - viewport.width) +
    Math.max(0, y + popperSize.height - viewport.height)
  )
}

function preventOverflow(
  x: number,
  y: number,
  popperSize: { width: number; height: number },
  viewport: { width: number; height: number },
  padding: number,
  placement: PopperPlacement
): { x: number; y: number } {
  const isVertical = placement.startsWith('top') || placement.startsWith('bottom')

  if (isVertical) {
    // Cross axis: slide sideways to stay inside the viewport ("shift").
    const maxX = viewport.width - popperSize.width - padding
    const clampedX = Math.max(padding, Math.min(x, Math.max(padding, maxX)))
    // Main axis: when flip cannot resolve the overflow (popper taller than
    // the space on either side), clamp along the axis instead of clipping.
    const maxY = viewport.height - popperSize.height - padding
    const clampedY = Math.max(padding, Math.min(y, Math.max(padding, maxY)))
    return { x: clampedX, y: clampedY }
  } else {
    const maxY = viewport.height - popperSize.height - padding
    const clampedY = Math.max(padding, Math.min(y, Math.max(padding, maxY)))
    const maxX = viewport.width - popperSize.width - padding
    const clampedX = Math.max(padding, Math.min(x, Math.max(padding, maxX)))
    return { x: clampedX, y: clampedY }
  }
}

function computeArrowPosition(
  placement: PopperPlacement,
  reference: ComputePositionOptions['reference'],
  popperX: number,
  popperY: number,
  popperSize: { width: number; height: number },
  arrowSize: number
): { x: number; y: number } {
  const refCenterX = reference.x + reference.width / 2
  const refCenterY = reference.y + reference.height / 2

  if (placement.startsWith('bottom')) {
    return {
      x: refCenterX - popperX,
      y: -arrowSize,
    }
  } else if (placement.startsWith('top')) {
    return {
      x: refCenterX - popperX,
      y: popperSize.height,
    }
  } else if (placement.startsWith('right')) {
    return {
      x: -arrowSize,
      y: refCenterY - popperY,
    }
  } else {
    return {
      x: popperSize.width,
      y: refCenterY - popperY,
    }
  }
}

export function computePosition(options: ComputePositionOptions): PositionResult {
  const {
    placement,
    popperSize,
    viewport,
    flip = true,
    preventOverflow: shouldPreventOverflow = true,
    boundaryPadding = 8,
    arrowSize,
    reference,
  } = options

  let finalPlacement = placement
  let { x, y } = computeBasePosition(options)

  if (flip) {
    const isTopBottom = placement.startsWith('top') || placement.startsWith('bottom')

    const spaceBefore = isTopBottom ? reference.y : reference.x
    const spaceAfter = isTopBottom
      ? viewport.height - (reference.y + reference.height)
      : viewport.width - (reference.x + reference.width)

    const oppositePlacement = getOppositePlacement(placement)
    const oppositeResult = computeBasePosition({ ...options, placement: oppositePlacement })

    const overflowBefore = totalOverflow(x, y, popperSize, viewport)
    const overflowAfter = totalOverflow(oppositeResult.x, oppositeResult.y, popperSize, viewport)

    const originalFits = !checkOverflow(x, y, popperSize, viewport)
    const oppositeFits = !checkOverflow(oppositeResult.x, oppositeResult.y, popperSize, viewport)

    let shouldFlip = false
    if (originalFits && oppositeFits) {
      shouldFlip = false
    } else if (!originalFits && oppositeFits) {
      shouldFlip = true
    } else if (originalFits && !oppositeFits) {
      shouldFlip = false
    } else if (overflowAfter < overflowBefore) {
      shouldFlip = true
    } else if (overflowAfter === overflowBefore && spaceAfter > spaceBefore) {
      shouldFlip = true
    }

    if (shouldFlip) {
      finalPlacement = oppositePlacement
      x = oppositeResult.x
      y = oppositeResult.y
    }
  }

  if (shouldPreventOverflow) {
    const clamped = preventOverflow(x, y, popperSize, viewport, boundaryPadding, finalPlacement)
    x = clamped.x
    y = clamped.y
  }

  const result: PositionResult = { x, y, placement: finalPlacement }

  if (arrowSize !== undefined) {
    result.arrow = computeArrowPosition(finalPlacement, reference, x, y, popperSize, arrowSize)
  }

  return result
}
