import { GetLoudPresentClient } from "@/components/civic-resources/GetLoudPresentClient";
import { getGetLoudCopy, projectGetLoudCard } from "@/lib/civic-resources/registry";

export const metadata = {
  title: "Present · Get Loud registration QR",
};

export default function GetLoudPresentPage() {
  const projectionEn = projectGetLoudCard("event", "en");
  const projectionEs = projectGetLoudCard("event", "es");
  if (!projectionEn) return null;

  return (
    <GetLoudPresentClient
      projectionEn={projectionEn}
      projectionEs={projectionEs ?? projectionEn}
      copyEn={getGetLoudCopy("en")}
      copyEs={getGetLoudCopy("es")}
    />
  );
}
