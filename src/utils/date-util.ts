export type TimeRange = "7d" | "30d" | "90d" | "1y";

export const generateDateLabels = (range: TimeRange): string[] => {
  const today = new Date();
  const labels: string[] = [];

  let days: number;
  let interval: number;

  switch (range) {
    case "7d":
      days = 7;
      interval = 1;
      break;
    case "30d":
      days = 30;
      interval = 5;
      break;
    case "90d":
      days = 90;
      interval = 15;
      break;
    case "1y":
      days = 365;
      interval = 30;
      break;
    default:
      days = 30;
      interval = 5;
  }

  for (let i = days; i >= 0; i -= interval) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    labels.push(
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
  }

  return labels;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
