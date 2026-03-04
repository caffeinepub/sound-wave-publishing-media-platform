import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Disc,
  DollarSign,
  Download,
  Edit,
  FileText,
  Music,
  Package,
  Plus,
  Settings,
  Shield,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateArtistProfileDialog from "../components/CreateArtistProfileDialog";
import CreateTrademarkDialog from "../components/CreateTrademarkDialog";
import EditArtistProfileDialog from "../components/EditArtistProfileDialog";
import LightscribeProjectDialog from "../components/LightscribeProjectDialog";
import MediaCard from "../components/MediaCard";
import PaymentSettingsDialog from "../components/PaymentSettingsDialog";
import UploadMediaDialog from "../components/UploadMediaDialog";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteLightscribeProject,
  useDeleteMedia,
  useDeleteTrademarkRecord,
  useGetAllArtistProfiles,
  useGetArtistSales,
  useGetArtistWorks,
  useGetCallerUserProfile,
  useGetMyLightscribeProjects,
  useGetMyTrademarks,
} from "../hooks/useQueries";

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allArtists = [] } = useGetAllArtistProfiles();
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [artistId, setArtistId] = useState<string | null>(null);
  const [currentArtistProfile, setCurrentArtistProfile] = useState<any>(null);
  const [deleteMediaId, setDeleteMediaId] = useState<string | null>(null);
  const [deleteTrademarkId, setDeleteTrademarkId] = useState<string | null>(
    null,
  );
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [showLightscribeDialog, setShowLightscribeDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const { data: artistWorks = [] } = useGetArtistWorks(artistId || undefined);
  const { data: sales = [] } = useGetArtistSales(artistId || undefined);
  const { data: trademarks = [] } = useGetMyTrademarks();
  const { data: lightscribeProjects = [] } = useGetMyLightscribeProjects();
  const deleteMedia = useDeleteMedia();
  const deleteTrademark = useDeleteTrademarkRecord();
  const deleteProject = useDeleteLightscribeProject();

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/" });
      return;
    }

    if (allArtists.length > 0 && identity) {
      const _principalText = identity.getPrincipal().toString();
      const myArtist = allArtists.find((artist) => {
        return artistWorks.some((work) => work.artistId === artist.id);
      });
      if (myArtist) {
        setArtistId(myArtist.id);
        setCurrentArtistProfile(myArtist);
      }
    }
  }, [identity, allArtists, navigate, artistWorks]);

  const handleDeleteMedia = async () => {
    if (!deleteMediaId) return;
    try {
      await deleteMedia.mutateAsync(deleteMediaId);
      toast.success("Media deleted successfully");
      setDeleteMediaId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete media");
    }
  };

  const handleDeleteTrademark = async () => {
    if (!deleteTrademarkId) return;
    try {
      await deleteTrademark.mutateAsync(deleteTrademarkId);
      toast.success("Trademark deleted successfully");
      setDeleteTrademarkId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete trademark");
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    try {
      await deleteProject.mutateAsync(deleteProjectId);
      toast.success("Project deleted successfully");
      setDeleteProjectId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => {
    const media = artistWorks.find((w) => w.id === sale.mediaId);
    if (!media) return sum;
    const license = media.licensingOptions.find(
      (l) => l.id === sale.licensingOptionId,
    );
    return sum + Number(license?.price || 0);
  }, 0);

  // Filter and sort trademarks
  const filteredTrademarks = trademarks
    .filter((tm) => statusFilter === "all" || tm.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        return Number(b.filingDate - a.filingDate);
      }
      if (sortBy === "date-asc") {
        return Number(a.filingDate - b.filingDate);
      }
      if (sortBy === "name") {
        return a.markName.localeCompare(b.markName);
      }
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "Expired":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowLightscribeDialog(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowLightscribeDialog(true);
  };

  if (!identity || !userProfile) {
    return null;
  }

  if (!artistId) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Create Your Artist Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              You need to create an artist profile before you can upload and
              manage your creative works.
            </p>
            <Button onClick={() => setShowCreateProfile(true)}>
              Create Artist Profile
            </Button>
          </CardContent>
        </Card>
        <CreateArtistProfileDialog
          open={showCreateProfile}
          onOpenChange={setShowCreateProfile}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Artist Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your creative works and track sales
          </p>
        </div>
        <div className="flex gap-2">
          {currentArtistProfile && (
            <Button variant="outline" onClick={() => setShowEditProfile(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
          <PaymentSettingsDialog />
          <UploadMediaDialog artistId={artistId} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Works</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artistWorks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trademarks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trademarks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CD Labels</CardTitle>
            <Disc className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lightscribeProjects.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="works" className="space-y-6">
        <TabsList>
          <TabsTrigger value="works">My Works</TabsTrigger>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="trademarks">Trademarks</TabsTrigger>
          <TabsTrigger value="lightscribe">CD Labels</TabsTrigger>
        </TabsList>

        <TabsContent value="works" className="space-y-4">
          {artistWorks.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium">No works uploaded yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload your first creative work to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artistWorks.map((media) => (
                <div key={media.id} className="relative">
                  <MediaCard media={media} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteMediaId(media.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          {sales.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium">No sales yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your sales will appear here once buyers purchase licenses
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {sales.map((sale) => {
                    const media = artistWorks.find(
                      (w) => w.id === sale.mediaId,
                    );
                    const license = media?.licensingOptions.find(
                      (l) => l.id === sale.licensingOptionId,
                    );
                    return (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div>
                          <p className="font-medium">
                            {media?.title || "Unknown Media"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {license?.name || "Unknown License"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              Number(sale.timestamp) / 1000000,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          ${(Number(license?.price || 0) / 100).toFixed(2)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trademarks" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CreateTrademarkDialog artistId={artistId} />
          </div>

          {filteredTrademarks.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">
                    {trademarks.length === 0
                      ? "No trademarks yet"
                      : "No trademarks match your filters"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {trademarks.length === 0
                      ? "Add your first trademark to protect your intellectual property"
                      : "Try adjusting your filters"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrademarks.map((trademark) => (
                <Card key={trademark.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {trademark.markName}
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Reg. #{trademark.registrationNumber}
                        </p>
                      </div>
                      <Badge className={getStatusColor(trademark.status)}>
                        {trademark.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Filing Date
                      </p>
                      <p className="text-sm">
                        {new Date(
                          Number(trademark.filingDate) / 1000000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    {trademark.description && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Description
                        </p>
                        <p className="text-sm line-clamp-2">
                          {trademark.description}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      {trademark.documentReference && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(
                              trademark.documentReference!.getDirectURL(),
                              "_blank",
                            )
                          }
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          View Doc
                        </Button>
                      )}
                      <CreateTrademarkDialog
                        artistId={artistId}
                        existingTrademark={trademark}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        }
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTrademarkId(trademark.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lightscribe" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/lightscribe-icon-transparent.dim_64x64.png"
                alt="Lightscribe"
                className="h-8 w-8"
              />
              <h2 className="text-xl font-semibold">CD Label Designer</h2>
            </div>
            <Button onClick={handleNewProject}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          {lightscribeProjects.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <Disc className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">
                    No CD label projects yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create your first CD label design for home printing
                  </p>
                  <Button onClick={handleNewProject} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lightscribeProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={project.previewImage.getDirectURL()}
                      alt={project.projectName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {project.projectName}
                    </CardTitle>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>
                        Created:{" "}
                        {new Date(
                          Number(project.createdTimestamp) / 1000000,
                        ).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        Modified:{" "}
                        {new Date(
                          Number(project.modifiedTimestamp) / 1000000,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = project.lsaFile.getDirectURL();
                          a.download = `${project.projectName}.lsa`;
                          a.click();
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteProjectId(project.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!deleteMediaId}
        onOpenChange={() => setDeleteMediaId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this media? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMedia}
              disabled={deleteMedia.isPending}
            >
              {deleteMedia.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteTrademarkId}
        onOpenChange={() => setDeleteTrademarkId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trademark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trademark record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTrademark}
              disabled={deleteTrademark.isPending}
            >
              {deleteTrademark.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete CD Label Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LightscribeProjectDialog
        open={showLightscribeDialog}
        onOpenChange={(open) => {
          setShowLightscribeDialog(open);
          if (!open) setEditingProject(null);
        }}
        artistId={artistId}
        existingProject={editingProject}
      />

      {currentArtistProfile && (
        <EditArtistProfileDialog
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          profile={currentArtistProfile}
        />
      )}
    </div>
  );
}
