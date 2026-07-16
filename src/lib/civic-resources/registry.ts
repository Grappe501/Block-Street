import fs from "fs";
import path from "path";
import type {
  CivicResourceCardProjection,
  ExternalCivicResource,
  ExternalCivicResourcesRegistry,
  GetLoudCardVariant,
} from "./types";

const REGISTRY_PATH = path.join(process.cwd(), "data", "registry", "external-civic-resources.json");
const GET_LOUD_PATH = path.join(process.cwd(), "data", "civic-education", "get-loud-arkansas.json");
const LANGUAGE_PATH = path.join(process.cwd(), "data", "civic-education", "get-loud-language-support.json");

type GetLoudEducation = {
  relationshipLabel: string;
  missionSummary: string;
  historySummary: string;
  initiativeSummaries: Array<{ key: string; title: string; summary: string }>;
  registrationTool: {
    url: string;
    sensitiveInformationWarning: string;
    postSubmissionGuidance: string;
  };
  organizationUrl: string;
  shortDisclosure: string;
  fullDisclosure: string;
  officialConfirmationResource: { url: string };
};

type LanguageSupport = {
  blockStreetCopy: Record<string, Record<string, string>>;
};

let registryCache: ExternalCivicResourcesRegistry | null = null;

export function loadExternalCivicResourcesRegistry(): ExternalCivicResourcesRegistry {
  if (!registryCache) {
    registryCache = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8")) as ExternalCivicResourcesRegistry;
  }
  return registryCache;
}

export function getExternalCivicResource(resourceKey: string): ExternalCivicResource | undefined {
  return loadExternalCivicResourcesRegistry().resources.find((r) => r.resourceKey === resourceKey);
}

export function getActiveExternalCivicResource(resourceKey: string): ExternalCivicResource | undefined {
  const resource = getExternalCivicResource(resourceKey);
  return resource?.status === "active" ? resource : undefined;
}

export function loadGetLoudEducation(): GetLoudEducation {
  return JSON.parse(fs.readFileSync(GET_LOUD_PATH, "utf8")) as GetLoudEducation;
}

export function loadGetLoudLanguageSupport(): LanguageSupport {
  return JSON.parse(fs.readFileSync(LANGUAGE_PATH, "utf8")) as LanguageSupport;
}

export function getGetLoudCopy(locale: "en" | "es" = "en"): Record<string, string> {
  const support = loadGetLoudLanguageSupport();
  return support.blockStreetCopy[locale] ?? support.blockStreetCopy.en;
}

export function getCanonicalGetLoudFormUrl(): string {
  const resource = getActiveExternalCivicResource("get-loud-easy-application");
  if (!resource) throw new Error("Get Loud Easy Application resource unavailable");
  return resource.url;
}

export function assertSafeQrUrl(url: string): void {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") throw new Error("QR URL must be HTTPS");
  if (parsed.search) throw new Error("QR URL must not contain query parameters");
  if (parsed.hash) throw new Error("QR URL must not contain hash fragments");
  const allowedHosts = new Set(["form.jotform.com"]);
  if (!allowedHosts.has(parsed.hostname)) throw new Error(`QR host not allowed: ${parsed.hostname}`);
}

export function projectGetLoudCard(
  variant: GetLoudCardVariant = "compact",
  locale: "en" | "es" = "en",
): CivicResourceCardProjection | null {
  const form = getActiveExternalCivicResource("get-loud-easy-application");
  const homepage = getActiveExternalCivicResource("get-loud-arkansas-homepage");
  const confirmation = getActiveExternalCivicResource("arkansas-voterview");
  if (!form || !homepage) return null;

  const copy = getGetLoudCopy(locale);
  const education = loadGetLoudEducation();

  return {
    resourceKey: form.resourceKey,
    title: copy.compactTitle ?? form.title,
    shortDescription: copy.compactBody ?? form.shortDescription,
    shortDisclosure: copy.shortDisclosure ?? education.shortDisclosure,
    formUrl: form.url,
    homepageUrl: homepage.url,
    confirmationUrl: confirmation?.url ?? education.officialConfirmationResource.url,
    learnHref: "/learn/voter-registration/get-loud-arkansas",
    printHref: "/resources/voter-registration/get-loud/print",
    presentHref: "/resources/voter-registration/get-loud/present",
    qrApiPath: "/api/civic-resources/qr?resource=get-loud-easy-application",
    destinationDomain: new URL(form.url).hostname,
    status: form.status,
    sensitiveWarning: copy.sensitiveWarning ?? education.registrationTool.sensitiveInformationWarning,
    locale,
  };
}

export function resolveOutreachToken(tokenKey: string): string | undefined {
  return loadExternalCivicResourcesRegistry().outreachTokens[tokenKey];
}

export function shouldShowGetLoudOnHome(membershipPositionId?: string | null): boolean {
  return true;
}

export function getGetLoudVariantForSurface(surface: string): GetLoudCardVariant {
  if (surface === "home" || surface === "profile") return "compact";
  if (surface === "registration_command") return "voter_registration_command";
  if (surface === "event") return "event";
  if (surface === "training") return "training";
  return "standard";
}

export function isRegistrationCommitteeContext(positionId?: string | null): boolean {
  if (!positionId) return false;
  return /registration|voter-registration|outreach|community|events|college|county/i.test(positionId);
}
