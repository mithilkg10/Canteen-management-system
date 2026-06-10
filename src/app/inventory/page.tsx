import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import "./inventory.css";
// import InventoryClient from "./InventoryClient"; // We'll create this

export default async function InventoryPage() {
  const session = await getServerSession(authOptions);
  const items = await prisma.canteenInventory.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="inventory-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Manage your canteen stock and pricing</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      <div className="glass-panel table-container">
        <div className="table-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search inventory..." />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price Per Unit</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">No items in inventory.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.pricePerUnit.toFixed(2)}</td>
                    <td>₹{item.totalPrice.toFixed(2)}</td>
                    <td>
                      {item.quantity <= 10 ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon"><Edit2 size={16} /></button>
                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
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
