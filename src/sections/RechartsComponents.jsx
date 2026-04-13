import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#231a10] border border-[#493622] p-4 rounded-xl shadow-2xl">
        <p className="text-[#cbad90] text-xs font-bold uppercase mb-1">
          {label}
        </p>

        {payload.map((entry, index) => (
          <p key={index} className="text-white text-sm font-bold">
            {entry.name} : {entry.value?.toLocaleString()} CFA
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RechartsAreaChart = ({ data, isLoading }) => {
  if (isLoading) return null;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        {/* GRADIENTS */}
        <defs>
          <linearGradient id="colorSingle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f27f0d" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f27f0d" stopOpacity={0} />
          </linearGradient>

          <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#493622" />

        <XAxis dataKey="name" tick={{ fill: "#cbad90", fontSize: 10 }} />

        <YAxis tick={{ fill: "#cbad90", fontSize: 10 }} />

        <Tooltip content={<CustomTooltip />} />

        {/* 🔥 TES 2 COURBES */}
        <Area
          type="monotone"
          dataKey="singleRevenue"
          stroke="#f27f0d"
          fill="url(#colorSingle)"
          strokeWidth={3}
        />

        <Area
          type="monotone"
          dataKey="subRevenue"
          stroke="#3b82f6"
          fill="url(#colorSub)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
