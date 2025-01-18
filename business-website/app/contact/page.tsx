"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Loader2, SendIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  }, []);

  const validateMessage = useCallback((message: string) => {
    if (!/^[a-zA-Z0-9\s.,!?()-]+$/.test(message)) {
      setMessageError(
        "Sorry, only alphanumeric characters, spaces, and common punctuation (.,!?()-) are allowed in the message",
      );
      return false;
    }
    setMessageError("");
    return true;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.email.value;
    const inquiryType = form.inquiryType.value; // Assuming there's an inquiryType field in the form
    const message = form.message.value;

    // Validate input
    if (!validateEmail(email) || !validateMessage(message)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send data to the backend
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, inquiryType, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);

      // Update UI to show success
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Updated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzBmMTcyYSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPjwvY2lyY2xlPgo8cGF0aCBkPSJNMzAgMTBMMTAgMzBMNDAgNTBMNjAgMzBMMzAgMTAiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/10 to-blue-300/10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-5xl font-bold text-center mb-12 text-white tracking-tight">
          Contact Us 📬
        </h1>

        <Card className="bg-gradient-to-br pb-7 from-blue-800 to-blue-900 shadow-xl border border-blue-500/20">
          <CardHeader></CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center text-white">
                <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
                <p>
                  We`&apos;`ve received your message and will get back to you
                  soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Contact Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-white/10 border-blue-500/50 text-white placeholder-blue-300"
                    onChange={(e) => validateEmail(e.target.value)}
                  />
                  {emailError && (
                    <Alert
                      variant="destructive"
                      className="bg-red-900 border-red-500 text-white mt-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{emailError}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inquiry-type" className="text-white">
                    Inquiry Type
                  </Label>
                  <Select required name="inquiryType">
                    <SelectTrigger
                      id="inquiry-type"
                      className="bg-white/10 border-blue-500/50 text-white"
                    >
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please describe your inquiry..."
                    required
                    className="bg-white/10 border-blue-500/50 text-white placeholder-blue-300 min-h-[150px]"
                    onChange={(e) => validateMessage(e.target.value)}
                  />
                  {messageError && (
                    <Alert
                      variant="destructive"
                      className="bg-red-899 border-red-500 text-white mt-2"
                    >
                      <AlertCircle className="h-3 w-4" />
                      <AlertDescription>{messageError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  disabled={isSubmitting || !!emailError || !!messageError}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendIcon className="mr-1 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
