// Buy list generation utilities
import { InventoryItem } from '@/types';

export function generateBuyList(inventory: InventoryItem[]): string {
  // Filter items below 30% stock
  const lowStockItems = inventory.filter(item => item.stockLevel < 30);
  
  // Sort by stock level (lowest first)
  const sortedItems = [...lowStockItems].sort((a, b) => a.stockLevel - b.stockLevel);

  const currentDate = new Date();
  
  let buyList = `
╔════════════════════════════════════════╗
║         KITCHENOS RESTAURANT           ║
║          SHOPPING BUY LIST             ║
╚════════════════════════════════════════╝

Generated: ${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}

────────────────────────────────────────
ITEMS TO PURCHASE (Stock < 30%)
────────────────────────────────────────

`;

  if (sortedItems.length === 0) {
    buyList += `✅ All inventory levels are healthy!\n   No items need restocking at this time.\n`;
  } else {
    buyList += `⚠️  ${sortedItems.length} item${sortedItems.length > 1 ? 's' : ''} need${sortedItems.length === 1 ? 's' : ''} restocking:\n\n`;
    
    sortedItems.forEach((item, index) => {
      const urgency = item.stockLevel === 0 ? '🔴 CRITICAL' : 
                      item.stockLevel < 10 ? '🔴 URGENT' : 
                      item.stockLevel < 20 ? '🟠 HIGH' : '🟡 MEDIUM';
      
      buyList += `${index + 1}. ${item.itemName}\n`;
      buyList += `   Current Stock: ${item.stockLevel}% ${urgency}\n`;
      buyList += `   Reorder Point: ${item.reorderPoint}%\n`;
      buyList += `   Unit: ${item.unit}\n`;
      buyList += `   [ ] Ordered  [ ] Received\n\n`;
    });
  }

  buyList += `────────────────────────────────────────
SUMMARY:
────────────────────────────────────────
`;

  const criticalItems = sortedItems.filter(item => item.stockLevel === 0);
  const urgentItems = sortedItems.filter(item => item.stockLevel > 0 && item.stockLevel < 10);
  const highPriorityItems = sortedItems.filter(item => item.stockLevel >= 10 && item.stockLevel < 20);
  const mediumPriorityItems = sortedItems.filter(item => item.stockLevel >= 20 && item.stockLevel < 30);

  if (criticalItems.length > 0) {
    buyList += `🔴 Critical (0%): ${criticalItems.length}\n`;
  }
  if (urgentItems.length > 0) {
    buyList += `🔴 Urgent (<10%): ${urgentItems.length}\n`;
  }
  if (highPriorityItems.length > 0) {
    buyList += `🟠 High (10-19%): ${highPriorityItems.length}\n`;
  }
  if (mediumPriorityItems.length > 0) {
    buyList += `🟡 Medium (20-29%): ${mediumPriorityItems.length}\n`;
  }

  buyList += `
────────────────────────────────────────
NOTES:
────────────────────────────────────────
• Priority items marked with 🔴 need
  immediate attention
• Check with suppliers for availability
• Update stock levels after receiving

────────────────────────────────────────
       Powered by KitchenOS
────────────────────────────────────────
`;

  return buyList;
}

export function downloadBuyList(inventory: InventoryItem[]) {
  const buyList = generateBuyList(inventory);
  const blob = new Blob([buyList], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `buy-list-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printBuyList(inventory: InventoryItem[]) {
  const buyList = generateBuyList(inventory);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Buy List - ${new Date().toLocaleDateString()}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              white-space: pre;
              padding: 20px;
              font-size: 12px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>${buyList}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
