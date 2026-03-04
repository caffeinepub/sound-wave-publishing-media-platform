import { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ArtistProfile,
  ArtworkCategory,
  CheckoutRequest,
  CheckoutSessionResponse,
  InvoiceRecord,
  LightscribeExportRecord,
  LightscribeLabelProject,
  LightscribeTemplate,
  MediaMetadata,
  MembershipFeeRecord,
  MerchantServicesConfig,
  NationalBankcardConfig,
  PayoutRecord,
  PurchaseRecord,
  RefAnalyticsSummary,
  ShoppingItem,
  StripeConfiguration,
  TrademarkRecord,
  UserProfile,
  UserWithRole,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Artist Profile ───────────────────────────────────────────────────────────

export function useGetAllArtistProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtistProfile[]>({
    queryKey: ["artistProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArtistProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArtistProfile(artistId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ArtistProfile | null>({
    queryKey: ["artistProfile", artistId],
    queryFn: async () => {
      if (!actor || !artistId) return null;
      try {
        return await actor.getArtistProfile(artistId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!artistId,
  });
}

export function useCreateArtistProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ArtistProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.createArtistProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artistProfiles"] });
      queryClient.invalidateQueries({ queryKey: ["myArtistProfile"] });
    },
  });
}

export function useUpdateArtistProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ArtistProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateArtistProfile(profile);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["artistProfiles"] });
      queryClient.invalidateQueries({
        queryKey: ["artistProfile", variables.id],
      });
    },
  });
}

// ─── Media ────────────────────────────────────────────────────────────────────

export function useGetAllMedia() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ["allMedia"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMedia();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMedia(mediaId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata | null>({
    queryKey: ["media", mediaId],
    queryFn: async () => {
      if (!actor || !mediaId) return null;
      try {
        return await actor.getMedia(mediaId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!mediaId,
  });
}

export function useGetArtistWorks(artistId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ["artistWorks", artistId],
    queryFn: async () => {
      if (!actor || !artistId) return [];
      return actor.getArtistWorks(artistId);
    },
    enabled: !!actor && !isFetching && !!artistId,
  });
}

export function useUploadMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metadata: MediaMetadata) => {
      if (!actor) throw new Error("Actor not available");
      await actor.uploadMedia(metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allMedia"] });
      queryClient.invalidateQueries({ queryKey: ["artistWorks"] });
    },
  });
}

export function useUpdateMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metadata: MediaMetadata) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateMedia(metadata);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allMedia"] });
      queryClient.invalidateQueries({ queryKey: ["media", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["artistWorks"] });
    },
  });
}

export function useDeleteMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mediaId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteMedia(mediaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allMedia"] });
      queryClient.invalidateQueries({ queryKey: ["artistWorks"] });
    },
  });
}

export function useSearchMedia(keyword: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ["searchMedia", keyword],
    queryFn: async () => {
      if (!actor || !keyword) return [];
      return actor.searchMediaByKeyword(keyword);
    },
    enabled: !!actor && !isFetching && keyword.length > 0,
  });
}

// ─── Purchase ─────────────────────────────────────────────────────────────────

export function useGetMyPurchases() {
  const { actor, isFetching } = useActor();

  return useQuery<PurchaseRecord[]>({
    queryKey: ["myPurchases"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMyPurchases();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArtistSales(artistId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<PurchaseRecord[]>({
    queryKey: ["artistSales", artistId],
    queryFn: async () => {
      if (!actor || !artistId) return [];
      try {
        return await actor.getArtistSales(artistId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!artistId,
  });
}

export function usePurchaseLicense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: PurchaseRecord) => {
      if (!actor) throw new Error("Actor not available");
      await actor.purchaseLicense(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPurchases"] });
      queryClient.invalidateQueries({ queryKey: ["artistSales"] });
    },
  });
}

// ─── Stripe ───────────────────────────────────────────────────────────────────

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stripeConfigured"] });
    },
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result) as CheckoutSession;
      return session;
    },
  });
}

// ─── Merchant Services ────────────────────────────────────────────────────────

