import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#231a10] border border-[#493622] p-4 rounded-xl shadow-2xl">
        <p className="text-[#cbad90] text-xs font-bold uppercase mb-1">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => {
            if (!entry || entry.value === undefined || entry.value === null)
              return null;
            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <p className="text-white text-sm font-bold">
                  <span className="text-[#cbad90] font-medium mr-1">
                    {entry.dataKey === "singleRevenue"
                      ? "Matchs Uniques:"
                      : entry.dataKey === "subRevenue"
                        ? "Abonnements:"
                        : "Fréquentation:"}
                  </span>
                  {entry.value?.toLocaleString() || "0"}
                  <span className="text-[10px] font-normal text-[#cbad90] ml-1">
                    {entry.dataKey?.includes("Revenue") ? "CFA" : "rés."}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const RechartsBarChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest">
            Analyse des données...
          </span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#493622"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#cbad90", fontSize: 10, fontWeight: 700 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#cbad90", fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="players" fill="#f27f0d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const RechartsAreaChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest">
            Analyse des données...
          </span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
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
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#493622"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#cbad90", fontSize: 10, fontWeight: 700 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#cbad90", fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="singleRevenue"
          stroke="#f27f0d"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorSingle)"
          animationDuration={1500}
        />
        <Area
          type="monotone"
          dataKey="subRevenue"
          stroke="#3b82f6"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorSub)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const RechartsPieChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest">
            Chargement...
          </span>
        </div>
      </div>
    );
  }

  const COLORS = ["#f27f0d", "#cbad90", "#493622", "#7d5a37", "#a67c52"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const RechartsBarChartStats = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest">
            Chargement...
          </span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#493622" />
        <XAxis dataKey="name" tick={{ fill: "#cbad90", fontSize: 12 }} />
        <YAxis tick={{ fill: "#cbad90", fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#f27f0d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
