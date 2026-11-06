import * as React from 'react';
import { cn } from '@/lib/utils';

/** shadcn/ui Textarea with the same surface as Input. */
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				'flex field-sizing-content min-h-28 w-full rounded-[12px] border border-input bg-card px-4 py-3 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
				'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
				'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
