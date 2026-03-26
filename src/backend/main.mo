import AccessControl "authorization/access-control";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import Set "mo:core/Set";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserRole = AccessControl.UserRole;
  public type UserWithRole = {
    userId : Principal;
    name : Text;
    email : Text;
    role : Text;
  };

  public type MediaType = {
    #music;
    #image;
    #video;
    #text;
  };

  public type ArtworkCategory = {
    #narrativeArts;
    #poetry;
    #photography;
    #artDesigns;
    #artsAndCrafts;
    #cinemaCreation;
    #musicalWorks;
    #scoreSheets;
  };

  public type SaleFormat = {
    formatType : Text;
    price : Nat;
    description : Text;
  };

  public type LicensingOption = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    terms : Text;
  };

  public type ArtistProfile = {
    id : Text;
    name : Text;
    bio : Text;
    contactInfo : Text;
    portfolio : [Text];
    licensingInfo : Text;
    elasticStageArtistUrl : ?Text;
    elasticStageArtistId : ?Text;
  };

  public type MediaMetadata = {
    id : Text;
    artistId : Text;
    title : Text;
    description : Text;
    mediaType : MediaType;
    copyrightInfo : Text;
    licensingOptions : [LicensingOption];
    fileReference : Storage.ExternalBlob;
    artworkCategory : ?ArtworkCategory;
    saleFormats : [SaleFormat];
  };

  public type PurchaseRecord = {
    id : Text;
    buyerId : Text;
    mediaId : Text;
    licensingOptionId : Text;
    timestamp : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type TrademarkRecord = {
    id : Text;
    artistId : Text;
    markName : Text;
    registrationNumber : Text;
    status : Text;
    description : Text;
    documentReference : ?Storage.ExternalBlob;
    filingDate : Nat;
  };

  public type LightscribeLabelProject = {
    id : Text;
    artistId : Text;
    projectName : Text;
    description : Text;
    canvasData : Text;
    layerData : Text;
    metadata : Text;
    createdTimestamp : Nat;
    modifiedTimestamp : Nat;
    previewImage : Storage.ExternalBlob;
    labelScriptFile : Storage.ExternalBlob;
    lsaFile : Storage.ExternalBlob;
    lssFile : Storage.ExternalBlob;
    printableImage : Storage.ExternalBlob;
    exportHistory : [LightscribeExportRecord];
  };

  public type LightscribeExportRecord = {
    id : Text;
    labelProjectId : Text;
    exportType : Text;
    fileReference : Storage.ExternalBlob;
    timestamp : Nat;
  };

  public type LightscribeTemplate = {
    templateType : Text;
    name : Text;
    description : Text;
    fileReference : Storage.ExternalBlob;
    createdBy : Text;
    createdTimestamp : Nat;
  };

  public type MerchantServicesConfig = {
    apiLoginId : Text;
    transactionKey : Text;
    endpoint : Text;
    allowedCountries : [Text];
  };

  public type NationalBankcardConfig = {
    merchantId : Text;
    apiKey : Text;
    endpoint : Text;
    allowedCountries : [Text];
  };

  public type AdminStripeSettings = {
    publishableKey : Text;
    secretKey : Text;
    webhookSecret : Text;
    testMode : Bool;
    allowedCountries : [Text];
  };

  public type SubscriptionStats = {
    activeSubscribers : Nat;
    monthlyRevenue : Nat;
    totalRevenue : Nat;
  };

  public type PaymentMethod = {
    #stripe;
    #merchantServices;
    #nationalBankcard;
  };

  public type CheckoutRequest = {
    buyerId : Text;
    items : [Stripe.ShoppingItem];
    successUrl : Text;
    cancelUrl : Text;
    paymentMethod : PaymentMethod;
  };

  public type CheckoutSessionResponse = {
    paymentMethod : PaymentMethod;
    sessionId : ?Text;
    redirectUrl : ?Text;
    message : Text;
  };

  public type MerchantServicesSessionStatus = {
    #failed : { error : Text };
    #completed : { response : Text; userPrincipal : ?Text };
  };

  public type NationalBankcardSessionStatus = {
    #failed : { error : Text };
    #completed : { response : Text; userPrincipal : ?Text };
  };

  public type MembershipFeeRecord = {
    id : Text;
    artistId : Text;
    amount : Nat;
    currency : Text;
    timestamp : Nat;
    notes : ?Text;
  };

  public type InvoiceRecord = {
    id : Text;
    artistId : Text;
    amount : Nat;
    currency : Text;
    timestamp : Nat;
    notes : ?Text;
    mediaId : ?Text;
    description : Text;
  };

  public type PayoutRecord = {
    id : Text;
    artistId : Text;
    amount : Nat;
    currency : Text;
    timestamp : Nat;
    notes : ?Text;
    destinationAccount : Text;
    payoutMethod : Text;
    associatedMediaId : ?Text;
  };

  var nextMembershipFeeRecordId = 1;
  var nextInvoiceId = 1;
  var nextPayoutId = 1;

  let artistProfiles = Map.empty<Text, ArtistProfile>();
  let mediaMetadata = Map.empty<Text, MediaMetadata>();
  let purchaseRecords = Map.empty<Text, PurchaseRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let trademarkRecords = Map.empty<Text, TrademarkRecord>();
  let principalToArtistId = Map.empty<Principal, Text>();
  let lightscribeProjects = Map.empty<Text, LightscribeLabelProject>();
  let lightscribeTemplates = Map.empty<Text, LightscribeTemplate>();

  let membershipFeeRecords = Map.empty<Text, MembershipFeeRecord>();
  let invoiceRecords = Map.empty<Text, InvoiceRecord>();
  let payoutRecords = Map.empty<Text, PayoutRecord>();

  var stripeConfig : ?Stripe.StripeConfiguration = null;
  var adminStripeSettings : ?AdminStripeSettings = null;
  var merchantServicesConfig : ?MerchantServicesConfig = ?{
    apiLoginId = "";
    transactionKey = "";
    endpoint = "";
    allowedCountries = [];
  };
  var nationalBankcardConfig : ?NationalBankcardConfig = ?{
    merchantId = "";
    apiKey = "";
    endpoint = "";
    allowedCountries = [];
  };

  public type RecordedEvent = {
    eventType : Text;
    ref : ?Text;
    mediaId : ?Text;
    timestamp : Nat;
  };

  public type EventCount = {
    eventType : Text;
    count : Nat;
  };

  public type RefAggregatedCounts = {
    ref : ?Text;
    events : [EventCount];
    total : Nat;
  };

  public type RefAnalyticsSummary = {
    refCounts : [RefAggregatedCounts];
    lastUpdated : Nat;
    totalEvents : Nat;
  };

  let groupedEvents = Map.empty<Text, List.List<RecordedEvent>>();
  let refCounts = Map.empty<Text, Map.Map<Text, Nat>>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    assertIsUser(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    assertIsUserOrAdmin(user, caller);
    userProfiles.get(user);
  };

  func assertIsUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func assertIsAdmin(caller : Principal) {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func assertIsUserOrAdmin(user : Principal, caller : Principal) {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
  };

  func assertUserHasArtistProfile(caller : Principal, artistId : Text) {
    switch (principalToArtistId.get(caller)) {
      case (?ownedArtistId) {
        if (ownedArtistId != artistId) {
          Runtime.trap("Unauthorized: You can only modify your own artist profile");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: You must have an artist profile for this action");
      };
    };
  };

  func assertMediaOwnership(caller : Principal, mediaArtistId : Text) {
    switch (principalToArtistId.get(caller)) {
      case (?ownedArtistId) {
        if (ownedArtistId != mediaArtistId) {
          Runtime.trap("Unauthorized: You can only modify your own media");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: You must have an artist profile to modify media");
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    assertIsUser(caller);
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createArtistProfile(profile : ArtistProfile) : async () {
    assertIsUser(caller);
    assertNoExistingArtistProfile(caller);
    assertUniqueArtistId(profile.id);
    artistProfiles.add(profile.id, profile);
    principalToArtistId.add(caller, profile.id);
  };

  func assertNoExistingArtistProfile(caller : Principal) {
    switch (principalToArtistId.get(caller)) {
      case (?_) {
        Runtime.trap("Unauthorized: You already have an artist profile");
      };
      case (null) {};
    };
  };

  func assertUniqueArtistId(artistId : Text) {
    switch (artistProfiles.get(artistId)) {
      case (?_) {
        Runtime.trap("Artist profile ID already exists");
      };
      case (null) {};
    };
  };

  public query func getArtistProfile(artistId : Text) : async ArtistProfile {
    switch (artistProfiles.get(artistId)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Artist profile not found") };
    };
  };

  public query func getAllArtistProfiles() : async [ArtistProfile] {
    artistProfiles.values().toArray();
  };

  public shared ({ caller }) func updateArtistProfile(profile : ArtistProfile) : async () {
    assertIsUser(caller);
    assertUserHasArtistProfile(caller, profile.id);
    artistProfiles.add(profile.id, profile);
  };

  public shared ({ caller }) func deleteArtistProfile(artistId : Text) : async () {
    assertIsUser(caller);
    assertUserHasArtistProfile(caller, artistId);
    artistProfiles.remove(artistId);
    principalToArtistId.remove(caller);
  };

  public shared ({ caller }) func uploadMedia(metadata : MediaMetadata) : async () {
    assertIsUser(caller);
    assertUserHasArtistProfile(caller, metadata.artistId);
    mediaMetadata.add(metadata.id, metadata);
  };

  public query func getMedia(mediaId : Text) : async MediaMetadata {
    switch (mediaMetadata.get(mediaId)) {
      case (?metadata) { metadata };
      case (null) { Runtime.trap("Media not found") };
    };
  };

  public query func getAllMedia() : async [MediaMetadata] {
    mediaMetadata.values().toArray();
  };

  public query func getMediaByType(mediaType : MediaType) : async [MediaMetadata] {
    mediaMetadata.values().toArray().filter(func(m) { m.mediaType == mediaType });
  };

  public shared ({ caller }) func updateMedia(metadata : MediaMetadata) : async () {
    assertIsUser(caller);
    assertUserHasArtistProfile(caller, metadata.artistId);
    switch (mediaMetadata.get(metadata.id)) {
      case (?existingMedia) {
        if (existingMedia.artistId != metadata.artistId) {
          Runtime.trap("Unauthorized: You can only update your own media");
        };
        mediaMetadata.add(metadata.id, metadata);
      };
      case (null) {
        Runtime.trap("Media not found");
      };
    };
  };

  public shared ({ caller }) func deleteMedia(mediaId : Text) : async () {
    assertIsUser(caller);
    switch (mediaMetadata.get(mediaId)) {
      case (?existingMedia) {
        switch (principalToArtistId.get(caller)) {
          case (?ownedArtistId) {
            if (existingMedia.artistId != ownedArtistId) {
              Runtime.trap("Unauthorized: You can only delete your own media");
            };
          };
          case (null) {
            Runtime.trap("Unauthorized: You must have an artist profile to delete media");
          };
        };
      };
      case (null) {
        Runtime.trap("Media not found");
      };
    };
    mediaMetadata.remove(mediaId);
  };

  public query func getAllGalleryMedia() : async [MediaMetadata] {
    mediaMetadata.values().toArray();
  };

  public query func getMediaByCategory(category : ArtworkCategory) : async [MediaMetadata] {
    let results = mediaMetadata.values().toArray().filter(func(media) {
      switch (media.artworkCategory) {
        case (?mediaCategory) { mediaCategory == category };
        case (null) { false };
      };
    });
    results;
  };

  public query func getArtistWorksByCategory(artistId : Text, category : ArtworkCategory) : async [MediaMetadata] {
    let results = mediaMetadata.values().toArray().filter(func(media) {
      if (media.artistId == artistId) {
        return switch (media.artworkCategory) {
          case (?mediaCategory) { mediaCategory == category };
          case (null) { false };
        };
      };
      false;
    });
    results;
  };

  public shared ({ caller }) func purchaseLicense(record : PurchaseRecord) : async () {
    assertIsUser(caller);
    verifyBuyerId(record.buyerId, caller.toText());
    verifyMediaExists(record.mediaId);
    purchaseRecords.add(record.id, record);
  };

  func verifyBuyerId(buyerId : Text, callerText : Text) {
    if (buyerId != callerText) {
      Runtime.trap("Unauthorized: You can only purchase licenses for yourself");
    };
  };

  func verifyMediaExists(mediaId : Text) {
    switch (mediaMetadata.get(mediaId)) {
      case (null) { Runtime.trap("Media not found") };
      case (_) {};
    };
  };

  public query ({ caller }) func getPurchaseRecord(recordId : Text) : async PurchaseRecord {
    assertIsUser(caller);
    switch (purchaseRecords.get(recordId)) {
      case (?record) {
        verifyRecordAccess(record, caller);
        record;
      };
      case (null) { Runtime.trap("Purchase record not found") };
    };
  };

  func verifyRecordAccess(record : PurchaseRecord, caller : Principal) {
    let callerText = caller.toText();
    let isOwner = switch (principalToArtistId.get(caller)) {
      case (?artistId) {
        switch (mediaMetadata.get(record.mediaId)) {
          case (?media) { media.artistId == artistId };
          case (null) { false };
        };
      };
      case (null) { false };
    };
    if (record.buyerId != callerText and not isOwner and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: You can only view your own purchase records");
    };
  };

  public query ({ caller }) func getAllPurchaseRecords() : async [PurchaseRecord] {
    assertIsAdmin(caller);
    purchaseRecords.values().toArray();
  };

  public query ({ caller }) func getMyPurchases() : async [PurchaseRecord] {
    assertIsUser(caller);
    let callerText = caller.toText();
    purchaseRecords.values().toArray().filter(func(record) {
      record.buyerId == callerText;
    });
  };

  public query ({ caller }) func getArtistSales(artistId : Text) : async [PurchaseRecord] {
    assertIsUser(caller);
    verifyArtistSalesAccess(artistId, caller);
    getPurchasesForArtist(artistId);
  };

  func verifyArtistSalesAccess(artistId : Text, caller : Principal) {
    let isAuthorized = switch (principalToArtistId.get(caller)) {
      case (?ownedArtistId) { ownedArtistId == artistId };
      case (null) { false };
    };
    if (not isAuthorized and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: You can only view your own sales");
    };
  };

  func getPurchasesForArtist(artistId : Text) : [PurchaseRecord] {
    let artistMediaIds = getMediaIdsForArtist(artistId);
    purchaseRecords.values().toArray().filter(func(record) {
      artistMediaIds.contains(record.mediaId);
    });
  };

  func getMediaIdsForArtist(artistId : Text) : Set.Set<Text> {
    let artistMediaIds = Set.empty<Text>();
    for (media in mediaMetadata.values()) {
      if (media.artistId == artistId) {
        artistMediaIds.add(media.id);
      };
    };
    artistMediaIds;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public query func isMerchantServicesConfigured() : async Bool {
    merchantServicesConfig != null;
  };

  public query func isNationalBankcardConfigured() : async Bool {
    nationalBankcardConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    assertIsAdmin(caller);
    stripeConfig := ?config;
  };


  public shared ({ caller }) func setAdminStripeSettings(settings : AdminStripeSettings) : async () {
    assertIsAdmin(caller);
    adminStripeSettings := ?settings;
    // Also update the stripe config used for checkout
    stripeConfig := ?{
      secretKey = settings.secretKey;
      allowedCountries = settings.allowedCountries;
    };
  };

  public query ({ caller }) func getAdminStripeSettings() : async ?AdminStripeSettings {
    assertIsAdmin(caller);
    adminStripeSettings;
  };

  public query ({ caller }) func getSubscriptionStats() : async SubscriptionStats {
    assertIsAdmin(caller);
    let records = membershipFeeRecords.values().toArray();
    let total = records.size();
    var totalRevenue : Nat = 0;
    for (r in records.vals()) {
      totalRevenue += r.amount;
    };
    // Estimate active subscribers as total membership fee records
    {
      activeSubscribers = total;
      monthlyRevenue = if (total > 0) { totalRevenue / total } else { 0 };
      totalRevenue = totalRevenue;
    };
  };

  public shared ({ caller }) func setMerchantServicesConfiguration(config : MerchantServicesConfig) : async () {
    assertIsAdmin(caller);
    merchantServicesConfig := ?config;
  };

  public shared ({ caller }) func setNationalBankcardConfiguration(config : NationalBankcardConfig) : async () {
    assertIsAdmin(caller);
    nationalBankcardConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) {
        Runtime.trap("Stripe needs to be first configured - follow the setup instructions");
      };
      case (?value) { value };
    };
  };

  func getMerchantServicesConfiguration() : MerchantServicesConfig {
    switch (merchantServicesConfig) {
      case (null) { Runtime.trap("Merchant Services needs to be first configured") };
      case (?value) { value };
    };
  };

  func getNationalBankcardConfiguration() : NationalBankcardConfig {
    switch (nationalBankcardConfig) {
      case (null) { Runtime.trap("National Bankcard needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    assertIsUser(caller);
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    assertIsUser(caller);
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createUnifiedCheckoutSession(request : CheckoutRequest) : async CheckoutSessionResponse {
    assertIsUser(caller);
    verifyBuyerId(request.buyerId, caller.toText());
    switch (request.paymentMethod) {
      case (#stripe) {
        let sessionId = await Stripe.createCheckoutSession(
          getStripeConfiguration(),
          caller,
          request.items,
          request.successUrl,
          request.cancelUrl,
          transform,
        );
        {
          paymentMethod = #stripe;
          sessionId = ?sessionId;
          redirectUrl = null;
          message = "Stripe checkout session created successfully";
        };
      };
      case (#merchantServices) {
        Runtime.trap("IC backend currently only supports Stripe. Please implement Merchant Services client-side for now.");
      };
      case (#nationalBankcard) {
        Runtime.trap("IC backend currently only supports Stripe. Please implement National Bankcard client-side for now.");
      };
    };
  };

  public query func searchMediaByKeyword(keyword : Text) : async [MediaMetadata] {
    let filteredResults = mediaMetadata.values().toArray().filter(func(media) {
      media.title.toLower().contains(#text (keyword.toLower())) or media.description.toLower().contains(#text (keyword.toLower()));
    });
    filteredResults;
  };

  public query func getLicensingOptions(mediaId : Text) : async [LicensingOption] {
    switch (mediaMetadata.get(mediaId)) {
      case (?metadata) { metadata.licensingOptions };
      case (null) { Runtime.trap("Media not found") };
    };
  };

  public query func getArtistWorks(artistId : Text) : async [MediaMetadata] {
    mediaMetadata.values().toArray().filter(func(media) { Text.equal(media.artistId, artistId) });
  };

  public shared ({ caller }) func createTrademarkRecord(record : TrademarkRecord) : async () {
    assertIsUser(caller);
    assertUserHasArtistProfile(caller, record.artistId);
    trademarkRecords.add(record.id, record);
  };

  public shared ({ caller }) func updateTrademarkRecord(record : TrademarkRecord) : async () {
    assertIsUser(caller);
    assertUserHasArtistProfile(caller, record.artistId);
    switch (trademarkRecords.get(record.id)) {
      case (?existingRecord) {
        if (existingRecord.artistId != record.artistId) {
          Runtime.trap("Unauthorized: You can only update your own trademark records");
        };
        trademarkRecords.add(record.id, record);
      };
      case (null) {
        Runtime.trap("Trademark record not found");
      };
    };
  };

  public shared ({ caller }) func deleteTrademarkRecord(recordId : Text) : async () {
    assertIsUser(caller);
    switch (trademarkRecords.get(recordId)) {
      case (?existingRecord) {
        assertUserHasArtistProfile(caller, existingRecord.artistId);
        trademarkRecords.remove(recordId);
      };
      case (null) {
        Runtime.trap("Trademark record not found");
      };
    };
  };

  public query func getTrademarkRecord(recordId : Text) : async TrademarkRecord {
    switch (trademarkRecords.get(recordId)) {
      case (?record) { record };
      case (null) { Runtime.trap("Trademark record not found") };
    };
  };

  public query func getArtistTrademarks(artistId : Text) : async [TrademarkRecord] {
    trademarkRecords.values().toArray().filter(func(record) { record.artistId == artistId });
  };

  public query ({ caller }) func getMyTrademarks() : async [TrademarkRecord] {
    assertIsUser(caller);
    switch (principalToArtistId.get(caller)) {
      case (?artistId) {
        trademarkRecords.values().toArray().filter(func(record) { record.artistId == artistId });
      };
      case (null) {
        Runtime.trap("Unauthorized: You must have an artist profile to view your trademarks");
      };
    };
  };

  public shared ({ caller }) func createLightscribeProject(project : LightscribeLabelProject) : async () {
    assertIsUser(caller);
    assertUserHasArtistProfile(caller, project.artistId);
    lightscribeProjects.add(project.id, project);
  };

  public shared ({ caller }) func updateLightscribeProject(project : LightscribeLabelProject) : async () {
    assertIsUser(caller);
    assertUserHasArtistProfile(caller, project.artistId);
    switch (lightscribeProjects.get(project.id)) {
      case (?existingProject) {
        if (existingProject.artistId != project.artistId) {
          Runtime.trap("Unauthorized: You can only update your own projects");
        };
        lightscribeProjects.add(project.id, project);
      };
      case (null) {
        Runtime.trap("Project not found");
      };
    };
  };

  public shared ({ caller }) func deleteLightscribeProject(projectId : Text) : async () {
    assertIsUser(caller);
    switch (lightscribeProjects.get(projectId)) {
      case (?existingProject) {
        assertUserHasArtistProfile(caller, existingProject.artistId);
        lightscribeProjects.remove(projectId);
      };
      case (null) {
        Runtime.trap("Project not found");
      };
    };
  };

  public query ({ caller }) func getLightscribeProject(projectId : Text) : async LightscribeLabelProject {
    assertIsUser(caller);
    switch (lightscribeProjects.get(projectId)) {
      case (?project) {
        switch (principalToArtistId.get(caller)) {
          case (?ownedArtistId) {
            if (project.artistId != ownedArtistId and not (AccessControl.isAdmin(accessControlState, caller))) {
              Runtime.trap("Unauthorized: You can only view your own projects");
            };
            project;
          };
          case (null) {
            if (not (AccessControl.isAdmin(accessControlState, caller))) {
              Runtime.trap("Unauthorized: You can only view your own projects");
            };
            project;
          };
        };
      };
      case (null) {
        Runtime.trap("Project not found");
      };
    };
  };

  public query ({ caller }) func getMyLightscribeProjects() : async [LightscribeLabelProject] {
    assertIsUser(caller);
    switch (principalToArtistId.get(caller)) {
      case (?artistId) {
        lightscribeProjects.values().toArray().filter(func(project) { project.artistId == artistId });
      };
      case (null) {
        Runtime.trap("Unauthorized: You must have an artist profile to view your projects");
      };
    };
  };

  public shared ({ caller }) func addExportRecord(record : LightscribeExportRecord) : async () {
    assertIsUser(caller);
    switch (lightscribeProjects.get(record.labelProjectId)) {
      case (?project) {
        assertUserHasArtistProfile(caller, project.artistId);
        let updatedProject = {
          project with exportHistory = project.exportHistory.concat([record]);
        };
        lightscribeProjects.add(project.id, updatedProject);
      };
      case (null) {
        Runtime.trap("Project not found");
      };
    };
  };

  public shared ({ caller }) func saveLightscribeTemplate(template : LightscribeTemplate) : async () {
    assertIsAdmin(caller);
    lightscribeTemplates.add(template.name, template);
  };

  public query func getLightscribeTemplateByName(name : Text) : async LightscribeTemplate {
    switch (lightscribeTemplates.get(name)) {
      case (?template) { template };
      case (null) { Runtime.trap("Template not found") };
    };
  };

  public query func getAllLightscribeTemplates() : async [LightscribeTemplate] {
    lightscribeTemplates.values().toArray();
  };

  public query ({ caller }) func getProjectExportHistory(projectId : Text) : async [LightscribeExportRecord] {
    assertIsUser(caller);
    switch (lightscribeProjects.get(projectId)) {
      case (?project) {
        switch (principalToArtistId.get(caller)) {
          case (?ownedArtistId) {
            if (project.artistId != ownedArtistId and not (AccessControl.isAdmin(accessControlState, caller))) {
              Runtime.trap("Unauthorized: You can only view export history for your own projects");
            };
            project.exportHistory;
          };
          case (null) {
            if (not (AccessControl.isAdmin(accessControlState, caller))) {
              Runtime.trap("Unauthorized: You can only view export history for your own projects");
            };
            project.exportHistory;
          };
        };
      };
      case (null) {
        Runtime.trap("Project not found");
      };
    };
  };

  public shared ({ caller }) func recordEvent(_caller : { caller : Principal }, eventType : Text, ref : ?Text, mediaId : ?Text) : async () {
    let timestamp = Int.abs(Time.now());

    let newEvent = {
      eventType;
      ref;
      mediaId;
      timestamp;
    };

    let finalRef = switch (ref) {
      case (?r) { r };
      case (null) { "null" };
    };

    switch (groupedEvents.get(finalRef)) {
      case (?existingList) {
        existingList.add(newEvent);
      };
      case (null) {
        let newList = List.empty<RecordedEvent>();
        newList.add(newEvent);
        groupedEvents.add(finalRef, newList);
      };
    };

    let refToUse = switch (ref) {
      case (?r) { r };
      case (null) { "all" };
    };

    let sanitizedRef = if (finalRef == "null") { "all" } else { refToUse };

    switch (refCounts.get(sanitizedRef)) {
      case (?eventMap) {
        let currentCount = switch (eventMap.get(eventType)) {
          case (?count) { count + 1 };
          case (null) { 1 };
        };
        eventMap.add(eventType, currentCount);
      };
      case (null) {
        let newEventMap = Map.empty<Text, Nat>();
        newEventMap.add(eventType, 1);
        refCounts.add(sanitizedRef, newEventMap);
      };
    };
  };

  public shared ({ caller }) func getAllAnalyticsData() : async RefAnalyticsSummary {
    assertIsAdmin(caller);

    let refAggregatedList = List.empty<RefAggregatedCounts>();
    var totalEvents = 0;

    switch (refCounts.get("all")) {
      case (?allRefCounts) {
        for ((_, count) in allRefCounts.entries()) {
          totalEvents += count;
        };
      };
      case (null) {};
    };

    for ((ref, eventCounts) in refCounts.entries()) {
      if (ref != "all") {
        let eventCountList = List.empty<EventCount>();
        var refTotal = 0;

        for ((eventType, count) in eventCounts.entries()) {
          eventCountList.add({ eventType; count });
          refTotal += count;
        };

        refAggregatedList.add({
          ref = ?ref;
          events = eventCountList.toArray();
          total = refTotal;
        });
      };
    };

    let summary = {
      refCounts = refAggregatedList.toArray();
      lastUpdated = Int.abs(Time.now());
      totalEvents;
    };

    summary;
  };

  public shared ({ caller }) func createMembershipFeeRecord(artistId : Text, amount : Nat, notes : ?Text) : async Text {
    assertIsAdmin(caller);
    let id = nextMembershipFeeRecordId.toText();
    nextMembershipFeeRecordId += 1;

    let record : MembershipFeeRecord = {
      id;
      artistId;
      amount;
      currency = "USD";
      timestamp = Int.abs(Time.now());
      notes;
    };
    membershipFeeRecords.add(id, record);
    id;
  };

  public shared ({ caller }) func updateMembershipFeeRecord(record : MembershipFeeRecord) : async () {
    assertIsAdmin(caller);
    membershipFeeRecords.add(record.id, record);
  };

  public shared ({ caller }) func deleteMembershipFeeRecord(recordId : Text) : async () {
    assertIsAdmin(caller);
    membershipFeeRecords.remove(recordId);
  };

  public query ({ caller }) func getMembershipFeeRecord(recordId : Text) : async MembershipFeeRecord {
    assertIsAdmin(caller);
    switch (membershipFeeRecords.get(recordId)) {
      case (?record) { record };
      case (null) { Runtime.trap("Membership fee record not found") };
    };
  };

  public query ({ caller }) func getAllMembershipFeeRecords() : async [MembershipFeeRecord] {
    assertIsAdmin(caller);
    membershipFeeRecords.values().toArray();
  };

  public shared ({ caller }) func createInvoiceRecord(artistId : Text, amount : Nat, description : Text, mediaId : ?Text, notes : ?Text) : async Text {
    assertIsAdmin(caller);
    let id = nextInvoiceId.toText();
    nextInvoiceId += 1;

    let record : InvoiceRecord = {
      id;
      artistId;
      amount;
      currency = "USD";
      timestamp = Int.abs(Time.now());
      notes;
      mediaId;
      description;
    };
    invoiceRecords.add(id, record);
    id;
  };

  public shared ({ caller }) func updateInvoiceRecord(record : InvoiceRecord) : async () {
    assertIsAdmin(caller);
    invoiceRecords.add(record.id, record);
  };

  public shared ({ caller }) func deleteInvoiceRecord(recordId : Text) : async () {
    assertIsAdmin(caller);
    invoiceRecords.remove(recordId);
  };

  public query ({ caller }) func getInvoiceRecord(recordId : Text) : async InvoiceRecord {
    assertIsAdmin(caller);
    switch (invoiceRecords.get(recordId)) {
      case (?record) { record };
      case (null) { Runtime.trap("Invoice record not found") };
    };
  };

  public query ({ caller }) func getAllInvoiceRecords() : async [InvoiceRecord] {
    assertIsAdmin(caller);
    invoiceRecords.values().toArray();
  };

  public shared ({ caller }) func createPayoutRecord(artistId : Text, amount : Nat, destinationAccount : Text, payoutMethod : Text, associatedMediaId : ?Text, notes : ?Text) : async Text {
    assertIsAdmin(caller);
    let id = nextPayoutId.toText();
    nextPayoutId += 1;

    let record : PayoutRecord = {
      id;
      artistId;
      amount;
      currency = "USD";
      timestamp = Int.abs(Time.now());
      notes;
      destinationAccount;
      payoutMethod;
      associatedMediaId;
    };
    payoutRecords.add(id, record);
    id;
  };

  public shared ({ caller }) func updatePayoutRecord(record : PayoutRecord) : async () {
    assertIsAdmin(caller);
    payoutRecords.add(record.id, record);
  };

  public shared ({ caller }) func deletePayoutRecord(recordId : Text) : async () {
    assertIsAdmin(caller);
    payoutRecords.remove(recordId);
  };

  public query ({ caller }) func getPayoutRecord(recordId : Text) : async PayoutRecord {
    assertIsAdmin(caller);
    switch (payoutRecords.get(recordId)) {
      case (?record) { record };
      case (null) { Runtime.trap("Payout record not found") };
    };
  };

  public query ({ caller }) func getAllPayoutRecords() : async [PayoutRecord] {
    assertIsAdmin(caller);
    payoutRecords.values().toArray();
  };

  public query ({ caller }) func getAllUsersWithRoles() : async [UserWithRole] {
    assertIsAdmin(caller);
    let users = userProfiles.entries().toArray();

    users.map(
      func((userId, userProfile)) {
        {
          userId;
          name = userProfile.name;
          email = userProfile.email;
          role = getUserRoleText(userId);
        };
      }
    );
  };

  func getUserRoleText(userId : Principal) : Text {
    switch (AccessControl.getUserRole(accessControlState, userId)) {
      case (#admin) { "admin" };
      case (#user) { "user" };
      case (#guest) { "guest" };
    };
  };

  public shared ({ caller }) func assignUserRole(userId : Principal, role : Text) : async () {
    assertIsAdmin(caller);

    let newRole = switch (role) {
      case ("admin") { #admin };
      case ("user") { #user };
      case ("guest") { #guest };
      case (_) { Runtime.trap("Invalid role value") };
    };

    AccessControl.assignRole(accessControlState, caller, userId, newRole);

    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("No profile for given userId") };
      case (?_) {};
    };
  };

  public shared ({ caller }) func deleteUser(userId : Principal) : async () {
    assertIsAdmin(caller);
    userProfiles.remove(userId);
  };
};
