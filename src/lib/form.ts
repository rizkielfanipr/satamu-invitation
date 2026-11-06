/** aria-describedby for a control inside OrderField: its hint (when there is one) and its error line. */
export const describedBy = (id: string, hint?: string) => [hint ? `${id}-hint` : null, `${id}-error`].filter(Boolean).join(' ');
