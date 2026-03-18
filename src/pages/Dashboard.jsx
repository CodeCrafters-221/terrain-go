import React from 'react';
import DashboardStats from '../sections/DashboardStats';
import DashboardCharts from '../sections/DashboardCharts';
import DashboardFields from '../sections/DashboardFields';
import DashboardBookings from '../sections/DashboardBookings';

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* KPI Stats Row */}
            <DashboardStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column (Charts & Fields) */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    {/* Charts Section */}
                    <DashboardCharts />

                    {/* Fields List */}
                    <DashboardFields />
                </div>

                {/* Right Column (Recent Bookings) */}
                <div className="xl:col-span-1">
                    <DashboardBookings />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
