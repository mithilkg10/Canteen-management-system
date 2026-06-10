import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, Coffee, Utensils, Moon, CupSoda } from "lucide-react";
import "./orders.css";

export default async function DailyOrdersPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch latest daily orders
  const orders = await prisma.dailyOrder.findMany({
    include: {
      company: true,
    },
    orderBy: { date: 'desc' },
    take: 50
  });

  return (
    <div className="orders-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Daily Indents & Orders</h1>
          <p>Track client catering requests and calculate daily revenue</p>
        </div>
        <button className="btn btn-primary glow-on-hover">
          <Plus size={18} />
          New Daily Indent
        </button>
      </div>

      <div className="glass-panel table-container">
        <div className="table-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search by company..." />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client Company</th>
                <th><div className="meal-header"><Coffee size={16}/> Breakfast</div></th>
                <th><div className="meal-header"><Utensils size={16}/> Lunch</div></th>
                <th><div className="meal-header"><CupSoda size={16}/> Tea/Snacks</div></th>
                <th><div className="meal-header"><Moon size={16}/> Dinner</div></th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">No orders recorded yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover-lift">
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td className="font-bold">{order.company.name}</td>
                    <td>{order.breakfastCount} <span className="text-muted text-sm">(@₹{order.company.breakfastRate})</span></td>
                    <td>{order.lunchCount} <span className="text-muted text-sm">(@₹{order.company.lunchRate})</span></td>
                    <td>{order.teaCount} <span className="text-muted text-sm">(@₹{order.company.teaRate})</span></td>
                    <td>{order.dinnerCount} <span className="text-muted text-sm">(@₹{order.company.dinnerRate})</span></td>
                    <td>
                      <span className="revenue-badge">
                        ₹{order.totalRevenue.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
