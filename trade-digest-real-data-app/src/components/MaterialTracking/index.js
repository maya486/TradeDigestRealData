import { ReportHeader } from "../Structure";
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Accordion,
  AccordionItem,
} from "@chakra-ui/react";
import {
  CustomTab,
  CustomMTAccordionButton,
  CustomMTAccordionPanel,
} from "./CustomDisplay";

export const MaterialTracking = () => {
  return (
    <>
      <ReportHeader text="Material Tracking" />
      <div className="material-wrapper">
        <Tabs variant="unstyled">
          <TabList
            css={{
              background: "#DBDDE1",
              borderRadius: "25px",
              height: "40px",
              outline: "4px solid #DBDDE1",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <CustomTab text="Delivered Items" />
            <CustomTab text="Pending Items" />
          </TabList>
          <TabPanels paddingTop="20px">
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <Accordion allowMultiple>
                <AccordionItem borderBottom="none">
                  <CustomMTAccordionButton
                    date="Jul 10, 2022"
                    info="16d framing nails"
                    icon_type="Delivered"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="319, 331"
                    isDelivered={true}
                    date="07/07/2022"
                  />
                </AccordionItem>
                <AccordionItem borderBottom="none">
                  <CustomMTAccordionButton
                    date="Jul 10, 2022"
                    info="8d framing nails"
                    icon_type="Delivered"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="319, 331"
                    isDelivered={true}
                    date="07/10/2022"
                  />
                </AccordionItem>
              </Accordion>
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <Accordion allowMultiple>
                <AccordionItem borderBottom="none">
                  <CustomMTAccordionButton
                    date="Jul 19, 2022"
                    info="1/2-in Plywood for headers"
                    icon_type="On The Way"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="338, 312"
                    isDelivered={false}
                    date="07/23/2022"
                  />
                </AccordionItem>
                <AccordionItem borderBottom="none">
                  <CustomMTAccordionButton
                    date="Jul 19, 2022"
                    info="2 x 6 studs"
                    icon_type="Order Placed"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="338, 312"
                    isDelivered={false}
                    date="08/02/2022"
                  />
                </AccordionItem>
                <AccordionItem borderBottom="none">
                  <CustomMTAccordionButton
                    date="Jul 19, 2022"
                    info="20d framing nails"
                    icon_type="Delayed"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="338, 312"
                    isDelivered={false}
                    date="07/31/2022"
                  />
                </AccordionItem>
              </Accordion>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
};
