# Network Tree

## Referral Graph Structure

Instead of storing only flat users, we store **relationships**.

```
Steve
├── Sarah
│     ├── Josh
│     ├── Emma
│     └── Nick
├── Michael
│     ├── Hannah
│     └── David
└── Emily
      ├── Chris
      ├── Noah
      └── Olivia
```

## What the Graph Tells Us

| Insight | Use |
|---------|-----|
| Who recruited whom | Attribution, thank-yous, mentorship |
| Network depth | How far relationships travel |
| Growth rate | Weekly/monthly new relationships |
| Active branches | Which networks are engaging |
| Leader emergence | Who helps others become organizers |

## No Forced Hierarchy

The tree is **informational**, not organizational authority.

- Steve did not "assign" Sarah, Michael, Emily
- Sarah's network is hers — not Steve's sub-team
- Leadership council governs platform, not individual networks

## Personal Share Links

Format: `/s/[slug]`

| Field | Example |
|-------|---------|
| slug | `steve-grappe` |
| full URL | `https://blockstreet.org/s/steve-grappe` |
| QR code | Generated PNG/SVG, downloadable |

When someone visits a share link:
1. They see who invited them
2. They start signup with `referred_by` pre-filled
3. On completion, they get their own link

## Network Board UI (Phase 4)

```
MY NETWORK
─────────────────────
42 Members in my tree
8 Active This Week
12 Pending Invites
4 Events (v1.2+)
3 Committees (v1.1+)
Goal Progress
Recent Activity Feed
─────────────────────
[Copy Link] [Download QR] [Invite by Email]
```

## Data Storage

- `users.referred_by_id` — direct parent in tree
- `referrals` table — explicit audit log of every connection
- Recursive queries for tree depth (Postgres WITH RECURSIVE)

## Anti-Gaming

We do **not** show public leaderboards ranked purely by recruit count.

Instead, network boards show **impact breadth**:
- Leaders developed (people in your tree who became active organizers)
- Events attended collectively
- Volunteer hours generated
- Committees formed
