import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Overview from "../sections/Dashboard/Overview";
import MyTerrains from "../sections/Dashboard/MyTerrains";
import Reservations from "../sections/Dashboard/Reservations";

function Dashboard() {
  return (
    <DashboardLayout>
      <Overview />
      <MyTerrains />
      <Reservations />
    </DashboardLayout>
  );
}

export default Dashboard;
