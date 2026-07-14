export type PersonalNetworkProfile = {
  user_id: string;
  share_slug: string;
  display_name: string;
  preferred_name: string;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
};

export type NetworkMember = {
  user_id: string;
  display_name: string;
  preferred_name: string;
  share_slug: string | null;
  joined_at: string;
  via: "invite" | "referral";
};

export type NetworkBoard = {
  profile: PersonalNetworkProfile;
  share_url_path: string;
  home_place: {
    kind: string;
    slug: string;
    name: string;
    county_slug?: string;
  } | null;
  members: NetworkMember[];
  invites_pending: number;
  stats: {
    network_size: number;
    referrals: number;
  };
};
