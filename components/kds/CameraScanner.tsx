'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { OrderStatus } from '@/types';

interface CameraScannerProps {
  onClose: () => void;
  onScan: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'quality_check', label: 'Quality Check' },
  { value: 'ready', label: 'Ready' },
  { value: 'dispatched', label: 'Dispatched' },
];

export function CameraScanner({ onClose, onScan }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('cooking');
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        
        // Start scanning loop
        scanIntervalRef.current = setInterval(() => {
          scanFrame();
        }, 500); // Scan every 500ms
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setCameraActive(false);
  };

  const scanFrame = async () => {
    if (!videoRef.current || !canvasRef.current || scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for barcode detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple barcode detection (looking for order ID pattern)
    // In production, use a library like @zxing/library or quagga2
    const detectedCode = await detectBarcodeFromImageData(imageData);
    
    if (detectedCode && detectedCode !== lastScanned) {
      setLastScanned(detectedCode);
      handleDetectedCode(detectedCode);
    }
  };

  const detectBarcodeFromImageData = async (imageData: ImageData): Promise<string | null> => {
    // This is a placeholder for actual barcode detection
    // In production, integrate with @zxing/library or similar
    // For now, we'll use a simple pattern matching approach
    
    // You would typically use a library here like:
    // const codeReader = new BrowserMultiFormatReader();
    // const result = await codeReader.decodeFromImageData(imageData);
    
    return null; // Placeholder
  };

  const handleDetectedCode = async (code: string) => {
    if (scanning) return;
    
    setScanning(true);
    try {
      await onScan(code, targetStatus);
      setLastScanned(code);
      
      // Visual feedback
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 5;
          ctx.strokeRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      
      // Auto-close after successful scan
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Failed to process scanned code:', error);
      setError('Failed to process barcode. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleManualInput = async (code: string) => {
    if (!code.trim()) return;
    
    setScanning(true);
    try {
      await onScan(code.trim(), targetStatus);
      onClose();
    } catch (error) {
      console.error('Failed to process code:', error);
      setError('Failed to process order ID. Please check and try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-100">📷 Camera Scanner</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Camera View */}
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ mixBlendMode: 'screen' }}
            />
            
            {/* Scanning overlay */}
            {cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-48 border-4 border-lime-400 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-lime-400"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-lime-400"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-lime-400"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-lime-400"></div>
                  
                  {/* Scanning line animation */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="w-full h-1 bg-lime-400 animate-scan"></div>
                  </div>
                </div>
              </div>
            )}
            
            {!cameraActive && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white">Starting camera...</p>
              </div>
            )}
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Move scanned orders to:
            </label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-lime-400"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-300">⚠️ {error}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            <p className="text-sm text-blue-300">
              <strong>Instructions:</strong> Point your camera at the barcode on the receipt. 
              The order will be automatically scanned and moved to the selected status.
            </p>
          </div>

          {/* Manual Input Fallback */}
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Can't scan? Enter order ID manually:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter order ID"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualInput((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <Button
                variant="secondary"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  handleManualInput(input.value);
                }}
                disabled={scanning}
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={scanning}
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
      
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(192px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
