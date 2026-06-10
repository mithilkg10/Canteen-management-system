import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Search, Activity } from "lucide-react";
import "./audit.css";

export default async function AuditLogsPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="unauthorized">
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 100 // Limit to recent 100 for performance
  });

  return (
    <div className="audit-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Security & Audit Logs</h1>
          <p>Monitor system activities and security events</p>
        </div>
        <div className="security-status badge badge-success">
          <Activity size={16} />
          System Secure
        </div>
      </div>

      <div className="glass-panel table-container">
        <div className="table-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search logs (e.g. username, action)..." />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action details</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">No audit logs found.</td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isHighSeverity = log.action.includes('DELETE') || log.action.includes('FAILED');
                  return (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-placeholder">{log.username.charAt(0).toUpperCase()}</div>
                          {log.username}
                        </div>
                      </td>
                      <td>{log.action}</td>
                      <td>
                        {isHighSeverity ? (
                          <span className="badge badge-danger">High</span>
                        ) : (
                          <span className="badge badge-success" style={{background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)'}}>Info</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
