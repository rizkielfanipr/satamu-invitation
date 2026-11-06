import * as React from 'react';
import { cn } from '@/lib/utils';

/** shadcn/ui Input, sized for Satamu forms (docs/design.md: white, 1px input border, 12px radius, 48px tall). */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'h-12 w-full min-w-0 rounded-[12px] border border-input bg-card px-4 text-base transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
				'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
				'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
