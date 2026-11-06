import * as React from 'react';
import { cn } from '@/lib/utils';

/** shadcn/ui Label as a native <label>: no Radix needed for static forms. */
function Label({ className, ...props }: React.ComponentProps<'label'>) {
	return (
		<label
			data-slot="label"
			className={cn('flex items-center gap-2 text-sm leading-[1.43] font-semibold select-none', className)}
			{...props}
		/>
	);
}

export { Label };