export function useIsMerchantServicesConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["merchantServicesConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isMerchantServicesConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetMerchantServicesConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: MerchantServicesConfig) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setMerchantServicesConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["merchantServicesConfigured"],
      });
    },
  });
}

// ─── National Bankcard ────────────────────────────────────────────────────────

export function useIsNationalBankcardConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["nationalBankcardConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isNationalBankcardConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetNationalBankcardConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: NationalBankcardConfig) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setNationalBankcardConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["nationalBankcardConfigured"],
      });
    },
  });
}

// ─── Unified Checkout ─────────────────────────────────────────────────────────

export function useCreateUnifiedCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (
      request: CheckoutRequest,
    ): Promise<CheckoutSessionResponse> => {
      if (!actor) throw new Error("Actor not available");
      return actor.createUnifiedCheckoutSession(request);
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Trademark ────────────────────────────────────────────────────────────────

export function useGetMyTrademarks() {
  const { actor, isFetching } = useActor();

  return useQuery<TrademarkRecord[]>({
    queryKey: ["myTrademarks"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMyTrademarks();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArtistTrademarks(artistId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<TrademarkRecord[]>({
    queryKey: ["artistTrademarks", artistId],
    queryFn: async () => {
      if (!actor || !artistId) return [];
      return actor.getArtistTrademarks(artistId);
    },
    enabled: !!actor && !isFetching && !!artistId,
  });
}

export function useCreateTrademarkRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: TrademarkRecord) => {
      if (!actor) throw new Error("Actor not available");
      await actor.createTrademarkRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTrademarks"] });
    },
  });
}

export function useUpdateTrademarkRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: TrademarkRecord) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateTrademarkRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTrademarks"] });
    },
  });
}

export function useDeleteTrademarkRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteTrademarkRecord(recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTrademarks"] });
    },
  });
}

// ─── Lightscribe ──────────────────────────────────────────────────────────────

export function useGetMyLightscribeProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<LightscribeLabelProject[]>({
    queryKey: ["myLightscribeProjects"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMyLightscribeProjects();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLightscribeProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: LightscribeLabelProject) => {
      if (!actor) throw new Error("Actor not available");
      await actor.createLightscribeProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLightscribeProjects"] });
    },
  });
}

export function useUpdateLightscribeProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: LightscribeLabelProject) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateLightscribeProject(project);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myLightscribeProjects"] });
      queryClient.invalidateQueries({
        queryKey: ["lightscribeProject", variables.id],
      });
    },
  });
}

export function useDeleteLightscribeProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteLightscribeProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLightscribeProjects"] });
    },
  });
}

export function useAddExportRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: LightscribeExportRecord) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addExportRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLightscribeProjects"] });
    },
  });
}

export function useGetAllLightscribeTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<LightscribeTemplate[]>({
    queryKey: ["lightscribeTemplates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLightscribeTemplates();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function useGetAllAnalyticsData(enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<RefAnalyticsSummary | null>({
    queryKey: ["analyticsData"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAllAnalyticsData();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useRecordEvent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      eventType,
      ref,
      mediaId,
    }: {
      eventType: string;
      ref?: string | null;
      mediaId?: string | null;
    }) => {
      if (!actor) return;
      await actor.recordEvent(
        { caller: Principal.anonymous() },
        eventType,
        ref ?? null,
        mediaId ?? null,
      );
    },
  });
}

// ─── Bookkeeping ──────────────────────────────────────────────────────────────

export function useGetAllMembershipFeeRecords(enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<MembershipFeeRecord[]>({
    queryKey: ["membershipFeeRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMembershipFeeRecords();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useCreateMembershipFeeRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      artistId,
      amount,
      notes,
    }: { artistId: string; amount: bigint; notes?: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createMembershipFeeRecord(artistId, amount, notes ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipFeeRecords"] });
    },
  });
}

export function useUpdateMembershipFeeRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: MembershipFeeRecord) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateMembershipFeeRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipFeeRecords"] });
    },
  });
}

export function useDeleteMembershipFeeRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteMembershipFeeRecord(recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipFeeRecords"] });
    },
  });
}

