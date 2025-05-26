import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/appointment";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  view: "daily" | "monthly";
  onViewChange: (view: "daily" | "monthly") => void;
}

export function AppointmentCalendar({
  appointments,
  onDateSelect,
  selectedDate,
  view,
  onViewChange,
}: AppointmentCalendarProps) {
  const appointmentsByDate = React.useMemo(() => {
    return appointments.reduce((acc, appointment) => {
      try {
        const appointmentDate = new Date(appointment.time);
        if (isNaN(appointmentDate.getTime())) {
          console.warn(`Invalid appointment time: ${appointment.time}`);
          return acc;
        }
        const date = format(appointmentDate, "yyyy-MM-dd");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(appointment);
      } catch (error) {
        console.warn(`Error processing appointment: ${error}`);
      }
      return acc;
    }, {} as Record<string, Appointment[]>);
  }, [appointments]);

  const DailyView = () => {
    const dayAppointments = appointmentsByDate[format(selectedDate, "yyyy-MM-dd")] || [];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange("monthly")}
          >
            View Month
          </Button>
        </div>
        <div className="space-y-2">
          {dayAppointments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No appointments scheduled</p>
          ) : (
            dayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{appointment.patient}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(appointment.time), "h:mm a")}
                    </span>
                  </div>
                </div>
                <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                  {appointment.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const MonthlyView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, "MMMM yyyy")}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange("daily")}
          >
            View Day
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const dayAppointments = appointmentsByDate[dateStr] || [];
              return (
                <div className="relative w-full h-full">
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    {dayAppointments.length > 0 && (
                      <div className="h-1 w-1 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {format(date, "d")}
                  </div>
                </div>
              );
            },
          }}
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      {view === "daily" ? <DailyView /> : <MonthlyView />}
    </div>
  );
}
