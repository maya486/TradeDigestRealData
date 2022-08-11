import { ReportHeader } from "../Structure";
import { StartLetterData } from "./StartLetterData";

export const StartLetters = ({ lots }) => {
  return (
    <>
      <ReportHeader text="Start Letters for This Week's Lots" />
      <div className="overflow-wrapper">
        <StartLetterData lots={lots} />
      </div>
    </>
  );
};
