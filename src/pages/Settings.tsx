
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Key,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  const [clinicSettings, setClinicSettings] = useState({
    name: "Smith Medical Clinic",
    address: "123 Healthcare Blvd, Medical City, MC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@smithmedical.com",
    website: "www.smithmedical.com",
    description: "Providing comprehensive healthcare services since 1985."
  });

  const [userSettings, setUserSettings] = useState({
    name: "Dr. John Smith",
    email: "john.smith@smithmedical.com",
    phone: "+1 (555) 987-6543",
    role: "Doctor",
    timezone: "America/New_York"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,
    marketingEmails: false
  });

  const [apiSettings, setApiSettings] = useState({
    twilioSid: "",
    twilioToken: "",
    emailApiKey: "",
    whatsappToken: ""
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your clinic settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clinic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Clinic Information
              </CardTitle>
              <CardDescription>
                Update your clinic's basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input
                    id="clinicName"
                    value={clinicSettings.name}
                    onChange={(e) => setClinicSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicPhone">Phone Number</Label>
                  <Input
                    id="clinicPhone"
                    value={clinicSettings.phone}
                    onChange={(e) => setClinicSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinicAddress">Address</Label>
                <Input
                  id="clinicAddress"
                  value={clinicSettings.address}
                  onChange={(e) => setClinicSettings(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicEmail">Email</Label>
                  <Input
                    id="clinicEmail"
                    type="email"
                    value={clinicSettings.email}
                    onChange={(e) => setClinicSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicWebsite">Website</Label>
                  <Input
                    id="clinicWebsite"
                    value={clinicSettings.website}
                    onChange={(e) => setClinicSettings(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinicDescription">Description</Label>
                <Textarea
                  id="clinicDescription"
                  value={clinicSettings.description}
                  onChange={(e) => setClinicSettings(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                User Profile
              </CardTitle>
              <CardDescription>
                Manage your personal account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    value={userSettings.name}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userRole">Role</Label>
                  <Select value={userSettings.role} onValueChange={(value) => setUserSettings(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Receptionist">Receptionist</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userPhone">Phone</Label>
                  <Input
                    id="userPhone"
                    value={userSettings.phone}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={userSettings.timezone} onValueChange={(value) => setUserSettings(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-600" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure third-party service integrations for reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twilioSid">Twilio Account SID</Label>
                  <Input
                    id="twilioSid"
                    type="password"
                    placeholder="Enter Twilio SID"
                    value={apiSettings.twilioSid}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, twilioSid: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twilioToken">Twilio Auth Token</Label>
                  <Input
                    id="twilioToken"
                    type="password"
                    placeholder="Enter Twilio Token"
                    value={apiSettings.twilioToken}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, twilioToken: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailApiKey">Email Service API Key</Label>
                  <Input
                    id="emailApiKey"
                    type="password"
                    placeholder="Enter email API key"
                    value={apiSettings.emailApiKey}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, emailApiKey: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappToken">WhatsApp Business Token</Label>
                  <Input
                    id="whatsappToken"
                    type="password"
                    placeholder="Enter WhatsApp token"
                    value={apiSettings.whatsappToken}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, whatsappToken: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                <Shield className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  API keys are encrypted and stored securely. Never share these credentials.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Notifications
              </CardTitle>
              <CardDescription>
                Control how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotif">Email Notifications</Label>
                <Switch
                  id="emailNotif"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotif">SMS Notifications</Label>
                <Switch
                  id="smsNotif"
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotif">Push Notifications</Label>
                <Switch
                  id="pushNotif"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="appointmentRemind">Appointment Reminders</Label>
                <Switch
                  id="appointmentRemind"
                  checked={notificationSettings.appointmentReminders}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, appointmentReminders: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="systemAlerts">System Alerts</Label>
                <Switch
                  id="systemAlerts"
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing">Marketing Emails</Label>
                <Switch
                  id="marketing"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Backup Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Palette className="w-4 h-4 mr-2" />
                Customize Theme
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security Audit
              </Button>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleSaveSettings} className="w-full flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save All Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
