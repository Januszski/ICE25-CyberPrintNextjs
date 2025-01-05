"use client";

import { Stwipez } from "../components/stwipez";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { PrinterIcon as Printer3D, Package, Truck } from "lucide-react";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Complex background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFhMjAzYSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIgc3Ryb2tlPSIjMmE0MjdmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPjwvY2lyY2xlPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxMCIgc3Ryb2tlPSIjM2E2M2JmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPjwvY2lyY2xlPgo8bGluZSB4MT0iMzAiIHkxPSIwIiB4Mj0iMzAiIHkyPSI2MCIgc3Ryb2tlPSIjMmE0MjdmIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT4KPGxpbmUgeDE9IjAiIHkxPSIzMCIgeDI9IjYwIiB5Mj0iMzAiIHN0cm9rZT0iIzJhNDI3ZiIgc3Ryb2tlLXdpZHRoPSIxIj48L2xpbmU+Cjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl font-bold text-center mb-12 text-white tracking-tight">
          Complete Your 3D Printing Order 🖨️
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">3D Model Printing</span>
                    <span>$149.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Material Cost</span>
                    <span>$29.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service Fee</span>
                    <span>$20.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-blue-500/30">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">$199.98</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  What&apos;s Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Printer3D className="h-6 w-6 mr-3 text-blue-400" />
                    <span>
                      We&apos;ll start printing your 3D model with precision
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-6 w-6 mr-3 text-blue-400" />
                    <span>
                      Your printed model will be carefully inspected and
                      packaged
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-6 w-6 mr-3 text-blue-400" />
                    <span>Express shipping to your doorstep</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Stwipez />
          </div>
        </div>
      </div>
    </div>
  );
}
