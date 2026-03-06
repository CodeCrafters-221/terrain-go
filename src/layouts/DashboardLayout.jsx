import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import { DashboardProvider } from '../context/DashboardContext';
import CreateFieldModal from '../components/CreateFieldModal';
import EditFieldModal from '../components/EditFieldModal';

const DashboardLayoutContent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display overflow-x-hidden relative">
            {/* Side Navigation */}
            <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
                <DashboardHeader onMenuClick={toggleSidebar} />

                <div className="flex-1 px-4 md:px-8 py-6 md:py-8 w-full max-w-[1400px] mx-auto flex flex-col gap-6 md:gap-8">
                    <Outlet />
                </div>
            </main>
            <CreateFieldModal />
            <EditFieldModal />
        </div>
    );
};

const DashboardLayout = () => {
    return (
        <DashboardProvider>
            <DashboardLayoutContent />
        </DashboardProvider>
    );
};

export default DashboardLayout;
