import type {ReminderRequest} from './types';
export function validTimezone(t:string){try{new Intl.DateTimeFormat('en-US',{timeZone:t}).format();return true}catch{return false}}
export function normalizeContext(r:ReminderRequest){if(!/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(r.referenceTime)||!validTimezone(r.timezone))throw new Error('Invalid request context');const d=new Date(r.referenceTime);if(Number.isNaN(d.getTime()))throw new Error('Invalid reference time');return {...r,text:r.text.trim()}}
export function futureIso(reference:string,days:number,hour:number,minute=0){const d=new Date(reference);d.setUTCDate(d.getUTCDate()+days);d.setUTCHours(hour,minute,0,0);return d.toISOString()}
