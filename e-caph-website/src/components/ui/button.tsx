import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utilities';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0092DF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-[#0092DF] text-white hover:bg-[#007DC2] shadow-sm',
        secondary: 'bg-white border border-[#0092DF] text-[#0092DF] hover:bg-[#E6F4FC]',
        accent: 'bg-[#E67817] text-white hover:bg-[#CF660F] shadow-sm',
        success: 'bg-[#86C127] text-white hover:bg-[#6EA71F] shadow-sm',
        outline: 'border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F7FAF8] hover:border-[#0092DF]',
        ghost: 'text-[#1E293B] hover:bg-[#F7FAF8] hover:text-[#0092DF]',
        link: 'text-[#0092DF] underline-offset-4 hover:underline p-0 h-auto font-medium',
        destructive: 'bg-[#EF4444] text-white hover:bg-red-700 shadow-sm',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size, className }), child.props.className),
        ref,
        ...props,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
