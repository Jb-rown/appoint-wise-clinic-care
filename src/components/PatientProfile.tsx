import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateUtils";

interface PatientProfileProps {
  patient: {
    id: number;
    name: string;
    email: string;
    phone: string;
    age: number;
    medicalHistory: string;
    status: "Active" | "Inactive";
    lastVisit: string | null;
    nextAppointment: string | null;
  };
  onSchedule: () => void;
  onSave: (updatedPatient: any) => void;
}

export const PatientProfile = ({ patient, onSchedule, onSave }: PatientProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(patient);

  const handleSave = () => {
    onSave(editedPatient);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{patient.name}</h2>
          <div className="flex items-center gap-2">
            <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
              {patient.status}
            </Badge>
            <span className="text-sm text-muted-foreground">Age: {patient.age}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSchedule}>Schedule Appointment</Button>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {isEditing ? (
          <>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editedPatient.email}
                    onChange={(e) =>
                      setEditedPatient({ ...editedPatient, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedPatient.phone}
                    onChange={(e) =>
                      setEditedPatient({ ...editedPatient, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={editedPatient.medicalHistory}
                  onChange={(e) =>
                    setEditedPatient({
                      ...editedPatient,
                      medicalHistory: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  <span>{patient.phone}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Medical History</h4>
                  <p className="text-sm text-muted-foreground">
                    {patient.medicalHistory}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Last Visit</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(patient.lastVisit)}
                    </p>
                  </div>
                  {patient.nextAppointment && (
                    <div>
                      <h4 className="font-medium">Next Appointment</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(patient.nextAppointment)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
