import { useQuery } from "@apollo/client";
import { useDates } from "../../hooks/useDates";
import { GET_WO_APPROVALS } from "./graphql";
import { format, toDate, parseISO } from "date-fns";
import { vendor_id } from "../../VendorLogic";

export const WorkOrderApprovals = () => {
  const { week_ago } = useDates();
  const {
    loading: woa_loading,
    error: woa_error,
    data: woa_data,
  } = useQuery(GET_WO_APPROVALS, {
    variables: {
      date: format(week_ago, "yyyy-MM-dd"),
      vendorId: vendor_id,
    },
  });
  if (woa_loading) return <p>Loading...</p>;
  if (woa_error) return <p>{woa_error.message}</p>;
  const res = woa_data.kernel_work_order_approval.map((woa_info) => {
    if (
      woa_info.work_order === null ||
      woa_info.work_order.work_order_items.length === 0
    ) {
      return null;
    }
    const updated_at = toDate(parseISO(woa_info.timestamp));
    return {
      type: "wo-approval",
      id: woa_info.work_order.id,
      dev: woa_info.work_order.work_order_items[0].development.name,
      lot: woa_info.work_order.work_order_items[0].house_order.lot._code,
      timestamp: updated_at,
      approved_by_user: woa_data.approved_by_user,
    };
  });
  return res;
};
