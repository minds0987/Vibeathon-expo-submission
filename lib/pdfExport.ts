// PDF export utilities using jsPDF
import { Order, InventoryItem } from '@/types';

// Dynamic import for jsPDF (client-side only)
let jsPDF: any = null;

async function loadJsPDF() {
  if (typeof window !== 'undefined' && !jsPDF) {
    const module = await import('jspdf');
    jsPDF = module.default;
  }
  return jsPDF;
}

export async function exportReceiptToPDF(order: Order) {
  const PDF = await loadJsPDF();
  const doc = new PDF();
  
  const createdDate = new Date(order.createdAt);
  const totalPrepTime = order.items.reduce((sum, item) => sum + item.prepTime, 0);
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('KITCHENOS RESTAURANT', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('ORDER RECEIPT', 105, 30, { align: 'center' });
  
  // Order Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let y = 45;
  
  doc.text(`Order ID: ${order.id}`, 20, y);
  y += 7;
  doc.text(`Table Number: ${order.tableNumber}`, 20, y);
  y += 7;
  doc.text(`Status: ${order.status.toUpperCase()}`, 20, y);
  y += 7;
  doc.text(`Priority Score: ${order.priorityScore.toFixed(1)}`, 20, y);
  y += 7;
  doc.text(`Date: ${createdDate.toLocaleDateString()}`, 20, y);
  y += 7;
  doc.text(`Time: ${createdDate.toLocaleTimeString()}`, 20, y);
  
  // Items section
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('ITEMS:', 20, y);
  y += 7;
  
  doc.setFont('helvetica', 'normal');
  order.items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.name}`, 25, y);
    y += 6;
    doc.text(`   Qty: ${item.quantity}  Prep: ${item.prepTime} min`, 25, y);
    y += 8;
  });
  
  // Summary
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY:', 20, y);
  y += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Items: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}`, 20, y);
  y += 7;
  doc.text(`Est. Prep Time: ${totalPrepTime} minutes`, 20, y);
  
  if (order.startedAt) {
    y += 7;
    doc.text(`Started: ${new Date(order.startedAt).toLocaleTimeString()}`, 20, y);
  }
  
  if (order.dispatchedAt) {
    y += 7;
    doc.text(`Dispatched: ${new Date(order.dispatchedAt).toLocaleTimeString()}`, 20, y);
  }
  
  // Footer
  y += 15;
  doc.setFontSize(8);
  doc.text('Thank you for your order!', 105, y, { align: 'center' });
  y += 5;
  doc.text('Powered by KitchenOS', 105, y, { align: 'center' });
  
  // Save PDF
  doc.save(`receipt-${order.id}-${Date.now()}.pdf`);
}

export async function exportBuyListToPDF(inventory: InventoryItem[]) {
  const PDF = await loadJsPDF();
  const doc = new PDF();
  
  const lowStockItems = inventory.filter(item => item.stockLevel < 30);
  const sortedItems = [...lowStockItems].sort((a, b) => a.stockLevel - b.stockLevel);
  const currentDate = new Date();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('KITCHENOS RESTAURANT', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('SHOPPING BUY LIST', 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`, 105, 40, { align: 'center' });
  
  let y = 55;
  
  if (sortedItems.length === 0) {
    doc.text('✓ All inventory levels are healthy!', 20, y);
    y += 7;
    doc.text('No items need restocking at this time.', 20, y);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.text(`ITEMS TO PURCHASE (Stock < 30%)`, 20, y);
    y += 10;
    
    doc.setFont('helvetica', 'normal');
    sortedItems.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      const urgency = item.stockLevel === 0 ? 'CRITICAL' : 
                      item.stockLevel < 10 ? 'URGENT' : 
                      item.stockLevel < 20 ? 'HIGH' : 'MEDIUM';
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${item.itemName}`, 20, y);
      y += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Current Stock: ${item.stockLevel}% - ${urgency}`, 25, y);
      y += 6;
      doc.text(`Reorder Point: ${item.reorderPoint}%`, 25, y);
      y += 6;
      doc.text(`Unit: ${item.unit}`, 25, y);
      y += 10;
    });
    
    // Summary
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY:', 20, y);
    y += 7;
    
    doc.setFont('helvetica', 'normal');
    const criticalItems = sortedItems.filter(item => item.stockLevel === 0);
    const urgentItems = sortedItems.filter(item => item.stockLevel > 0 && item.stockLevel < 10);
    const highPriorityItems = sortedItems.filter(item => item.stockLevel >= 10 && item.stockLevel < 20);
    const mediumPriorityItems = sortedItems.filter(item => item.stockLevel >= 20 && item.stockLevel < 30);
    
    if (criticalItems.length > 0) {
      doc.text(`Critical (0%): ${criticalItems.length}`, 20, y);
      y += 6;
    }
    if (urgentItems.length > 0) {
      doc.text(`Urgent (<10%): ${urgentItems.length}`, 20, y);
      y += 6;
    }
    if (highPriorityItems.length > 0) {
      doc.text(`High (10-19%): ${highPriorityItems.length}`, 20, y);
      y += 6;
    }
    if (mediumPriorityItems.length > 0) {
      doc.text(`Medium (20-29%): ${mediumPriorityItems.length}`, 20, y);
      y += 6;
    }
  }
  
  // Footer
  doc.setFontSize(8);
  doc.text('Powered by KitchenOS', 105, 285, { align: 'center' });
  
  // Save PDF
  doc.save(`buy-list-${currentDate.toISOString().split('T')[0]}.pdf`);
}
