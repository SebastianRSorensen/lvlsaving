'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

type ProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & {
  indicatorColor?: string
  max?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({
  className,
  value,
  indicatorColor,
  max = 100, // Default max to 100 if not provided
  ...props
}, ref) => {
  let percentageValue = (value || 0) / max * 100;

  // Ensure the percentage does not exceed 100%
  if (percentageValue > 100) {
    percentageValue = 100;
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 bg-primary transition-all',
          indicatorColor
        )}
        style={{
          transform: `translateX(-${100 - percentageValue}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
});



export { Progress }