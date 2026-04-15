// Receipt generation utilities
import { Order } from '@/types';

// Generate a simple ASCII barcode representation
function generateASCIIBarcode(orderId: string): string {
  // Simple barcode representation using | and spaces
  const barcodeChars = orderId.split('').map(char => {
    const code = char.charCodeAt(0);
    return code % 2 === 0 ? '||' : '| |';
  }).join(' ');
  
  return `
    ╔════════════════════════════════════════╗
    ║  ${barcodeChars}  ║
    ║           ${orderId}           ║
    ╚════════════════════════════════════════╝
  `;
}

export function generateReceipt(order: Order): string {
  const createdDate = new Date(order.createdAt);
  const totalPrepTime = order.items.reduce((sum, item) => sum + item.prepTime, 0);
  
  let receipt = `
╔════════════════════════════════════════╗
║         KITCHENOS RESTAURANT           ║
║           ORDER RECEIPT                ║
╚════════════════════════════════════════╝

${generateASCIIBarcode(order.id)}

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
SCAN INSTRUCTIONS:
────────────────────────────────────────
Use the Kitchen Display Scanner to scan
the barcode above and update order status.

Order ID: ${order.id}

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
            .barcode-container {
              text-align: center;
              margin: 20px 0;
            }
            .barcode-svg {
              margin: 10px auto;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${receipt}
          <div class="barcode-container">
            <svg class="barcode-svg" id="barcode-${order.id}"></svg>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            try {
              JsBarcode("#barcode-${order.id}", "${order.id}", {
                format: "CODE128",
                width: 2,
                height: 50,
                displayValue: true,
                fontSize: 14,
                margin: 10
              });
            } catch(e) {
              console.error('Barcode generation failed:', e);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for barcode to render before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
