import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Clock, TrendingUp, Phone, Mail, Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formatDate, toISOString } from "@/utils/dateUtils";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { emailService } from "@/services/emailService";
import { appointmentService } from "@/services/appointmentService"; // Import appointmentService
import { Analytics } from "@/components/Analytics";
import { PatientProfile } from "@/components/PatientProfile";
import { AppointmentCalendar } from "@/components/AppointmentCalendar";

interface Appointment {
  id: number;
  time: string;
  patient: string;
  type: string;
  status: string;
  phone: string;
  notes: string;
}

interface Patient {
  id: number;
  name: string;
}

const appointmentFormSchema = z.object({
  patient: z.string().min(2, { message: "Patient name is required" }),
  type: z.string().min(1, { message: "Appointment type is required" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  notes: z.string().optional(),
});

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [calendarView, setCalendarView] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patient: "",
      type: "",
      notes: "",
      phone: "",
    },
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof appointmentFormSchema>) => {
    try {
      const newAppointment = {
        patient: values.patient,
        type: values.type,
        time: values.time,
        status: "pending",
        phone: values.phone,
        notes: values.notes || "",
      };

      const created = await appointmentService.createAppointment(newAppointment);
      setAppointments([...appointments, created]);
      setIsDialogOpen(false);
      form.reset();
      
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Simulated data fetch - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsData, patientsData] = await Promise.all([
          // Replace with actual API call
          Promise.resolve([
            {
              id: 1,
              time: "09:00 AM",
              patient: "Sarah Johnson",
              type: "Consultation",
              status: "confirmed",
              phone: "+1 (555) 123-4567",
              notes: "Annual checkup"
            },
            {
              id: 2,
              time: "10:30 AM",
              patient: "Michael Chen",
              type: "Follow-up",
              status: "pending",
              phone: "+1 (555) 987-6543",
              notes: "Blood test results review"
            },
            {
              id: 3,
              time: "02:00 PM",
              patient: "Emily Davis",
              type: "Consultation",
              status: "confirmed",
              phone: "+1 (555) 456-7890",
              notes: "First visit"
            },
            {
              id: 4,
              time: "03:30 PM",
              patient: "Robert Wilson",
              type: "Procedure",
              status: "confirmed",
              phone: "+1 (555) 321-0987",
              notes: "Minor procedure"
            }
          ]),
          // Replace with actual API call
          Promise.resolve([
            {
              id: 1,
              name: "Sarah Johnson"
            },
            {
              id: 2,
              name: "Michael Chen"
            },
            {
              id: 3,
              name: "Emily Davis"
            },
            {
              id: 4,
              name: "Robert Wilson"
            }
          ])
        ]);
        
        setAppointments(appointmentsData);
        setPatients(patientsData);
        
        // Update stats
        setStats({
          totalAppointments: appointmentsData.length,
          totalPatients: patientsData.length,
          upcomingAppointments: appointmentsData.filter(a => a.status === 'pending').length,
          completedAppointments: appointmentsData.filter(a => a.status === 'completed').length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // TODO: Add proper error handling
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter appointments based on search and status
  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, statusFilter]);

  // Quick Actions handlers
  const handleScheduleAppointment = () => {
    setIsDialogOpen(true);
  };

  const handleManagePatients = () => {
    navigate('/patients');
  };

  const handleSendReminders = async () => {
    try {
      // Get all upcoming appointments
      const upcomingAppointments = appointments.filter(a => a.status === 'pending');
      
      if (upcomingAppointments.length === 0) {
        toast({
          title: "No Reminders Needed",
          description: "There are no upcoming appointments that need reminders.",
          variant: "default"
        });
        return;
      }

      // Send reminders using emailService
      let successCount = 0;
      let failureCount = 0;

      for (const appointment of upcomingAppointments) {
        const success = await emailService.sendAppointmentReminder(
          `${appointment.patient.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          appointment.patient,
          new Date(appointment.time).toLocaleDateString(),
          new Date(appointment.time).toLocaleTimeString(),
          appointment.type
        );

        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
      }
      
      // Show success message
      if (successCount > 0) {
        toast({
          title: "Reminders Sent",
          description: `Successfully sent ${successCount} reminder${successCount > 1 ? 's' : ''}${failureCount > 0 ? `. Failed to send ${failureCount} reminder${failureCount > 1 ? 's' : ''}.` : '.'}`,
          variant: successCount === upcomingAppointments.length ? "default" : "destructive"
        });
      } else {
        toast({
          title: "Failed to Send Reminders",
          description: "There was an error sending the reminders. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending reminders.",
        variant: "destructive"
      });
    }
  };

  const handleViewAnalytics = () => {
    setShowAnalytics(true);
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    // Replace with actual API call
    const updatedAppointments = appointments.map(app =>
      app.id === appointmentId ? { ...app, status: newStatus } : app
    );
    setAppointments(updatedAppointments);
  };

  const handleCallPatient = (phone: string) => {
    // Format the phone number for tel: protocol
    const formattedPhone = phone.replace(/\D/g, ''); // Remove non-digit characters
    window.location.href = `tel:${formattedPhone}`;
  };

  const handleEmailPatient = (patient: string) => {
    // Format the email address
    const email = `${patient.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    window.location.href = `mailto:${email}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewProfile = (patient: any) => {
    setSelectedPatient(patient);
    setShowProfile(true);
  };

  const handleSaveProfile = async (updatedPatient: any) => {
    // Update patient data
    // In a real app, this would make an API call
    toast({
      title: "Profile Updated",
      description: "Patient profile has been successfully updated.",
    });
  };

  const handleScheduleFromProfile = () => {
    setShowProfile(false);
    setSelectedPatient(null);
    // Open the appointment form
    form.reset({
      patient: selectedPatient.name,
      type: "",
      date: new Date(),
      time: "",
      phone: selectedPatient.phone,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of your clinic's activities and appointments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="patient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                          <SelectItem value="Follow-up">Follow-up</SelectItem>
                          <SelectItem value="Procedure">Procedure</SelectItem>
                          <SelectItem value="Check-up">Check-up</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(toISOString(field.value))
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date.getTime() < new Date().getTime() || date.getTime() > new Date(new Date().setMonth(new Date().getMonth() + 2)).getTime()
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                            <>
                              <SelectItem value={`${hour}:00`}>{`${hour}:00 AM`}</SelectItem>
                              <SelectItem value={`${hour}:30`}>{`${hour}:30 AM`}</SelectItem>
                            </>
                          ))}
                          {Array.from({ length: 8 }, (_, i) => i + 1).map((hour) => (
                            <>
                              <SelectItem value={`${hour + 12}:00`}>{`${hour}:00 PM`}</SelectItem>
                              <SelectItem value={`${hour + 12}:30`}>{`${hour}:30 PM`}</SelectItem>
                            </>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any relevant notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Create Appointment</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Total appointments scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Total patients registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Appointments scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Appointments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Appointments completed today</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar and Appointments Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar Overview</CardTitle>
              <CardDescription>Monthly view of all appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentCalendar
                appointments={appointments}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
                view={calendarView}
                onViewChange={setCalendarView}
              />
            </CardContent>
          </Card>

          {/* Today's Appointments List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>{filteredAppointments.length} appointments shown</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCalendarView('daily')}>Day</Button>
                  <Button variant="outline" size="sm" onClick={() => setCalendarView('monthly')}>Month</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading appointments...</div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[80px]">
                          <div className="text-sm font-semibold text-gray-900">
                            {appointment.time}
                          </div>
                          <div className="text-xs text-gray-500">{appointment.type}</div>
                        </div>
                        
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${appointment.patient}`} />
                          <AvatarFallback>
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">
                            {appointment.patient}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {appointment.notes}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {appointment.phone}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Select
                          value={appointment.status}
                          onValueChange={(value) => handleStatusChange(appointment.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue>{getStatusBadge(appointment.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleCallPatient(appointment.phone)}
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEmailPatient(appointment.patient)}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Button variant="outline" className="w-full">
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline" onClick={handleScheduleAppointment}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={handleManagePatients}>
                <Users className="w-4 h-4 mr-2" />
                Manage Patients
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={handleSendReminders}>
                <Mail className="w-4 h-4 mr-2" />
                Send Reminders
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={handleViewAnalytics}>
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Patient List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{appointment.patient[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{appointment.patient}</h3>
                          <p className="text-sm text-muted-foreground">
                            Next Appointment: {formatDate(appointment.time)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile({
                            id: appointment.id,
                            name: appointment.patient,
                            email: `${appointment.patient.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                            phone: appointment.phone,
                            age: 35, // This would come from the API in a real app
                            medicalHistory: appointment.notes || "No medical history recorded",
                            status: "Active",
                            lastVisit: toISOString(appointment.time ? new Date(appointment.time) : new Date()),
                            nextAppointment: appointment.time ? toISOString(new Date(appointment.time)) : null,
                          })}
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            form.reset({
                              patient: appointment.patient,
                              type: "",
                              date: new Date(),
                              time: "",
                              phone: appointment.phone,
                              notes: "",
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Dialog */}
      {showProfile && selectedPatient && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Patient Profile</DialogTitle>
            </DialogHeader>
            <PatientProfile
              patient={selectedPatient}
              onSchedule={handleScheduleFromProfile}
              onSave={handleSaveProfile}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAnalytics && (
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Clinic Analytics</DialogTitle>
            </DialogHeader>
            <Analytics appointments={appointments} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
