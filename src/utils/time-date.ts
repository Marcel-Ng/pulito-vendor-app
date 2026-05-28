export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const momentsAgo = (isoString: string | Date): string => {
  if (!isoString) return "";

  const now = new Date();
  const past = new Date(isoString);

  // Total difference in milliseconds
  const elapsed = now.getTime() - past.getTime();

  // Time math constants
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  // 1. Less than a minute
  if (elapsed < msPerMinute) {
    return "moments ago";
  }

  // 2. Less than an hour
  if (elapsed < msPerHour) {
    const mins = Math.floor(elapsed / msPerMinute);
    return `${mins} ${mins === 1 ? "min" : "mins"} ago`;
  }

  // 3. Less than a day
  if (elapsed < msPerDay) {
    const hours = Math.floor(elapsed / msPerHour);
    return `${hours} ${hours === 1 ? "hr" : "hrs"} ago`;
  }

  // 4. Exact calendar check for "yesterday" vs "X days ago"
  const midnightToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const midnightPast = new Date(
    past.getFullYear(),
    past.getMonth(),
    past.getDate(),
  );
  const daysDiff = Math.round(
    (midnightToday.getTime() - midnightPast.getTime()) / msPerDay,
  );

  if (daysDiff === 1) {
    return "yesterday";
  }

  // 5. Fallback for older orders
  return `${daysDiff} days ago`;
};
