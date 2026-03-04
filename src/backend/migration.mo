import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldMediaType = { #music; #image; #video; #text };

  type OldMediaMetadata = {
    id : Text;
    artistId : Text;
    title : Text;
    description : Text;
    mediaType : OldMediaType;
    copyrightInfo : Text;
    licensingOptions : [OldLicensingOption];
    fileReference : Storage.ExternalBlob;
  };

  type OldArtistProfile = {
    id : Text;
    name : Text;
    bio : Text;
    contactInfo : Text;
    portfolio : [Text];
    licensingInfo : Text;
    elasticStageArtistUrl : ?Text;
    elasticStageArtistId : ?Text;
  };

  type OldPurchaseRecord = {
    id : Text;
    buyerId : Text;
    mediaId : Text;
    licensingOptionId : Text;
    timestamp : Nat;
  };

  type OldTrademarkRecord = {
    id : Text;
    artistId : Text;
    markName : Text;
    registrationNumber : Text;
    status : Text;
    description : Text;
    documentReference : ?Storage.ExternalBlob;
    filingDate : Nat;
  };

  public type OldUserProfile = {
    name : Text;
    email : Text;
  };

  type OldSaleFormat = {
    formatType : Text;
    price : Nat;
    description : Text;
  };

  type OldArtworkCategory = {
    #narrativeArts;
    #poetry;
    #photography;
    #artDesigns;
    #artsAndCrafts;
    #cinemaCreation;
    #musicalWorks;
    #scoreSheets;
  };

  type OldLicensingOption = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    terms : Text;
  };

  type OldPayoutRecord = {
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

  type OldMembershipFeeRecord = {
    id : Text;
    artistId : Text;
    amount : Nat;
    currency : Text;
    timestamp : Nat;
    notes : ?Text;
  };

  type OldInvoiceRecord = {
    id : Text;
    artistId : Text;
    amount : Nat;
    currency : Text;
    timestamp : Nat;
    notes : ?Text;
    mediaId : ?Text;
    description : Text;
  };

  type OldActor = {
    nextMembershipFeeRecordId : Nat;
    nextInvoiceId : Nat;
    nextPayoutId : Nat;
    artistProfiles : Map.Map<Text, OldArtistProfile>;
    mediaMetadata : Map.Map<Text, OldMediaMetadata>;
    purchaseRecords : Map.Map<Text, OldPurchaseRecord>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    trademarkRecords : Map.Map<Text, OldTrademarkRecord>;
    principalToArtistId : Map.Map<Principal, Text>;
    membershipFeeRecords : Map.Map<Text, OldMembershipFeeRecord>;
    invoiceRecords : Map.Map<Text, OldInvoiceRecord>;
    payoutRecords : Map.Map<Text, OldPayoutRecord>;
  };

  type NewMediaMetadata = {
    id : Text;
    artistId : Text;
    title : Text;
    description : Text;
    mediaType : OldMediaType;
    copyrightInfo : Text;
    licensingOptions : [OldLicensingOption];
    fileReference : Storage.ExternalBlob;
    artworkCategory : ?OldArtworkCategory;
    saleFormats : [OldSaleFormat];
  };

  type NewActor = {
    nextMembershipFeeRecordId : Nat;
    nextInvoiceId : Nat;
    nextPayoutId : Nat;
    artistProfiles : Map.Map<Text, OldArtistProfile>;
    mediaMetadata : Map.Map<Text, NewMediaMetadata>;
    purchaseRecords : Map.Map<Text, OldPurchaseRecord>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    trademarkRecords : Map.Map<Text, OldTrademarkRecord>;
    principalToArtistId : Map.Map<Principal, Text>;
    membershipFeeRecords : Map.Map<Text, OldMembershipFeeRecord>;
    invoiceRecords : Map.Map<Text, OldInvoiceRecord>;
    payoutRecords : Map.Map<Text, OldPayoutRecord>;
  };

  public func run(old : OldActor) : NewActor {
    let newMediaMetadata = old.mediaMetadata.map<Text, OldMediaMetadata, NewMediaMetadata>(
      func(_, oldMedia) {
        { oldMedia with artworkCategory = null; saleFormats = [] };
      }
    );

    {
      nextMembershipFeeRecordId = old.nextMembershipFeeRecordId;
      nextInvoiceId = old.nextInvoiceId;
      nextPayoutId = old.nextPayoutId;
      artistProfiles = old.artistProfiles;
      mediaMetadata = newMediaMetadata;
      purchaseRecords = old.purchaseRecords;
      userProfiles = old.userProfiles;
      trademarkRecords = old.trademarkRecords;
      principalToArtistId = old.principalToArtistId;
      membershipFeeRecords = old.membershipFeeRecords;
      invoiceRecords = old.invoiceRecords;
      payoutRecords = old.payoutRecords;
    };
  };
};
