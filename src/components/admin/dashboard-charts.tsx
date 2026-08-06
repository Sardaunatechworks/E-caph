'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Monthly Beneficiary Reach & Engagement Data
const reachData = [
  { month: 'Mar', beneficiaries: 14200, storiesViewed: 8400 },
  { month: 'Apr', beneficiaries: 18500, storiesViewed: 11200 },
  { month: 'May', beneficiaries: 22100, storiesViewed: 14800 },
  { month: 'Jun', beneficiaries: 26400, storiesViewed: 19100 },
  { month: 'Jul', beneficiaries: 31000, storiesViewed: 24500 },
  { month: 'Aug', beneficiaries: 38200, storiesViewed: 29800 },
];

// Content & Projects Focus Area Distribution
const pillarData = [
  { name: 'Adolescent Health', projects: 12, Color: '#0092DF' },
  { name: 'Peace Building', projects: 9, Color: '#86C127' },
  { name: 'Youth Empowerment', projects: 7, Color: '#E67817' },
  { name: 'Climate & Health', projects: 5, Color: '#005A8D' },
];

// Inbox Inquiry Status Distribution
const inquiryStatusData = [
  { name: 'New Inquiries', value: 38, color: '#0092DF' },
  { name: 'In Progress', value: 45, color: '#E67817' },
  { name: 'Resolved', value: 112, color: '#86C127' },
];

export function BeneficiariesReachChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={reachData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBeneficiaries" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0092DF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0092DF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorStories" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#86C127" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#86C127" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="beneficiaries"
            name="Beneficiaries Reached"
            stroke="#0092DF"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorBeneficiaries)"
          />
          <Area
            type="monotone"
            dataKey="storiesViewed"
            name="Media & Story Views"
            stroke="#86C127"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorStories)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PillarsDistributionChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={pillarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="projects" name="Active Initiatives" radius={[6, 6, 0, 0]}>
            {pillarData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.Color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InquiryStatusChart() {
  return (
    <div className="w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={inquiryStatusData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={5}
            dataKey="value"
          >
            {inquiryStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
