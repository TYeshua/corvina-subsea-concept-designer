import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Architecture } from "./pages/Architecture";
import { Calculations } from "./pages/Calculations";
import { Dashboard } from "./pages/Dashboard";
import { Demo } from "./pages/Demo";
import { DigitalTwin3D } from "./pages/DigitalTwin3D";
import { FieldData } from "./pages/FieldData";
import { Home } from "./pages/Home";
import { Layout2D } from "./pages/Layout2D";
import { Report } from "./pages/Report";

export default function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/field-data" element={<FieldData />} />
          <Route path="/calculations" element={<Calculations />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/layout-2d" element={<Layout2D />} />
          <Route path="/digital-twin-3d" element={<DigitalTwin3D />} />
          <Route path="/report" element={<Report />} />
          <Route path="/demo" element={<Demo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
