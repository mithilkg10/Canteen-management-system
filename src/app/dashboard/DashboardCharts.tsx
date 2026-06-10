"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { Activity, Clock } from 'lucide-react';

export function DashboardCharts({ 
  orderData, 
  procurementData,
  mealBreakdownData,
  inventoryChartData,
  recentLogs
}: { 
  orderData: any[], 
  procurementData: any[],
  mealBreakdownData: any[],
  inventoryChartData: any[],
  recentLogs: any[]
}) {
  return (
    <>
      <div className="dashboard-charts">
        {/* Chart 1: Revenue vs Profit */}
        <div className="chart-card glass-panel animate-delay-2">
          <h2>Daily Revenue vs Profit (Last 7 Days)</h2>
          <div className="chart-container" style={{ width: '100%', overflowX: 'auto' }}>
              <BarChart width={700} height={300} data={orderData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" name="Total Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="url(#colorProfit)" name="Est. Profit" radius={[4, 4, 0, 0]} />
                
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
          </div>
        </div>

        {/* Chart 2: Meal Demand Donut */}
        <div className="chart-card glass-panel animate-delay-2">
          <h2>Meal Demand Breakdown</h2>
          <div className="chart-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart width={400} height={300}>
              <Pie
                data={mealBreakdownData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {mealBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', color: '#fff' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </div>
        </div>

        {/* Chart 3: Procurement Area Chart */}
        <div className="chart-card glass-panel animate-delay-3">
          <h2>Procurement Spending Trends</h2>
          <div className="chart-container" style={{ width: '100%', overflowX: 'auto' }}>
              <AreaChart width={700} height={300} data={procurementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', color: '#fff' }} 
                />
                <Area type="monotone" dataKey="spend" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpend)" name="Total Spend" strokeWidth={3} />
              </AreaChart>
          </div>
        </div>

        {/* Chart 4: Critical Inventory Radial Bar */}
        <div className="chart-card glass-panel animate-delay-3">
          <h2>Critical Inventory (Lowest Stock)</h2>
          <div className="chart-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <RadialBarChart width={400} height={300} cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={15} data={inventoryChartData}>
              <RadialBar
                minAngle={15}
                background={{ fill: 'rgba(255,255,255,0.05)' }}
                clockWise
                dataKey="quantity"
                cornerRadius={10}
              />
              <Tooltip 
                contentStyle={{ background: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', color: '#fff' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            </RadialBarChart>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="live-feed-card glass-panel animate-delay-3" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="live-indicator">
            <span className="pulse-dot"></span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--accent-primary)" />
            Live System Activity
          </h2>
        </div>
        
        <div className="activity-list">
          {recentLogs.map((log: any) => (
            <div key={log.id} className="activity-item">
              <div className="activity-icon">
                <Clock size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-action">
                  <strong>{log.username}</strong>: {log.action}
                </p>
                <span className="activity-time">
                  {new Date(log.timestamp).toLocaleTimeString()} - {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {recentLogs.length === 0 && <p style={{color: 'var(--text-muted)'}}>No recent activity.</p>}
        </div>
      </div>
    </>
  );
}
