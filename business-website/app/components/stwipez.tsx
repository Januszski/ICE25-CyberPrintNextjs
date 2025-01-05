"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Printer, LockIcon, CreditCard, LogIn, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";

// Mock saved cards data
const savedCards = [
  { id: 1, last4: "4242", brand: "Visa" },
  { id: 2, last4: "5555", brand: "Mastercard" },
];

export function Stwipez() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock order details
    const orderDetails = {
      orderId: Math.random().toString(36).substr(2, 9),
      amount: 199.98,
      cardLast4:
        selectedCard === "new"
          ? cardNumber.slice(-4)
          : savedCards.find((card) => card.id.toString() === selectedCard)
              ?.last4,
    };

    // Redirect to thank you page with order details
    router.push(
      `/thankyou?${new URLSearchParams(orderDetails as Record<string, string>).toString()}`,
    );
  };

  const handleSignIn = () => {
    // Mock sign-in process
    setIsSignedIn(true);
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <Printer className="mr-2 h-6 w-6 text-blue-400" />
            Stwipez Payment
          </span>
          <LockIcon className="h-5 w-5 text-green-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isSignedIn && (
          <div className="mb-6">
            <Button
              onClick={handleSignIn}
              className="w-full mb-2 bg-blue-600 hover:bg-blue-700"
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
            <p className="text-center text-sm text-blue-200">
              or continue as guest
            </p>
          </div>
        )}
        {isSignedIn && savedCards.length > 0 && (
          <div className="mb-6">
            <Label className="text-blue-100 mb-2 block">
              Select a saved card
            </Label>
            <RadioGroup
              value={selectedCard}
              onValueChange={setSelectedCard}
              className="space-y-3"
            >
              {savedCards.map((card) => (
                <Label
                  key={card.id}
                  htmlFor={`card-${card.id}`}
                  className="flex items-center space-x-3 bg-gray-700/30 p-3 rounded-md cursor-pointer hover:bg-gray-600/30 transition-colors"
                >
                  <RadioGroupItem
                    value={card.id.toString()}
                    id={`card-${card.id}`}
                    className="border-blue-400 text-blue-400"
                  />
                  <CreditCard className="h-6 w-6 text-blue-400" />
                  <span className="text-blue-100 flex items-center">
                    <span className="mr-2">💳</span> {card.brand} ending in{" "}
                    {card.last4}
                  </span>
                </Label>
              ))}
              <Label
                htmlFor="new-card"
                className="flex items-center space-x-3 bg-gray-700/30 p-3 rounded-md cursor-pointer hover:bg-gray-600/30 transition-colors"
              >
                <RadioGroupItem
                  value="new"
                  id="new-card"
                  className="border-blue-400 text-blue-400"
                />
                <CreditCard className="h-6 w-6 text-blue-400" />
                <span className="text-blue-100">Use a new card</span>
              </Label>
            </RadioGroup>
          </div>
        )}
        {(!isSignedIn || selectedCard === "new") && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number" className="text-blue-100">
                  Card number
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 h-5 w-5" />
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="pl-10 bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-blue-100">
                    Expiry date
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc" className="text-blue-100">
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              {isSignedIn && selectedCard === "new" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-card"
                    checked={saveCard}
                    onCheckedChange={(checked) =>
                      setSaveCard(checked as boolean)
                    }
                  />
                  <Label htmlFor="save-card" className="text-sm text-blue-100">
                    Save this card for future purchases
                  </Label>
                </div>
              )}
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
