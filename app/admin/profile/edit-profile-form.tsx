"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateProfileAction } from "./actions";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="shadow-lg shadow-primary/20">
      {pending ? (
        <>
          <Loader2 className="size-4 mr-2 animate-spin" />
          Saving Changes...
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
}

export function EditProfileForm({ user }: { user: any }) {
  return (
    <form action={updateProfileAction}>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name || ""}
              placeholder="Enter your full name"
              className="max-w-md"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                disabled
                className="max-w-md"
              />
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed for security reasons
            </p>
          </div>

          {/* Profile Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              defaultValue={user.image || ""}
              placeholder="https://example.com/avatar.jpg"
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to your profile picture
            </p>
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="role">Account Role</Label>
            <Input
              id="role"
              name="role"
              defaultValue={user.role}
              disabled
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              Contact support to change your role
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <SubmitButton />
            <Button type="reset" variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
