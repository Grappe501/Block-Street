export type ExternalCivicResourceStatus =
  | "active"
  | "needs_review"
  | "temporarily_hidden"
  | "retired";

export type ExternalCivicResource = {
  resourceKey: string;
  providerName: string;
  providerType: "nonprofit" | "government" | "partner" | "independent_service";
  title: string;
  shortDescription: string;
  fullDescription: string;
  url: string;
  languages: string[];
  opensExternally: boolean;
  qrEnabled: boolean;
  collectsSensitiveInformation: boolean;
  blockStreetReceivesData: boolean;
  ownershipDisclosure: string;
  completionDisclosure?: string;
  confirmationGuidance?: string;
  lastReviewedAt: string;
  reviewCadenceDays: number;
  status: ExternalCivicResourceStatus;
};

export type ExternalCivicResourcesRegistry = {
  version: string;
  buildId: string;
  updated: string;
  authority: string;
  resources: ExternalCivicResource[];
  outreachTokens: Record<string, string>;
};

export type GetLoudCardVariant =
  | "compact"
  | "standard"
  | "voter_registration_command"
  | "training"
  | "event";

export type CivicResourceCardProjection = {
  resourceKey: string;
  title: string;
  shortDescription: string;
  shortDisclosure: string;
  formUrl: string;
  homepageUrl: string;
  confirmationUrl: string;
  learnHref: string;
  printHref: string;
  presentHref: string;
  qrApiPath: string;
  destinationDomain: string;
  status: ExternalCivicResourceStatus;
  sensitiveWarning: string;
  locale: "en" | "es";
};
