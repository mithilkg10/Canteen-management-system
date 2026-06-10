import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogIn, LogOut, Search } from "lucide-react";
import "./attendance.css";

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch today's attendance for the current user
  const userAttendance = await prisma.employeeAttendance.findFirst({
    where: {
      userId: session?.user?.id,
      date: {
        gte: today,
      }
    }
  });

  // Fetch all history for admins/managers, or just personal for staff
  const historyQuery = ["ADMIN", "MANAGER"].includes(session?.user?.role as string) 
    ? {} 
    : { userId: session?.user?.id };

  const history = await prisma.employeeAttendance.findMany({
    where: historyQuery,
    include: {
      user: {
        select: { username: true, role: true }
      }
    },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="attendance-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Attendance Management</h1>
          <p>Record and track daily attendance</p>
        </div>
      </div>

      <div className="attendance-action-card glass-panel">
        <div className="action-info">
          <h2>Today's Status</h2>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="action-buttons-large">
          <button 
            className="btn btn-primary check-in-btn" 
            disabled={!!userAttendance?.checkInTime}
          >
            <LogIn size={20} />
            {userAttendance?.checkInTime 
              ? `Checked In at ${new Date(userAttendance.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
              : "Check In"
            }
          </button>
          
          <button 
            className="btn btn-secondary check-out-btn"
            disabled={!userAttendance?.checkInTime || !!userAttendance?.checkOutTime}
          >
            <LogOut size={20} />
            {userAttendance?.checkOutTime 
              ? `Checked Out at ${new Date(userAttendance.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
              : "Check Out"
            }
          </button>
        </div>
      </div>

      <div className="glass-panel table-container">
        <div className="table-controls">
          <h3>Attendance History</h3>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search records..." />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Role</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">No attendance records found.</td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.user.username}</td>
                    <td><span className="role-badge">{record.user.role}</span></td>
                    <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</td>
                    <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</td>
                    <td>
                      {record.checkInTime && record.checkOutTime ? (
                        <span className="badge badge-success">Completed</span>
                      ) : record.checkInTime ? (
                        <span className="badge badge-warning" style={{background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)'}}>Active</span>
                      ) : (
                        <span className="badge badge-danger">Absent</span>
                      )}
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
