// Restaurant hours utility for Costa Rica timezone (GMT-6)

// Schedule configuration
const schedule = {
  0: { closed: false, open: 15, close: 21.5 },  // Domingo: 3pm - 9:30pm
  1: { closed: true },                            // Lunes: Cerrado
  2: { closed: false, open: 16, close: 22 },     // Martes: 4pm - 10pm
  3: { closed: false, open: 16, close: 22 },     // Miércoles: 4pm - 10pm
  4: { closed: false, open: 16, close: 22 },     // Jueves: 4pm - 10pm
  5: { closed: false, open: 16, close: 22 },     // Viernes: 4pm - 10pm
  6: { closed: false, open: 15, close: 22 },     // Sábado: 3pm - 10pm
};

const dayNames = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// Get current time in Costa Rica (GMT-6)
export function getCostaRicaTime() {
  const now = new Date();
  // Costa Rica is UTC-6 (no daylight saving)
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const costaRicaTime = new Date(utcTime - 6 * 60 * 60 * 1000);
  return costaRicaTime;
}

// Format hour to readable string (e.g., 16 -> "4:00pm", 21.5 -> "9:30pm")
export function formatHour(hour) {
  const h = Math.floor(hour);
  const m = (hour % 1) * 60;
  const period = h >= 12 ? 'pm' : 'am';
  const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const displayMinutes = m > 0 ? `:${m.toString().padStart(2, '0')}` : '';
  return `${displayHour}${displayMinutes}${period}`;
}

// Check if restaurant is currently open
export function isRestaurantOpen() {
  const crTime = getCostaRicaTime();
  const dayOfWeek = crTime.getDay();
  const currentHour = crTime.getHours() + crTime.getMinutes() / 60;

  const todaySchedule = schedule[dayOfWeek];

  if (todaySchedule.closed) {
    return false;
  }

  return currentHour >= todaySchedule.open && currentHour < todaySchedule.close;
}

// Get next opening info
export function getNextOpeningInfo() {
  const crTime = getCostaRicaTime();
  let dayOfWeek = crTime.getDay();
  const currentHour = crTime.getHours() + crTime.getMinutes() / 60;

  const todaySchedule = schedule[dayOfWeek];

  // If today is open and we're before opening time, return today's opening
  if (!todaySchedule.closed && currentHour < todaySchedule.open) {
    return {
      day: 'hoy',
      dayName: dayNames[dayOfWeek],
      openTime: formatHour(todaySchedule.open),
      isToday: true,
    };
  }

  // Otherwise, find the next open day
  for (let i = 1; i <= 7; i++) {
    const nextDay = (dayOfWeek + i) % 7;
    const nextSchedule = schedule[nextDay];

    if (!nextSchedule.closed) {
      const isTomorrow = i === 1;
      return {
        day: isTomorrow ? 'mañana' : dayNames[nextDay],
        dayName: dayNames[nextDay],
        openTime: formatHour(nextSchedule.open),
        isToday: false,
        isTomorrow,
      };
    }
  }

  return null;
}

// Get a friendly message for when the restaurant is closed
export function getClosedMessage() {
  const nextOpening = getNextOpeningInfo();

  if (!nextOpening) {
    return 'El restaurante está cerrado temporalmente.';
  }

  if (nextOpening.isToday) {
    return `Abrimos hoy a las ${nextOpening.openTime}`;
  }

  if (nextOpening.isTomorrow) {
    return `Abrimos mañana a las ${nextOpening.openTime}`;
  }

  return `Abrimos el ${nextOpening.day} a las ${nextOpening.openTime}`;
}

// Hook for React components to get restaurant status
export function useRestaurantStatus() {
  const isOpen = isRestaurantOpen();
  const nextOpening = getNextOpeningInfo();
  const closedMessage = getClosedMessage();

  return {
    isOpen,
    nextOpening,
    closedMessage,
  };
}