export function useGetAllInvoiceRecords(enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<InvoiceRecord[]>({
    queryKey: ["invoiceRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvoiceRecords();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useCreateInvoiceRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      artistId,
      amount,
      description,
      mediaId,
      notes,
    }: {
      artistId: string;
      amount: bigint;
      description: string;
      mediaId?: string;
      notes?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createInvoiceRecord(
        artistId,
        amount,
        description,
        mediaId ?? null,
        notes ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoiceRecords"] });
    },
  });
}

export function useUpdateInvoiceRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: InvoiceRecord) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateInvoiceRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoiceRecords"] });
    },
  });
}

export function useDeleteInvoiceRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteInvoiceRecord(recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoiceRecords"] });
    },
  });
}

export function useGetAllPayoutRecords(enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<PayoutRecord[]>({
    queryKey: ["payoutRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPayoutRecords();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useCreatePayoutRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      artistId,
      amount,
      destinationAccount,
      payoutMethod,
      associatedMediaId,
      notes,
    }: {
      artistId: string;
      amount: bigint;
      destinationAccount: string;
      payoutMethod: string;
      associatedMediaId?: string;
      notes?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPayoutRecord(
        artistId,
        amount,
        destinationAccount,
        payoutMethod,
        associatedMediaId ?? null,
        notes ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payoutRecords"] });
    },
  });
}

export function useUpdatePayoutRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: PayoutRecord) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updatePayoutRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payoutRecords"] });
    },
  });
}

export function useDeletePayoutRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deletePayoutRecord(recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payoutRecords"] });
    },
  });
}

// ─── User Role Management ─────────────────────────────────────────────────────

export function useGetAllUsersWithRoles(enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<UserWithRole[]>({
    queryKey: ["usersWithRoles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsersWithRoles();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: { userId: Principal; role: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.assignUserRole(userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersWithRoles"] });
    },
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersWithRoles"] });
    },
  });
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export function useGetAllGalleryMedia() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ["galleryMedia"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllGalleryMedia();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMediaByCategory(category: ArtworkCategory | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ["mediaByCategory", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      try {
        return await actor.getMediaByCategory(category);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetArtistWorksByCategory(
  artistId: string | undefined,
  category: ArtworkCategory | undefined,
) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ["artistWorksByCategory", artistId, category],
    queryFn: async () => {
      if (!actor || !artistId || !category) return [];
      try {
        return await actor.getArtistWorksByCategory(artistId, category);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!artistId && !!category,
  });
}

export function useGetLicensingOptions(mediaId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["licensingOptions", mediaId],
    queryFn: async () => {
      if (!actor || !mediaId) return [];
      try {
        return await actor.getLicensingOptions(mediaId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!mediaId,
  });
}

// ─── Sound Waves — Artist Portal (client-side state) ─────────────────────────

export interface ArtistPortalProfile {
  submittedPieces: number;
  isEligible: boolean;
  sharesOwned: number;
  totalPaid: number;
  qualifiesForFreeShare: boolean;
  freeShareClaimed: boolean;
  pieces: Array<{ title: string; description: string; submittedAt: number }>;
}

const PORTAL_STORAGE_PREFIX = "swpm_artist_portal_";
const FREE_SHARE_COUNTER_KEY = "swpm_free_share_counter";
const FREE_SHARE_LIMIT = 100;

function getPortalStorageKey(principalId: string) {
  return `${PORTAL_STORAGE_PREFIX}${principalId}`;
}

function loadPortalData(principalId: string): ArtistPortalProfile {
  try {
    const raw = localStorage.getItem(getPortalStorageKey(principalId));
    if (raw) return JSON.parse(raw) as ArtistPortalProfile;
  } catch {
    // ignore
  }
  return {
    submittedPieces: 0,
    isEligible: false,
    sharesOwned: 0,
    totalPaid: 0,
    qualifiesForFreeShare: false,
    freeShareClaimed: false,
    pieces: [],
  };
}

function savePortalData(principalId: string, data: ArtistPortalProfile) {
  localStorage.setItem(getPortalStorageKey(principalId), JSON.stringify(data));
}

function getFreeShareCounter(): number {
  return Number.parseInt(
    localStorage.getItem(FREE_SHARE_COUNTER_KEY) ?? "0",
    10,
  );
}

function incrementFreeShareCounter() {
  const current = getFreeShareCounter();
  localStorage.setItem(FREE_SHARE_COUNTER_KEY, String(current + 1));
}

export function useGetArtistPortalProfile() {
  const { isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ArtistPortalProfile | null>({
    queryKey: ["artistPortalProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      const principalId = identity.getPrincipal().toString();
      const data = loadPortalData(principalId);
      // Recompute eligibility
      data.isEligible = data.submittedPieces >= 15;
      // Check free share eligibility
      const counter = getFreeShareCounter();
      if (
        data.isEligible &&
        counter < FREE_SHARE_LIMIT &&
        !data.freeShareClaimed
      ) {
        data.qualifiesForFreeShare = true;
      } else if (!data.isEligible || data.freeShareClaimed) {
        data.qualifiesForFreeShare = false;
      }
      return data;
    },
    enabled: !!identity && !isFetching,
  });
}

export function useSubmitMusicalPiece() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      title,
      description,
    }: { title: string; description: string }) => {
      if (!identity) throw new Error("Not authenticated");
      const principalId = identity.getPrincipal().toString();
      const data = loadPortalData(principalId);
      data.pieces.push({ title, description, submittedAt: Date.now() });
      data.submittedPieces = data.pieces.length;
      data.isEligible = data.submittedPieces >= 15;
      savePortalData(principalId, data);
      return data;
    },
    onSuccess: (_, _vars, _ctx) => {
      const principalId = identity?.getPrincipal().toString();
      queryClient.invalidateQueries({
        queryKey: ["artistPortalProfile", principalId],
      });
    },
  });
}

