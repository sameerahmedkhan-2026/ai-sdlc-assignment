export function clarification(text: string) {
  if (!text.trim()) return 'What reminder would you like to create?';
  const hasSchedule =
    /(\d{1,2}\s*(am|pm)|\b(today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|in \d+\s*(minute|hour|day)))/i.test(text);
  if (/\b(remind|reminder)\b/i.test(text) && !hasSchedule)
    return 'What date and time should I use for this reminder?';
  if (/\b(reschedule|move)\b/i.test(text) && !/(reminder|dentist|report|meeting)/i.test(text))
    return 'Which reminder should I reschedule?';
  if (/\bsnooze\b/i.test(text) && !(/\b\d+\s*(minute|hour|day)/i.test(text) || /\b(to|until)\b/i.test(text)))
    return 'How long should I snooze the reminder?';
  return null;
}
