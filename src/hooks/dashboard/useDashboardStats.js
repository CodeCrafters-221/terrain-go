import { useMemo } from "react";
import { isPaidStatus } from "../../utils/dateTime";

export const useDashboardStats = (reservations, subscriptions) => {
  const monthlyRevenue = useMemo(() => {
    const now = new Date();

    return [...reservations, ...subscriptions].reduce((acc, item) => {
      const date = new Date(item.date || item.startDate || item.createdAt);

      const isThisMonth =
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      return isThisMonth && isPaidStatus(item.status)
        ? acc + (Number(item.price) || 0)
        : acc;
    }, 0);
  }, [reservations, subscriptions]);

  return { monthlyRevenue };
};