// ─── Sound Waves — Event Registration ────────────────────────────────────────

export interface EventRegistrationInput {
  attendeeName: string;
  email: string;
  ticketQuantity: number;
  successUrl: string;
  cancelUrl: string;
}

export function useCreateEventRegistration() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (
      input: EventRegistrationInput,
    ): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const priceInCents = BigInt(2500); // $25.00 per ticket
      const items: ShoppingItem[] = [
        {
          productName: "Sound Waves Event Ticket",
          productDescription: `Event ticket for ${input.attendeeName}`,
          priceInCents,
          quantity: BigInt(input.ticketQuantity),
          currency: "usd",
        },
      ];
      const result = await actor.createCheckoutSession(
        items,
        input.successUrl,
        input.cancelUrl,
      );
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
  });
}

// ─── Sound Waves — Share Purchase ─────────────────────────────────────────────

export interface SharePurchaseInput {
  quantity: number;
  successUrl: string;
  cancelUrl: string;
}

export function usePurchaseShares() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: SharePurchaseInput,
    ): Promise<CheckoutSession | null> => {
      if (!identity) throw new Error("Not authenticated");
      const principalId = identity.getPrincipal().toString();
      const data = loadPortalData(principalId);

      // Determine how many shares need payment (free share deducted)
      const qualifiesForFreeShare =
        data.isEligible &&
        getFreeShareCounter() < FREE_SHARE_LIMIT &&
        !data.freeShareClaimed;
      const paidQuantity = qualifiesForFreeShare
        ? Math.max(0, input.quantity - 1)
        : input.quantity;

      // Credit free share if applicable
      if (qualifiesForFreeShare) {
        data.freeShareClaimed = true;
        data.sharesOwned += 1;
        incrementFreeShareCounter();
      }

      if (paidQuantity === 0) {
        // Only free share — no payment needed, just save
        savePortalData(principalId, data);
        return null;
      }

      // Create Stripe checkout for paid shares
      if (!actor) throw new Error("Actor not available");
      const items: ShoppingItem[] = [
        {
          productName: "Sound Waves Publishing & Media Share",
          productDescription: `${paidQuantity} share${paidQuantity !== 1 ? "s" : ""} at $1.00 each`,
          priceInCents: BigInt(100), // $1.00 per share
          quantity: BigInt(paidQuantity),
          currency: "usd",
        },
      ];
      const result = await actor.createCheckoutSession(
        items,
        input.successUrl,
        input.cancelUrl,
      );
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");

      // Optimistically record shares (will be confirmed via webhook in production)
      data.sharesOwned += paidQuantity;
      data.totalPaid += paidQuantity * 1.0;
      savePortalData(principalId, data);

      return session;
    },
    onSuccess: () => {
      const principalId = identity?.getPrincipal().toString();
      queryClient.invalidateQueries({
        queryKey: ["artistPortalProfile", principalId],
      });
    },
  });
}

