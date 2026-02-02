import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display overflow-x-hidden">
            {/* Side Navigation */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
                <DashboardHeader />

                <div className="flex-1 px-8 py-8 w-full max-w-[1400px] mx-auto flex flex-col gap-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
