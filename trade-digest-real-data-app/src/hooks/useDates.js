import {
  subWeeks,
  startOfDay,
  startOfMonth,
  addDays,
  isFuture,
  endOfMonth,
} from "date-fns";

export const useDates = () => {
  const current = startOfDay(new Date());
  var start_pay_period = startOfMonth(current);
  var end_pay_period = addDays(startOfMonth(current), 14);
  if (!isFuture(end_pay_period)) {
    start_pay_period = end_pay_period;
    end_pay_period = addDays(endOfMonth(current), 1);
  }
  const now = new Date();
  const week_ago = subWeeks(now, 1);
  return { current, now, start_pay_period, end_pay_period, week_ago };
};
