import { useQuery } from "@apollo/client";
import { useDates } from "../../hooks/useDates";
import { GET_DOC_DATA } from "./graphql";
import { format, toDate, parseISO } from "date-fns";
import { vendor_id } from "../../VendorLogic";

export const DocData = () => {
  const { week_ago } = useDates();
  const {
    loading: dev_loading,
    error: dev_error,
    data: dev_data,
  } = useQuery(GET_DOC_DATA, {
    variables: {
      vendorId: vendor_id,
      date: format(week_ago, "yyyy-MM-dd"),
      // date: "2022-07-29",
    },
  });

  if (dev_loading) return <p>Loading...</p>;
  if (dev_error) {
    console.log(dev_error.message);
    return <p>{dev_error.message}</p>;
  }
  const res = [];
  dev_data.kernel_development_vendor_selection.forEach((dev_info) => {
    if (
      dev_info.development !== null ||
      dev_info.development.delivery_documents.length > 0
    ) {
      dev_info.development.delivery_documents.forEach((doc_info) => {
        const updated_at = toDate(parseISO(doc_info.updated_at));
        res.push({
          type: "doc",
          id: doc_info.id,
          dev: dev_info.development.name,
          lot: doc_info.lot._code,
          filename: doc_info.filename,
          timestamp: updated_at,
        });
      });
    }
  });
  return res;
};
