import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, Edit2, Trash2, Briefcase } from "lucide-react";

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  
  const clients = await prisma.clientCompany.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Client Companies & Rates</h1>
          <p>Manage your B2B clients and their custom meal pricing.</p>
        </div>
        <button className="btn btn-primary glow-on-hover">
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search clients..." style={{ paddingLeft: '2.75rem', background: 'rgba(0,0,0,0.2)', width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '0.75rem', color: 'white' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Client Name</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Breakfast Rate</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Lunch Rate</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Dinner Rate</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Tea Rate</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No clients configured.</td>
                </tr>
              ) : (
                clients.map(client => (
                  <tr key={client.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }} className="hover-lift">
                    <td style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Briefcase size={16} />
                      </div>
                      {client.name}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'monospace' }}>₹{client.breakfastRate.toFixed(2)}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'monospace' }}>₹{client.lunchRate.toFixed(2)}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'monospace' }}>₹{client.dinnerRate.toFixed(2)}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'monospace' }}>₹{client.teaRate.toFixed(2)}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}><Edit2 size={16} /></button>
                        <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={16} /></button>
                      </div>
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
