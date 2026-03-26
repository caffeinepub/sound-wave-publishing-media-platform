import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface LightscribeLabelProject {
    id: string;
    previewImage: ExternalBlob;
    projectName: string;
    exportHistory: Array<LightscribeExportRecord>;
    modifiedTimestamp: bigint;
    canvasData: string;
    metadata: string;
    artistId: string;
    description: string;
    layerData: string;
    lsaFile: ExternalBlob;
    createdTimestamp: bigint;
    printableImage: ExternalBlob;
    labelScriptFile: ExternalBlob;
    lssFile: ExternalBlob;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface TrademarkRecord {
    id: string;
    status: string;
    documentReference?: ExternalBlob;
    artistId: string;
    description: string;
    registrationNumber: string;
    markName: string;
    filingDate: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface PayoutRecord {
    id: string;
    payoutMethod: string;
    destinationAccount: string;
    artistId: string;
    currency: string;
    notes?: string;
    associatedMediaId?: string;
    timestamp: bigint;
    amount: bigint;
}
export interface NationalBankcardConfig {
    endpoint: string;
    allowedCountries: Array<string>;
    merchantId: string;
    apiKey: string;
}
export interface EventCount {
    count: bigint;
    eventType: string;
}
export interface LightscribeTemplate {
    name: string;
    createdBy: string;
    description: string;
    templateType: string;
    createdTimestamp: bigint;
    fileReference: ExternalBlob;
}
export interface CheckoutRequest {
    paymentMethod: PaymentMethod;
    cancelUrl: string;
    buyerId: string;
    items: Array<ShoppingItem>;
    successUrl: string;
}
export interface RefAggregatedCounts {
    ref?: string;
    total: bigint;
    events: Array<EventCount>;
}
export interface InvoiceRecord {
    id: string;
    artistId: string;
    description: string;
    currency: string;
    notes?: string;
    timestamp: bigint;
    amount: bigint;
    mediaId?: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface SaleFormat {
    formatType: string;
    description: string;
    price: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface AdminStripeSettings {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    testMode: boolean;
    allowedCountries: Array<string>;
}
export interface SubscriptionStats {
    activeSubscribers: bigint;
    monthlyRevenue: bigint;
    totalRevenue: bigint;
}

export interface MediaMetadata {
    id: string;
    title: string;
    licensingOptions: Array<LicensingOption>;
    artistId: string;
    description: string;
    copyrightInfo: string;
    artworkCategory?: ArtworkCategory;
    mediaType: MediaType;
    fileReference: ExternalBlob;
    saleFormats: Array<SaleFormat>;
}
export interface RefAnalyticsSummary {
    refCounts: Array<RefAggregatedCounts>;
    lastUpdated: bigint;
    totalEvents: bigint;
}
export interface MembershipFeeRecord {
    id: string;
    artistId: string;
    currency: string;
    notes?: string;
    timestamp: bigint;
    amount: bigint;
}
export interface LicensingOption {
    id: string;
    terms: string;
    name: string;
    description: string;
    price: bigint;
}
export interface UserWithRole {
    userId: Principal;
    name: string;
    role: string;
    email: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface LightscribeExportRecord {
    id: string;
    exportType: string;
    timestamp: bigint;
    labelProjectId: string;
    fileReference: ExternalBlob;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface PurchaseRecord {
    id: string;
    licensingOptionId: string;
    buyerId: string;
    timestamp: bigint;
    mediaId: string;
}
export interface CheckoutSessionResponse {
    paymentMethod: PaymentMethod;
    redirectUrl?: string;
    message: string;
    sessionId?: string;
}
export interface ArtistProfile {
    id: string;
    bio: string;
    portfolio: Array<string>;
    contactInfo: string;
    name: string;
    elasticStageArtistUrl?: string;
    licensingInfo: string;
    elasticStageArtistId?: string;
}
export interface MerchantServicesConfig {
    transactionKey: string;
    endpoint: string;
    allowedCountries: Array<string>;
    apiLoginId: string;
}
export enum ArtworkCategory {
    musicalWorks = "musicalWorks",
    narrativeArts = "narrativeArts",
    artsAndCrafts = "artsAndCrafts",
    artDesigns = "artDesigns",
    cinemaCreation = "cinemaCreation",
    scoreSheets = "scoreSheets",
    poetry = "poetry",
    photography = "photography"
}
export enum MediaType {
    music = "music",
    video = "video",
    text = "text",
    image = "image"
}
export enum PaymentMethod {
    stripe = "stripe",
    merchantServices = "merchantServices",
    nationalBankcard = "nationalBankcard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExportRecord(record: LightscribeExportRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(userId: Principal, role: string): Promise<void>;
    createArtistProfile(profile: ArtistProfile): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createInvoiceRecord(artistId: string, amount: bigint, description: string, mediaId: string | null, notes: string | null): Promise<string>;
    createLightscribeProject(project: LightscribeLabelProject): Promise<void>;
    createMembershipFeeRecord(artistId: string, amount: bigint, notes: string | null): Promise<string>;
    createPayoutRecord(artistId: string, amount: bigint, destinationAccount: string, payoutMethod: string, associatedMediaId: string | null, notes: string | null): Promise<string>;
    createTrademarkRecord(record: TrademarkRecord): Promise<void>;
    createUnifiedCheckoutSession(request: CheckoutRequest): Promise<CheckoutSessionResponse>;
    deleteArtistProfile(artistId: string): Promise<void>;
    deleteInvoiceRecord(recordId: string): Promise<void>;
    deleteLightscribeProject(projectId: string): Promise<void>;
    deleteMedia(mediaId: string): Promise<void>;
    deleteMembershipFeeRecord(recordId: string): Promise<void>;
    deletePayoutRecord(recordId: string): Promise<void>;
    deleteTrademarkRecord(recordId: string): Promise<void>;
    deleteUser(userId: Principal): Promise<void>;
    getAllAnalyticsData(): Promise<RefAnalyticsSummary>;
    getAllArtistProfiles(): Promise<Array<ArtistProfile>>;
    getAllGalleryMedia(): Promise<Array<MediaMetadata>>;
    getAllInvoiceRecords(): Promise<Array<InvoiceRecord>>;
    getAllLightscribeTemplates(): Promise<Array<LightscribeTemplate>>;
    getAllMedia(): Promise<Array<MediaMetadata>>;
    getAllMembershipFeeRecords(): Promise<Array<MembershipFeeRecord>>;
    getAllPayoutRecords(): Promise<Array<PayoutRecord>>;
    getAllPurchaseRecords(): Promise<Array<PurchaseRecord>>;
    getAllUsersWithRoles(): Promise<Array<UserWithRole>>;
    getArtistProfile(artistId: string): Promise<ArtistProfile>;
    getArtistSales(artistId: string): Promise<Array<PurchaseRecord>>;
    getArtistTrademarks(artistId: string): Promise<Array<TrademarkRecord>>;
    getArtistWorks(artistId: string): Promise<Array<MediaMetadata>>;
    getArtistWorksByCategory(artistId: string, category: ArtworkCategory): Promise<Array<MediaMetadata>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInvoiceRecord(recordId: string): Promise<InvoiceRecord>;
    getLicensingOptions(mediaId: string): Promise<Array<LicensingOption>>;
    getLightscribeProject(projectId: string): Promise<LightscribeLabelProject>;
    getLightscribeTemplateByName(name: string): Promise<LightscribeTemplate>;
    getMedia(mediaId: string): Promise<MediaMetadata>;
    getMediaByCategory(category: ArtworkCategory): Promise<Array<MediaMetadata>>;
    getMediaByType(mediaType: MediaType): Promise<Array<MediaMetadata>>;
    getMembershipFeeRecord(recordId: string): Promise<MembershipFeeRecord>;
    getMyLightscribeProjects(): Promise<Array<LightscribeLabelProject>>;
    getMyPurchases(): Promise<Array<PurchaseRecord>>;
    getMyTrademarks(): Promise<Array<TrademarkRecord>>;
    getPayoutRecord(recordId: string): Promise<PayoutRecord>;
    getProjectExportHistory(projectId: string): Promise<Array<LightscribeExportRecord>>;
    getPurchaseRecord(recordId: string): Promise<PurchaseRecord>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTrademarkRecord(recordId: string): Promise<TrademarkRecord>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isMerchantServicesConfigured(): Promise<boolean>;
    isNationalBankcardConfigured(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    purchaseLicense(record: PurchaseRecord): Promise<void>;
    recordEvent(_caller: {
        caller: Principal;
    }, eventType: string, ref: string | null, mediaId: string | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveLightscribeTemplate(template: LightscribeTemplate): Promise<void>;
    searchMediaByKeyword(keyword: string): Promise<Array<MediaMetadata>>;
    setMerchantServicesConfiguration(config: MerchantServicesConfig): Promise<void>;
    setNationalBankcardConfiguration(config: NationalBankcardConfig): Promise<void>;
    getAdminStripeSettings(): Promise<[] | [AdminStripeSettings]>;
    getSubscriptionStats(): Promise<SubscriptionStats>;
    setAdminStripeSettings(settings: AdminStripeSettings): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateArtistProfile(profile: ArtistProfile): Promise<void>;
    updateInvoiceRecord(record: InvoiceRecord): Promise<void>;
    updateLightscribeProject(project: LightscribeLabelProject): Promise<void>;
    updateMedia(metadata: MediaMetadata): Promise<void>;
    updateMembershipFeeRecord(record: MembershipFeeRecord): Promise<void>;
    updatePayoutRecord(record: PayoutRecord): Promise<void>;
    updateTrademarkRecord(record: TrademarkRecord): Promise<void>;
    uploadMedia(metadata: MediaMetadata): Promise<void>;
}
