import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** shadcn/ui NativeSelect: a real <select> (keyboard, screen reader, and mobile pickers for free) with Input styling. */
function NativeSelect({ className, ...props }: React.ComponentProps<'select'>) {
	return (
		<div className="group/native-select relative w-full has-[select:disabled]:opacity-50" data-slot="native-select-wrapper">
			<select
				data-slot="native-select"
				className={cn(
					'h-12 w-full min-w-0 appearance-none rounded-[12px] border border-input bg-card py-0 pr-11 pl-4 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed motion-reduce:transition-none',
					'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
					'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
					className,
				)}
				{...props}
			/>
			<ChevronDown
				className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground select-none"
				aria-hidden="true"
			/>
		</div>
	);
}

function NativeSelectOption(props: React.ComponentProps<'option'>) {
	return <option data-slot="native-select-option" {...props} />;
}

export { NativeSelect, NativeSelectOption };
