// Receipt generation utilities
import { Order } from '@/types';

export function generateReceipt(order: Order): string {
  const createdDate = new Date(order.createdAt);
  const totalPrepTime = order.items.reduce((sum, item) => sum + item.prepTime, 0);
  
  let receipt = `
╔════════════════════════════════════════╗
║         KITCHENOS RESTAURANT           ║
║           ORDER RECEIPT                ║
╚════════════════════════════════════════╝

Order ID: ${order.id}
Table Number: ${order.tableNumber}
Status: ${order.status.toUpperCase()}
Priority Score: ${order.priorityScore.toFixed(1)}

Date: ${createdDate.toLocaleDateString()}
Time: ${createdDate.toLocaleTimeString()}

────────────────────────────────────────
ITEMS:
────────────────────────────────────────
`;

  order.items.forEach((item, index) => {
    receipt += `${index + 1}. ${item.name}\n`;
    receipt += `   Qty: ${item.quantity}  Prep: ${item.prepTime} min\n\n`;
  });

  receipt += `────────────────────────────────────────
SUMMARY:
────────────────────────────────────────
Total Items: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}
Est. Prep Time: ${totalPrepTime} minutes
`;

  if (order.startedAt) {
    receipt += `Started: ${new Date(order.startedAt).toLocaleTimeString()}\n`;
  }

  if (order.dispatchedAt) {
    receipt += `Dispatched: ${new Date(order.dispatchedAt).toLocaleTimeString()}\n`;
  }

  if (order.countdownTimer !== null) {
    const minutes = Math.floor(order.countdownTimer / 60);
    const seconds = order.countdownTimer % 60;
    receipt += `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}\n`;
  }

  receipt += `
────────────────────────────────────────
       Thank you for your order!
        Powered by KitchenOS
────────────────────────────────────────
`;

  return receipt;
}

export function downloadReceipt(order: Order) {
  const receipt = generateReceipt(order);
  const blob = new Blob([receipt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${order.id}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printReceipt(order: Order) {
  const receipt = generateReceipt(order);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - Order ${order.id}</title>
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
        <body>${receipt}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
