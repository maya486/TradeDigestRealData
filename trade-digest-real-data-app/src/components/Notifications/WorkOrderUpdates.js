import { useQuery } from "@apollo/client";
import { toDate, parseISO, format } from "date-fns";
import { useDates } from "../../hooks/useDates";
import { GET_WO_UPDATES } from "./graphql";
import { vendor_id } from "../../VendorLogic";

export const WorkOrderUpdates = () => {
  const { week_ago } = useDates();
  const {
    loading: wou_loading,
    error: wou_error,
    data: wou_data,
  } = useQuery(GET_WO_UPDATES, {
    variables: {
      date: format(week_ago, "yyyy-MM-dd"),
      vendorId: vendor_id,
    },
  });
  if (wou_loading) return <p>Loading...</p>;
  if (wou_error) return <p>{wou_error.message}</p>;
  const res = wou_data.kernel_work_order.map((wou_info) => {
    if (wou_info.work_order_items.length === 0) {
      return null;
    }
    const updated_at = toDate(parseISO(wou_info.updated_at));
    return {
      type: "wo-update",
      id: wou_info.id,
      dev: wou_info.work_order_items[0].development.name,
      lot: wou_info.work_order_items[0].house_order.lot._code,
      timestamp: updated_at,
      notes: wou_info.notes,
    };
  });
  return res;
};
