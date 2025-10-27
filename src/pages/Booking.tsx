import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

export const Booking = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();

  const handleBooking = () => {
    toast.success("Booking functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book a Session</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              <Button onClick={handleBooking} className="w-full mt-4">
                Confirm Booking
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Session Type</h3>
                <p className="text-muted-foreground">Video Consultation</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Duration</h3>
                <p className="text-muted-foreground">50 minutes</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Price</h3>
                <p className="text-muted-foreground">$120</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
