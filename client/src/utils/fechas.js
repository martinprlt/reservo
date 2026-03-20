export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateStr) {
  return `${formatDate(dateStr)} a las ${formatTime(dateStr)}`;
}

export function isToday(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function getWeekDays(startDate = new Date()) {
  const days = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay());

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }

  return days;
}
