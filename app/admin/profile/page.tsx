import { requireAdmin } from "@/app/data/admin/require-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, User } from "lucide-react";
import { EditProfileForm } from "./edit-profile-form";

export default async function EditProfilePage() {
  const session = await requireAdmin();
  const user = session.user;

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
        {/* Profile Overview - Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="size-24 border-4 border-primary/20">
                  <AvatarImage
                    src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{user.name || "Unnamed User"}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                    <Sparkles className="size-3 mr-1" />
                    {user.role === "admin" ? "Administrator" : "Instructor"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{user.role}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form - Main Content */}
        <div className="lg:col-span-2">
          <EditProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
