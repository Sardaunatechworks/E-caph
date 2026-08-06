import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utilities';

const badgeVariants = cva(
  'inline-flex items-center rounded-[6px] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#0092DF] text-white',
        secondary: 'border-transparent bg-[#86C127] text-white',
        accent: 'border-transparent bg-[#E67817] text-white',
        outline: 'border-[#E2E8F0] text-[#64748B] bg-white',
        published: 'border-transparent bg-[#86C127] text-white',
        draft: 'border-transparent bg-[#E67817] text-white',
        pending: 'border-transparent bg-[#0092DF] text-white',
        rejected: 'border-transparent bg-[#EF4444] text-white',
        archived: 'border-[#E2E8F0] bg-[#F7FAF8] text-[#94A3B8]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
