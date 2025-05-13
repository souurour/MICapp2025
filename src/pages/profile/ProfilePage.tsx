import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import {
  Bell,
  Camera,
  Key,
  Lock,
  LogOut,
  Save,
  User,
  UserCog,
} from "lucide-react";

// Helper to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Helper to get role display
const getRoleDisplay = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "technician":
      return "Technician";
    case "user":
      return "User";
    default:
      return role;
  }
};

export default function ProfilePage() {
  const { user, logout } = useAuth();

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(""); // This would come from user data in a real app
  const [department, setDepartment] = useState(""); // This would come from user data in a real app

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    appNotifications: true,
    criticalAlertsOnly: false,
    dailySummary: true,
    weeklySummary: true,
  });

  const handleToggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would be an API call to update the user profile
    setIsEditing(false);
    // For this demo, we'll just show an alert
    window.alert("Profile saved successfully!");
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">User not authenticated</h1>
            <p className="mt-2">Please log in to view your profile.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="gap-2 w-full md:w-auto"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Your personal information and role
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-indigo-100 text-indigo-800 text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -bottom-2 h-7 w-7 rounded-full bg-primary hover:bg-primary/90"
                >
                  <Camera className="h-3.5 w-3.5 text-white" />
                  <span className="sr-only">Upload Photo</span>
                </Button>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge className="mt-2">
                  {getRoleDisplay(user.role as UserRole)}
                </Badge>
              </div>
              <div className="w-full space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last login</span>
                  <span>Today, 9:42 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <Tabs defaultValue="account">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Account Settings</CardTitle>
                  <TabsList>
                    <TabsTrigger value="account" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Account</span>
                    </TabsTrigger>
                    <TabsTrigger value="password" className="gap-2">
                      <Key className="h-4 w-4" />
                      <span className="hidden sm:inline">Password</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="account" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="Your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="Your department"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={getRoleDisplay(user.role as UserRole)}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Your role can only be changed by an administrator.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} className="gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="gap-2"
                      >
                        <UserCog className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="password" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Lock className="h-4 w-4" />
                      Update Password
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <div className="grid gap-6 py-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label
                        htmlFor="emailAlerts"
                        className="flex flex-col space-y-1"
                      >
                        <span>Email Alerts</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive notifications via email
                        </span>
                      </Label>
                      <Switch
                        id="emailAlerts"
                        checked={notificationSettings.emailAlerts}
                        onCheckedChange={() =>
                          handleToggleNotification("emailAlerts")
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                      <Label
                        htmlFor="appNotifications"
                        className="flex flex-col space-y-1"
                      >
                        <span>App Notifications</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive notifications in the app
                        </span>
                      </Label>
                      <Switch
                        id="appNotifications"
                        checked={notificationSettings.appNotifications}
                        onCheckedChange={() =>
                          handleToggleNotification("appNotifications")
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                      <Label
                        htmlFor="criticalAlertsOnly"
                        className="flex flex-col space-y-1"
                      >
                        <span>Critical Alerts Only</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Only receive notifications for critical alerts
                        </span>
                      </Label>
                      <Switch
                        id="criticalAlertsOnly"
                        checked={notificationSettings.criticalAlertsOnly}
                        onCheckedChange={() =>
                          handleToggleNotification("criticalAlertsOnly")
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                      <Label
                        htmlFor="dailySummary"
                        className="flex flex-col space-y-1"
                      >
                        <span>Daily Summary</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive a daily summary of activities
                        </span>
                      </Label>
                      <Switch
                        id="dailySummary"
                        checked={notificationSettings.dailySummary}
                        onCheckedChange={() =>
                          handleToggleNotification("dailySummary")
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                      <Label
                        htmlFor="weeklySummary"
                        className="flex flex-col space-y-1"
                      >
                        <span>Weekly Summary</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive a weekly summary of activities
                        </span>
                      </Label>
                      <Switch
                        id="weeklySummary"
                        checked={notificationSettings.weeklySummary}
                        onCheckedChange={() =>
                          handleToggleNotification("weeklySummary")
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Notification Settings</Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
