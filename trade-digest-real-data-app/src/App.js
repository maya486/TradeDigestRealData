import "./App.css";
import { StartLetters } from "./components/StartLetters";
import { MaterialTracking } from "./components/MaterialTracking";
import { PayPeriod } from "./components/PayPeriod";
import { Notifications } from "./components/Notifications";
import { Schedule } from "./components/Schedule";
import { useState } from "react";
import { Header } from "./components/Header";
import { ChakraProvider } from "@chakra-ui/react";
import { VendorInfo } from "./components/VendorInfo";

export function App() {
  const [lots, setLots] = useState([]);
  const [name, setName] = useState("");
  return (
    <ChakraProvider>
      <div className="App">
        <Header />
        <VendorInfo setName={setName} />
        <Notifications />
        <PayPeriod lots={lots} />
        <Schedule name={name} setLots={setLots} />
        <StartLetters lots={lots} />
        <MaterialTracking />
      </div>
    </ChakraProvider>
  );
}
