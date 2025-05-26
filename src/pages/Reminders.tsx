
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, MessageSquare, Mail, Phone, Settings, Send, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reminders = () => {
  const { toast } = useToast();
  const [reminderSettings, setReminderSettings] = useState({
    smsEnabled: true,
    emailEnabled: true,
    whatsappEnabled: false,
    timing24h: true,
    timing2h: false,
    timing1h: false,
  });

  const upcomingReminders = [
    {
      id: 1,
      patient: {
        name: "Sarah Johnson",
        phone: "+1 (555) 123-4567",
        email: "sarah.johnson@email.com"
      },
      appointment: {
        date: "2024-01-23",
        time: "09:00",
        type: "Consultation"
      },
      reminder: {
        type: "24h",
        channel: "SMS",
        scheduled: "2024-01-22 09:00",
        status: "pending"
      }
    },
    {
      id: 2,
      patient: {
        name: "Michael Chen",
        phone: "+1 (555) 987-6543",
        email: "michael.chen@email.com"
      },
      appointment: {
        date: "2024-01-23",
        time: "10:30",
        type: "Follow-up"
      },
      reminder: {
        type: "24h",
        channel: "Email",
        scheduled: "2024-01-22 10:30",
        status: "pending"
      }
    },
    {
      id: 3,
      patient: {
        name: "Emily Davis",
        phone: "+1 (555) 456-7890",
        email: "emily.davis@email.com"
      },
      appointment: {
        date: "2024-01-22",
        time: "14:00",
        type: "Consultation"
      },
      reminder: {
        type: "2h",
        channel: "SMS",
        scheduled: "2024-01-22 12:00",
        status: "sent"
      }
    }
  ];

  const sentReminders = [
    {
      id: 1,
      patient: "Robert Wilson",
      channel: "SMS",
      sentAt: "2024-01-21 16:00",
      status: "delivered",
      response: "confirmed"
    },
    {
      id: 2,
      patient: "Lisa Thompson",
      channel: "Email",
      sentAt: "2024-01-21 15:30",
      status: "delivered",
      response: "pending"
    },
    {
      id: 3,
      patient: "David Brown",
      channel: "WhatsApp",
      sentAt: "2024-01-21 14:45",
      status: "read",
      response: "confirmed"
    }
  ];

  const handleSendReminder = (reminderId: number) => {
    toast({
      title: "Reminder Sent",
      description: "The appointment reminder has been sent successfully.",
    });
  };

  const handleSendBulkReminders = () => {
    const pendingCount = upcomingReminders.filter(r => r.reminder.status === "pending").length;
    toast({
      title: "Bulk Reminders Sent",
      description: `${pendingCount} reminders have been sent successfully.`,
    });
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "sms":
        return <MessageSquare className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      case "whatsapp":
        return <Phone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sent</Badge>;
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case "read":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Read</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getResponseBadge = (response: string) => {
    switch (response) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
      case "rescheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Rescheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">No Response</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-2">
            Manage appointment reminders and communication settings
          </p>
        </div>
        
        <Button onClick={handleSendBulkReminders} className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          Send All Pending
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {upcomingReminders.filter(r => r.reminder.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Sent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sentReminders.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sentReminders.filter(r => r.status === "delivered" || r.status === "read").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Reminders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Upcoming Reminders
            </CardTitle>
            <CardDescription>
              Scheduled reminders for upcoming appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {reminder.patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {reminder.patient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reminder.appointment.type} on {reminder.appointment.date} at {reminder.appointment.time}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        {getChannelIcon(reminder.reminder.channel)}
                        {reminder.reminder.channel} • {reminder.reminder.type} before
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(reminder.reminder.status)}
                    {reminder.reminder.status === "pending" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleSendReminder(reminder.id)}
                        className="flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Send
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reminder Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure reminder preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Communication Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    SMS Messages
                  </Label>
                  <Switch
                    id="sms"
                    checked={reminderSettings.smsEnabled}
                    onCheckedChange={(checked) =>
                      setReminderSettings(prev => ({ ...prev, smsEnabled: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Switch
                    id="email"
                    checked={reminderSettings.emailEnabled}
                    onCheckedChange={(checked) =>
                      setReminderSettings(prev => ({ ...prev, emailEnabled: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </Label>
                  <Switch
                    id="whatsapp"
                    checked={reminderSettings.whatsappEnabled}
                    onCheckedChange={(checked) =>
                      setReminderSettings(prev => ({ ...prev, whatsappEnabled: checked }))
                    }
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Reminder Timing</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="24h">24 hours before</Label>
                  <Switch
                    id="24h"
                    checked={reminderSettings.timing24h}
                    onCheckedChange={(checked) =>
                      setReminderSettings(prev => ({ ...prev, timing24h: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="2h">2 hours before</Label>
                  <Switch
                    id="2h"
                    checked={reminderSettings.timing2h}
                    onCheckedChange={(checked) =>
                      setReminderSettings(prev => ({ ...prev, timing2h: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="1h">1 hour before</Label>
                  <Switch
                    id="1h"
                    checked={reminderSettings.timing1h}
                    onCheckedChange={(checked) =>
                      setReminderSettings(prev => ({ ...prev, timing1h: checked }))
                    }
                  />
                </div>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Recently sent reminders and patient responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sentReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(reminder.channel)}
                    <span className="text-sm font-medium">{reminder.patient}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    sent via {reminder.channel} at {reminder.sentAt}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(reminder.status)}
                  {getResponseBadge(reminder.response)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reminders;
