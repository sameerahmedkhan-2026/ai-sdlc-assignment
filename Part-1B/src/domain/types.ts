export type Intent='create'|'reschedule'|'snooze'|'clarify'|'reject';
export interface ReminderRequest{text:string;referenceTime:string;timezone:string;requestId?:string}
export interface ReminderInterpretation{intent:Intent;subject:string|null;remindAt:string|null;timezone:string|null;snoozeMinutes:number|null;clarificationQuestion:string|null;reason:string|null}
export const FIELDS=['intent','subject','remindAt','timezone','snoozeMinutes','clarificationQuestion','reason'] as const;
