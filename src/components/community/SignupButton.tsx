import Link from "next/link";
import { buildSignupHref } from "@/lib/data";

type SignupButtonProps = {
  county: string;
  school?: string;
  label?: string;
  className?: string;
};

export function SignupButton({ county, school, label = "Sign Up", className = "mt-6 btn-primary inline-block" }: SignupButtonProps) {
  return (
    <Link href={buildSignupHref({ county, school })} className={className}>
      {label}
    </Link>
  );
}
