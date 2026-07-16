/** CPOS Person-to-Committee — canonical onboarding journey states (Wave 2). */
export type OnboardingStage =
  | "invited"
  | "registered"
  | "profile_started"
  | "profile_complete"
  | "contacted"
  | "onboarding"
  | "placement_recommended"
  | "placed"
  | "activated";

export type CommunicationPreference = "email" | "text" | "phone" | "in_app";

export type OnboardingResponse = {
  user_id: string;
  work_enjoyment?: string;
  work_style?: "people" | "details" | "content" | "behind_scenes";
  location_preference?: "home" | "in_person" | "both";
  time_commitment?: string;
  motivation?: string;
  suggested_lane?: string;
  chosen_lane?: string;
  updated_at: string;
};

export type PersonalNextAction = {
  id: string;
  title: string;
  description: string;
  href?: string;
  priority: number;
  kind: "orientation" | "meeting" | "task" | "training" | "power_of_5" | "profile";
};

export type BulletinPostPreview = {
  id: string;
  kind: "announcement" | "meeting_update" | "request" | "recognition" | "resource";
  title: string;
  excerpt: string;
  posted_at: string;
  scope_label: string;
};

export type PersonalHome = {
  user_id: string;
  welcome_name: string;
  onboarding_stage: OnboardingStage;
  identity: {
    display_name: string;
    preferred_name: string;
    avatar_url: string | null;
    city_county: string | null;
    institution_label: string | null;
    communication_preference: CommunicationPreference | null;
    real_name_required: true;
  };
  place: {
    county: string | null;
    county_slug: string | null;
    cluster: string | null;
    cluster_key: string | null;
    institution: string | null;
    committee_name: string | null;
    committee_id: string | null;
  } | null;
  role: {
    title: string;
    participation_type: "volunteer" | "lead" | "prospect";
    responsibilities: string[];
    reports_to: string | null;
    support_contact: string | null;
  } | null;
  next_action: PersonalNextAction | null;
  next_meeting: {
    title: string;
    starts_at: string;
    location: string;
    href: string | null;
  } | null;
  committee_messages: BulletinPostPreview[];
  people_to_know: Array<{ name: string; role: string; href: string | null }>;
  progress: {
    tasks_completed: number;
    meetings_attended: number;
    volunteer_hours: number;
    milestones: string[];
  };
  disclosure_level: "welcome" | "standard" | "full";
  links: {
    network: string;
    choose_place: string;
    calendar: string;
    outreach_queue: string | null;
  };
};