// ─── Sound Waves — Admin Data (client-side simulation) ───────────────────────

export interface ShareholderRecord {
  name: string;
  email: string;
  sharesOwned: number;
  totalPaid: number;
  receivedFreeShare: boolean;
}

export interface EventRegistrationRecord {
  attendeeName: string;
  email: string;
  ticketQuantity: number;
  totalPaid: number;
  paymentStatus: string;
  timestamp: number;
}

export interface AccountingTransaction {
  transactionType: string;
  amount: number;
  userPrincipal: string;
  timestamp: number;
}

// These pull from localStorage data written by the portal hooks above
function getAllPortalProfiles(): Array<{
  principalId: string;
  data: ArtistPortalProfile;
}> {
  const results: Array<{ principalId: string; data: ArtistPortalProfile }> = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PORTAL_STORAGE_PREFIX)) {
      const principalId = key.replace(PORTAL_STORAGE_PREFIX, "");
      try {
        const raw = localStorage.getItem(key);
        if (raw)
          results.push({
            principalId,
            data: JSON.parse(raw) as ArtistPortalProfile,
          });
      } catch {
        // ignore
      }
    }
  }
  return results;
}

const EVENT_REGISTRATIONS_KEY = "swpm_event_registrations";

function loadEventRegistrations(): EventRegistrationRecord[] {
  try {
    const raw = localStorage.getItem(EVENT_REGISTRATIONS_KEY);
    if (raw) return JSON.parse(raw) as EventRegistrationRecord[];
  } catch {
    // ignore
  }
  return [];
}

export function useGetAllShareholders() {
  const { identity } = useInternetIdentity();

  return useQuery<ShareholderRecord[]>({
    queryKey: ["allShareholders"],
    queryFn: async () => {
      const profiles = getAllPortalProfiles();
      return profiles
        .filter((p) => p.data.sharesOwned > 0)
        .map((p) => ({
          name: `${p.principalId.slice(0, 8)}...`,
          email: "N/A",
          sharesOwned: p.data.sharesOwned,
          totalPaid: p.data.totalPaid,
          receivedFreeShare: p.data.freeShareClaimed,
        }));
    },
    enabled: !!identity,
  });
}

export function useGetAllEventRegistrations() {
  const { identity } = useInternetIdentity();

  return useQuery<EventRegistrationRecord[]>({
    queryKey: ["allEventRegistrations"],
    queryFn: async () => {
      return loadEventRegistrations();
    },
    enabled: !!identity,
  });
}

export function useGetAccountingLog() {
  const { identity } = useInternetIdentity();

  return useQuery<AccountingTransaction[]>({
    queryKey: ["accountingLog"],
    queryFn: async () => {
      const transactions: AccountingTransaction[] = [];
      const profiles = getAllPortalProfiles();
      for (const { principalId, data } of profiles) {
        if (data.freeShareClaimed) {
          transactions.push({
            transactionType: "free_share",
            amount: 0,
            userPrincipal: principalId,
            timestamp: Date.now(),
          });
        }
        if (data.totalPaid > 0) {
          transactions.push({
            transactionType: "share_purchase",
            amount: data.totalPaid,
            userPrincipal: principalId,
            timestamp: Date.now(),
          });
        }
      }
      const registrations = loadEventRegistrations();
      for (const reg of registrations) {
        transactions.push({
          transactionType: "event_ticket",
          amount: reg.totalPaid,
          userPrincipal: reg.email,
          timestamp: reg.timestamp,
        });
      }
      return transactions.sort((a, b) => b.timestamp - a.timestamp);
    },
    enabled: !!identity,
  });
}
