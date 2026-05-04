import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Guide from "./Guide";

export default function AppShell() {
  return (
    <div className="app-bg min-h-screen">
      <div className="phone-frame">
      <div className="page-wrap">
        <Outlet />
      </div>
      <BottomNav />
      <Guide />
      </div>
    </div>
  );
}
