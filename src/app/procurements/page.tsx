import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

export default async function ProcurementsPage() {
  const session = await getServerSession(authOptions);
  
  const procurements = await prisma.procurement.findMany({
    orderBy: { date: 'desc' },
    include: { vendor: true },
    take: 50
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Procurements Log</h1>
          <p>Track inventory intake and daily vendor expenditure.</p>
        </div>
        <button className="btn btn-primary glow-on-hover">
          <Plus size={18} />
          Log Procurement
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search items or vendors..." style={{ paddingLeft: '2.75rem', background: 'rgba(0,0,0,0.2)', width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '0.75rem', color: 'white' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Vendor</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Item Procured</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Quantity</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Total Cost</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {procurements.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No procurements logged.</td>
                </tr>
              ) : (
                procurements.map(proc => (
                  <tr key={proc.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }} className="hover-lift">
                    <td style={{ padding: '1.25rem 1.5rem' }}>{new Date(proc.date).toLocaleDateString()}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{proc.vendor.name}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>{proc.itemName}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>{proc.quantity} Units</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontFamily: 'monospace' }}>
                        ₹{proc.totalCost.toLocaleString('en-IN')}
                      </span>
                    </td>
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
