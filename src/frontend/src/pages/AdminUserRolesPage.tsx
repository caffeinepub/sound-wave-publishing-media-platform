import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Principal } from "@dfinity/principal";
import { Loader2, Shield, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserWithRole } from "../backend";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAssignUserRole,
  useDeleteUser,
  useGetAllUsersWithRoles,
  useIsCallerAdmin,
} from "../hooks/useQueries";

export default function AdminUserRolesPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersWithRoles(!!isAdmin);
  const assignRole = useAssignUserRole();
  const deleteUser = useDeleteUser();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  if (isInitializing || adminLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDeniedScreen variant="login-required" />;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen variant="unauthorized" />;
  }

  const handleEditRole = (user: UserWithRole) => {
    setEditingUserId(user.userId.toString());
    setSelectedRole(user.role);
  };

  const handleSaveRole = async (userId: string) => {
    if (!selectedRole) return;
    try {
      await assignRole.mutateAsync({
        userId: Principal.fromText(userId),
        role: selectedRole,
      });
      toast.success("User role updated successfully");
      setEditingUserId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser.mutateAsync(Principal.fromText(userId));
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "user":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-5xl space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-widest">
            <Shield className="h-3 w-3" />
            Admin
          </div>
          <h1 className="font-display text-4xl font-bold">
            User Role Management
          </h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions for Sound Waves Publishing &amp;
            Media.
          </p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              All Users
            </CardTitle>
            <CardDescription>
              {users.length} registered user{users.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : usersError ? (
              <div className="py-8 text-center text-sm text-destructive">
                Failed to load users. Please try again.
              </div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No users registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Principal ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const userIdStr = user.userId.toString();
                      const isEditing = editingUserId === userIdStr;
                      return (
                        <TableRow key={userIdStr} className="border-border">
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Select
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                              >
                                <SelectTrigger className="w-28 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">admin</SelectItem>
                                  <SelectItem value="user">user</SelectItem>
                                  <SelectItem value="guest">guest</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge
                                variant={getRoleBadgeVariant(user.role)}
                                className="text-xs"
                              >
                                {user.role}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs font-mono max-w-[120px] truncate">
                            {userIdStr}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isEditing ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={() => handleSaveRole(userIdStr)}
                                    disabled={assignRole.isPending}
                                  >
                                    {assignRole.isPending ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      "Save"
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => setEditingUserId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10"
                                    onClick={() => handleEditRole(user)}
                                  >
                                    Edit Role
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete User
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete{" "}
                                          <strong>{user.name}</strong>? This
                                          action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteUser(userIdStr)
                                          }
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
