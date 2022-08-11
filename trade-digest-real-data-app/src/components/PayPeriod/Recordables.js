import { useQuery } from "@apollo/client";
import { GET_RECORDABLES } from "./graphql";
import { Subdivider } from "../Structure";
import { Box, LinkBox, LinkOverlay, Icon } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import { vendor_id } from "../../VendorLogic";

export const Recordables = () => {
  const { loading, error, data } = useQuery(GET_RECORDABLES, {
    variables: {
      vendorId: vendor_id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 0 {error.message}</p>;
  return data.kernel_task_recordable.map((info) => {
    const link = `https://mosaic.build/${info.task.lot.development.name_slug}/${info.task.lot._code}/${info.id}`;
    return (
      <>
        <Subdivider />
        <Box className="punch-item-box">
          <div className="notif-item">
            <div className="bullet"></div>
            <div className="notif-item-text">
              <p className="notif-name">
                {info.transcript.length > 0
                  ? info.transcript
                  : `No Name Available`}
              </p>
              <p className="notif-details">
                {info.task.lot.development.name} | Lot {info.task.lot._code}
              </p>
            </div>
            <LinkBox className="punch-item-link">
              <LinkOverlay href={link} target="_blank" />
              <Icon as={FiExternalLink} w="23px" h="23px" />
            </LinkBox>
          </div>
        </Box>
      </>
    );
  });
};
