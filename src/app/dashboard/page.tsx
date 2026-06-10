import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign, TrendingUp, ShoppingCart, Truck } from "lucide-react";
import "./dashboard.css";
import { DashboardCharts } from "./DashboardCharts";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Financial calculations
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 1. Total Procurements (Spending) over last 7 days
  const recentProcurements = await prisma.procurement.findMany({
    where: { date: { gte: sevenDaysAgo } },
    orderBy: { date: 'asc' }
  });

  const totalSpending = recentProcurements.reduce((sum, p) => sum + p.totalCost, 0);

  // Aggregate procurement data by date for chart
  const spendByDate = recentProcurements.reduce((acc: any, p) => {
    const dateStr = new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[dateStr] = (acc[dateStr] || 0) + p.totalCost;
    return acc;
  }, {});

  const procurementChartData = Object.keys(spendByDate).map(date => ({
    date,
    spend: spendByDate[date]
  }));

  // 2. Total Daily Orders (Revenue) over last 7 days
  const recentOrders = await prisma.dailyOrder.findMany({
    where: { date: { gte: sevenDaysAgo } },
    orderBy: { date: 'asc' }
  });

  const totalRevenue = recentOrders.reduce((sum, o) => sum + o.totalRevenue, 0);
  const totalBreakfast = recentOrders.reduce((sum, o) => sum + o.breakfastCount, 0);
  const totalLunch = recentOrders.reduce((sum, o) => sum + o.lunchCount, 0);
  const totalDinner = recentOrders.reduce((sum, o) => sum + o.dinnerCount, 0);
  const totalTea = recentOrders.reduce((sum, o) => sum + o.teaCount, 0);
  const totalMealsServed = totalBreakfast + totalLunch + totalDinner + totalTea;

  const mealBreakdownData = [
    { name: 'Breakfast', value: totalBreakfast, fill: '#f59e0b' },
    { name: 'Lunch', value: totalLunch, fill: '#d97706' },
    { name: 'Dinner', value: totalDinner, fill: '#10b981' },
    { name: 'Tea/Snacks', value: totalTea, fill: '#ef4444' }
  ];
  
  // Assuming a rough estimated profit margin of 35% for visualization (Revenue - Estimated Fixed Cost)
  const estimatedProfit = totalRevenue - totalSpending;

  // Aggregate order data by date for chart
  const ordersByDate = recentOrders.reduce((acc: any, o) => {
    const dateStr = new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = { revenue: 0, profit: 0 };
    acc[dateStr].revenue += o.totalRevenue;
    return acc;
  }, {});

  // For profit chart, we subtract daily average spending from daily revenue to get a mock daily profit
  const dailyAverageSpend = totalSpending / 7 || 0;
  const orderChartData = Object.keys(ordersByDate).map(date => ({
    date,
    revenue: ordersByDate[date].revenue,
    profit: Math.max(0, ordersByDate[date].revenue - dailyAverageSpend)
  }));

  // 3. Inventory Stock Levels for Radial Chart
  const topInventory = await prisma.canteenInventory.findMany({
    take: 5,
    orderBy: { quantity: 'asc' } // Show lowest stock first
  });

  const inventoryChartData = topInventory.map((item, index) => {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    return {
      name: item.itemName.length > 15 ? item.itemName.substring(0, 15) + '...' : item.itemName,
      quantity: item.quantity,
      fill: colors[index % colors.length]
    };
  });

  // 4. Live Activity Feed
  const recentLogs = await prisma.auditLog.findMany({
    take: 6,
    orderBy: { timestamp: 'desc' }
  });

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h1>JK Catering Overview</h1>
        <p>Welcome back, {session?.user?.name} | Financial Summary (Last 7 Days)</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card glass-panel animate-delay-1" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <div className="kpi-icon-wrapper blue">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <h3>7-Day Revenue</h3>
            <p className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="kpi-card glass-panel animate-delay-1" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="kpi-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
            <Truck size={24} />
          </div>
          <div className="kpi-content">
            <h3>Procurement Spends</h3>
            <p className="kpi-value">₹{totalSpending.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="kpi-card glass-panel animate-delay-1" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="kpi-icon-wrapper green">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <h3>Est. Net Profit</h3>
            <p className="kpi-value">₹{estimatedProfit.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="kpi-card glass-panel animate-delay-1" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="kpi-icon-wrapper purple">
            <ShoppingCart size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Meals Served</h3>
            <p className="kpi-value">{totalMealsServed.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <DashboardCharts 
        orderData={orderChartData} 
        procurementData={procurementChartData} 
        mealBreakdownData={mealBreakdownData}
        inventoryChartData={inventoryChartData}
        recentLogs={recentLogs}
      />
    </div>
  );
}
