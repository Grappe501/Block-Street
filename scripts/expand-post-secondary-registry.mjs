/**
 * Expands institutions.json with all Arkansas post-secondary types + county service map.
 * Run: node scripts/expand-post-secondary-registry.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const institutionsPath = join(root, "data/registry/institutions.json");
const countiesPath = join(root, "data/counties.json");
const servicePath = join(root, "data/registry/county-post-secondary-service.json");

const existing = JSON.parse(readFileSync(institutionsPath, "utf8"));
const counties = JSON.parse(readFileSync(countiesPath, "utf8"));
const existingSlugs = new Set(existing.map((i) => i.slug));

const defaultColors = { primary: "#003366", secondary: "#FFFFFF" };

function inst(entry) {
  return {
    representationStatus: "needs_organizer",
    v1Priority: true,
    hbcu: false,
    colors: defaultColors,
    ...entry,
  };
}

/** New post-secondary institutions (community colleges, trade, satellites, nursing) */
const additions = [
  // ——— Public community colleges ———
  inst({ slug: "arkansas-northeastern", name: "Arkansas Northeastern College", shortName: "ANC", type: "community_college", sector: "public", city: "Blytheville", county: "mississippi", founded: 1975, enrollment: 1500, website: "https://www.anc.edu", culture: "Public community college serving Northeast Arkansas and the Mississippi Delta. Open-access education close to home." }),
  inst({ slug: "asu-beebe", name: "Arkansas State University-Beebe", shortName: "ASU-Beebe", type: "community_college", sector: "public", city: "Beebe", county: "white", founded: 1927, enrollment: 5500, website: "https://www.asub.edu", culture: "Multi-campus public community college and the oldest two-year institution in the state." }),
  inst({ slug: "asu-beebe-heber-springs", name: "ASU-Beebe — Heber Springs", shortName: "ASU-Beebe Heber Springs", type: "community_college", sector: "public", city: "Heber Springs", county: "cleburne", founded: 1992, enrollment: 800, website: "https://www.asub.edu", culture: "ASU-Beebe campus serving Cleburne County and the Greers Ferry Lake region." }),
  inst({ slug: "asu-beebe-lrafb", name: "ASU-Beebe — Little Rock Air Force Base", shortName: "ASU-Beebe LRAFB", type: "community_college", sector: "public", city: "Jacksonville", county: "lonoke", founded: 1980, enrollment: 600, website: "https://www.asub.edu", culture: "ASU-Beebe site serving Lonoke County and the LRAFB community." }),
  inst({ slug: "asu-mid-south", name: "Arkansas State University Mid-South", shortName: "ASU Mid-South", type: "community_college", sector: "public", city: "West Memphis", county: "crittenden", founded: 1992, enrollment: 1400, website: "https://www.asumidsouth.edu", culture: "Public community college in the Memphis metro Delta region." }),
  inst({ slug: "asu-mountain-home", name: "Arkansas State University-Mountain Home", shortName: "ASU Mountain Home", type: "community_college", sector: "public", city: "Mountain Home", county: "baxter", founded: 1995, enrollment: 1500, website: "https://www.asumh.edu", culture: "Public community college serving the Twin Lakes and North Central Arkansas." }),
  inst({ slug: "asu-newport", name: "Arkansas State University-Newport", shortName: "ASU Newport", type: "community_college", sector: "public", city: "Newport", county: "jackson", founded: 1976, enrollment: 2500, website: "https://www.asun.edu", culture: "Public community college serving Jackson County and Northeast Arkansas." }),
  inst({ slug: "asu-three-rivers", name: "Arkansas State University Three Rivers", shortName: "ASU Three Rivers", type: "community_college", sector: "public", city: "Malvern", county: "hot-spring", founded: 2021, enrollment: 1200, website: "https://www.asutr.edu", culture: "Public community college formed from College of the Ouachitas — career and transfer pathways in Hot Spring County." }),
  inst({ slug: "black-river-technical", name: "Black River Technical College", shortName: "BRTC", type: "community_college", sector: "public", city: "Pocahontas", county: "randolph", founded: 1972, enrollment: 2000, website: "https://www.blackrivertech.edu", culture: "Public technical and community college serving Randolph County and the Black River region." }),
  inst({ slug: "cossatot-de-queen", name: "Cossatot Community College of the UA — De Queen", shortName: "Cossatot De Queen", type: "community_college", sector: "public", city: "De Queen", county: "sevier", founded: 1975, enrollment: 1500, website: "https://www.cccua.edu", culture: "UA community college campus serving Sevier County and Southwest Arkansas." }),
  inst({ slug: "cossatot-nashville", name: "Cossatot Community College of the UA — Nashville", shortName: "Cossatot Nashville", type: "community_college", sector: "public", city: "Nashville", county: "howard", founded: 1991, enrollment: 400, website: "https://www.cccua.edu", culture: "Cossatot satellite campus serving Howard County." }),
  inst({ slug: "cossatot-ashdown", name: "Cossatot Community College of the UA — Ashdown", shortName: "Cossatot Ashdown", type: "community_college", sector: "public", city: "Ashdown", county: "little-river", founded: 2000, enrollment: 350, website: "https://www.cccua.edu", culture: "Cossatot satellite campus serving Little River County." }),
  inst({ slug: "east-arkansas", name: "East Arkansas Community College", shortName: "EACC", type: "community_college", sector: "public", city: "Forrest City", county: "st-francis", founded: 1974, enrollment: 1500, website: "https://www.eacc.edu", culture: "Public community college serving St. Francis County and the Delta." }),
  inst({ slug: "east-arkansas-marianna", name: "East Arkansas Community College — Marianna", shortName: "EACC Marianna", type: "community_college", sector: "public", city: "Marianna", county: "lee", founded: 1990, enrollment: 300, website: "https://www.eacc.edu", culture: "EACC site serving Lee County in the Arkansas Delta." }),
  inst({ slug: "national-park", name: "National Park College", shortName: "NPC", type: "community_college", sector: "public", city: "Hot Springs", county: "garland", founded: 2003, enrollment: 2800, website: "https://www.np.edu", culture: "Public community college in Hot Springs serving Garland County and tourist-economy workforce needs." }),
  inst({ slug: "north-arkansas", name: "North Arkansas College", shortName: "Northark", type: "community_college", sector: "public", city: "Harrison", county: "boone", founded: 1973, enrollment: 2500, website: "https://www.northark.edu", culture: "Public community college serving Boone County and the Ozarks." }),
  inst({ slug: "north-arkansas-berryville", name: "North Arkansas College — Berryville", shortName: "Northark Berryville", type: "community_college", sector: "public", city: "Berryville", county: "carroll", founded: 2000, enrollment: 400, website: "https://www.northark.edu", culture: "North Arkansas College campus serving Carroll County." }),
  inst({ slug: "nwacc", name: "NorthWest Arkansas Community College", shortName: "NWACC", type: "community_college", sector: "public", city: "Bentonville", county: "benton", founded: 1989, enrollment: 8000, website: "https://www.nwacc.edu", culture: "Public community college serving the fast-growing Northwest Arkansas region." }),
  inst({ slug: "ozarka-melbourne", name: "Ozarka College — Melbourne", shortName: "Ozarka Melbourne", type: "community_college", sector: "public", city: "Melbourne", county: "izard", founded: 1975, enrollment: 1200, website: "https://www.ozarka.edu", culture: "Public community college serving Izard County and the Ozark foothills." }),
  inst({ slug: "ozarka-mountain-view", name: "Ozarka College — Mountain View", shortName: "Ozarka Mountain View", type: "community_college", sector: "public", city: "Mountain View", county: "stone", founded: 1990, enrollment: 600, website: "https://www.ozarka.edu", culture: "Ozarka campus serving Stone County and folk-culture region students." }),
  inst({ slug: "phillips-helena", name: "Phillips Community College of the UA — Helena", shortName: "Phillips Helena", type: "community_college", sector: "public", city: "Helena", county: "phillips", founded: 1965, enrollment: 1500, website: "https://www.pccua.edu", culture: "UA community college serving Phillips County and the Delta." }),
  inst({ slug: "phillips-stuttgart", name: "Phillips Community College of the UA — Stuttgart", shortName: "Phillips Stuttgart", type: "community_college", sector: "public", city: "Stuttgart", county: "arkansas", founded: 1980, enrollment: 500, website: "https://www.pccua.edu", culture: "Phillips campus serving Arkansas County and Grand Prairie agriculture region." }),
  inst({ slug: "phillips-dewitt", name: "Phillips Community College of the UA — DeWitt", shortName: "Phillips DeWitt", type: "community_college", sector: "public", city: "DeWitt", county: "arkansas", founded: 1995, enrollment: 250, website: "https://www.pccua.edu", culture: "Phillips satellite site serving Southeast Arkansas County." }),
  inst({ slug: "ua-pulaski-tech", name: "University of Arkansas Pulaski Technical College", shortName: "UA-PTC", type: "community_college", sector: "public", city: "North Little Rock", county: "pulaski", founded: 1945, enrollment: 6000, website: "https://www.uaptc.edu", culture: "Public technical and community college in Central Arkansas — career, transfer, and workforce programs." }),
  inst({ slug: "ua-pulaski-tech-saline", name: "UA Pulaski Tech — Saline County", shortName: "UA-PTC Saline", type: "community_college", sector: "public", city: "Benton", county: "saline", founded: 2005, enrollment: 1200, website: "https://www.uaptc.edu", culture: "UA-PTC campus serving Saline County and Central Arkansas commuters." }),
  inst({ slug: "south-arkansas", name: "South Arkansas Community College", shortName: "SouthArk", type: "community_college", sector: "public", city: "El Dorado", county: "union", founded: 1992, enrollment: 1500, website: "https://www.southark.edu", culture: "Public community college serving Union County and South Arkansas." }),
  inst({ slug: "south-arkansas-warren", name: "South Arkansas Community College — Warren", shortName: "SouthArk Warren", type: "community_college", sector: "public", city: "Warren", county: "bradley", founded: 2000, enrollment: 400, website: "https://www.southark.edu", culture: "SouthArk campus serving Bradley County." }),
  inst({ slug: "southeast-arkansas", name: "Southeast Arkansas College", shortName: "SEARK", type: "community_college", sector: "public", city: "Pine Bluff", county: "jefferson", founded: 1959, enrollment: 3500, website: "https://www.seark.edu", culture: "Public community college in Pine Bluff — open-access pathways alongside UAPB." }),
  inst({ slug: "uaccb", name: "University of Arkansas Community College at Batesville", shortName: "UACCB", type: "community_college", sector: "public", city: "Batesville", county: "independence", founded: 1997, enrollment: 1500, website: "https://www.uaccb.edu", culture: "UA community college serving Independence County and the White River valley." }),
  inst({ slug: "uacch-hope", name: "University of Arkansas Community College at Hope", shortName: "UACCH Hope", type: "community_college", sector: "public", city: "Hope", county: "hempstead", founded: 1965, enrollment: 1200, website: "https://www.uacch.edu", culture: "UA community college serving Hempstead County and Southwest Arkansas." }),
  inst({ slug: "uacch-texarkana", name: "UA Community College at Hope — Texarkana", shortName: "UACCH Texarkana", type: "community_college", sector: "public", city: "Texarkana", county: "miller", founded: 1980, enrollment: 2000, website: "https://www.uacch.edu", culture: "UA community college campus serving Miller County and the Texarkana metro." }),
  inst({ slug: "uaccm", name: "University of Arkansas Community College at Morrilton", shortName: "UACCM", type: "community_college", sector: "public", city: "Morrilton", county: "conway", founded: 1961, enrollment: 1800, website: "https://www.uaccm.edu", culture: "UA community college serving Conway County and the Arkansas River Valley." }),
  inst({ slug: "ua-rich-mountain", name: "University of Arkansas Rich Mountain", shortName: "UA Rich Mountain", type: "community_college", sector: "public", city: "Mena", county: "polk", founded: 1973, enrollment: 1000, website: "https://www.uarichmountain.edu", culture: "UA community college serving Polk County and the Ouachita Mountains." }),
  inst({ slug: "ua-rich-mountain-waldron", name: "UA Rich Mountain — Waldron", shortName: "UA Rich Mountain Waldron", type: "community_college", sector: "public", city: "Waldron", county: "scott", founded: 1990, enrollment: 350, website: "https://www.uarichmountain.edu", culture: "UA Rich Mountain satellite serving Scott County." }),

  // ——— Technical / trade / nursing ———
  inst({ slug: "northwest-technical-institute", name: "Northwest Technical Institute", shortName: "NTI", type: "technical_college", sector: "public", city: "Springdale", county: "washington", founded: 1975, enrollment: 800, website: "https://www.nti.edu", culture: "Public technical institute offering workforce certificates and skilled trades training in Northwest Arkansas." }),
  inst({ slug: "baptist-health-college", name: "Baptist Health College Little Rock", shortName: "BHCLR", type: "nursing_college", sector: "private", city: "Little Rock", county: "pulaski", founded: 2003, enrollment: 900, website: "https://www.bhclr.edu", culture: "Private health sciences college preparing nurses and allied health professionals." }),
  inst({ slug: "shorter-college", name: "Shorter College", shortName: "Shorter", type: "community_college", sector: "private", hbcu: true, city: "North Little Rock", county: "pulaski", founded: 1886, enrollment: 400, website: "https://www.shortercollege.edu", culture: "Private two-year HBCU offering associate degrees in Central Arkansas." }),
  inst({ slug: "bryan-university-rogers", name: "Bryan University — Rogers", shortName: "Bryan U Rogers", type: "trade_school", sector: "private", city: "Rogers", county: "benton", founded: 2015, enrollment: 300, website: "https://www.bryanuniversity.edu", culture: "Private career college offering trade and technical programs in Northwest Arkansas." }),
  inst({ slug: "champion-christian", name: "Champion Christian College", shortName: "Champion", type: "college", sector: "private", city: "Hot Springs", county: "garland", founded: 2005, enrollment: 200, website: "https://www.champion.edu", culture: "Private Christian college in Hot Springs offering associate and bachelor's programs." }),
  inst({ slug: "arkansas-welding-academy", name: "Arkansas Welding Academy", shortName: "AWA", type: "trade_school", sector: "private", city: "Jacksonville", county: "lonoke", founded: 2010, enrollment: 150, website: "https://www.arkansasweldingacademy.com", culture: "Private trade school specializing in welding and industrial skills." }),
  inst({ slug: "platt-college", name: "Platt College — Little Rock", shortName: "Platt", type: "trade_school", sector: "private", city: "Little Rock", county: "pulaski", founded: 1986, enrollment: 250, website: "https://www.plattcolleges.edu", culture: "Private career college offering allied health and technical programs." }),

  inst({ slug: "sau-tech", name: "Southern Arkansas University Tech", shortName: "SAU Tech", type: "technical_college", sector: "public", city: "Camden", county: "ouachita", founded: 1967, enrollment: 1200, website: "https://www.sautech.edu", culture: "Public technical college in Camden offering workforce certificates and two-year degrees in Ouachita County." }),
  inst({ slug: "ozarka-fulton", name: "Ozarka College — Fulton County Center", shortName: "Ozarka Fulton", type: "community_college", sector: "public", city: "Salem", county: "fulton", founded: 2005, enrollment: 150, website: "https://www.ozarka.edu", culture: "Ozarka instructional site serving Fulton County in the Ozarks." }),
  inst({ slug: "arkansas-state-beebe-searcy-center", name: "Arkansas State University — Searcy Center", shortName: "A-State Searcy", type: "university", sector: "public", city: "Searcy", county: "white", founded: 2010, enrollment: 200, website: "https://www.astate.edu", culture: "Arkansas State University instructional site offering select degree programs in White County." }),
];

const merged = [...existing];
for (const a of additions) {
  if (!existingSlugs.has(a.slug)) {
    merged.push(a);
    existingSlugs.add(a.slug);
  }
}

// Sort: county, then type, then name
const typeOrder = { university: 0, college: 1, community_college: 2, technical_college: 3, nursing_college: 4, trade_school: 5 };
merged.sort((a, b) => {
  const c = a.county.localeCompare(b.county);
  if (c !== 0) return c;
  return (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9) || a.name.localeCompare(b.name);
});

writeFileSync(institutionsPath, JSON.stringify(merged, null, 2) + "\n");

// Counties with at least one local institution
const localByCounty = {};
for (const i of merged) {
  (localByCounty[i.county] ??= []).push(i.slug);
}

// ADHE-style service map for counties without a local campus
const servedBy = {
  ashley: ["south-arkansas", "uam"],
  calhoun: ["ouachita-baptist", "henderson-state", "southeast-arkansas"],
  chicot: ["arkansas-northeastern", "southeast-arkansas"],
  clay: ["asu-newport", "black-river-technical"],
  cleveland: ["uaccm", "ua-pine-bluff"],
  cross: ["east-arkansas", "ua-pulaski-tech"],
  crawford: ["ua-fort-smith", "uaccm"],
  dallas: ["uam", "southeast-arkansas"],
  desha: ["southeast-arkansas", "uam", "phillips-helena"],
  franklin: ["atu", "uaccm"],
  grant: ["ua-pulaski-tech", "uaccm"],
  lafayette: ["southern-arkansas", "uacch-hope"],
  lincoln: ["ua-pine-bluff", "southeast-arkansas"],
  logan: ["atu", "uaccm"],
  madison: ["nwacc", "john-brown"],
  marion: ["north-arkansas", "asu-mountain-home"],
  monroe: ["uaccb", "east-arkansas"],
  montgomery: ["ua-rich-mountain", "national-park"],
  nevada: ["southern-arkansas", "uacch-hope"],
  newton: ["north-arkansas", "john-brown"],
  perry: ["uaccm", "national-park"],
  pike: ["cossatot-de-queen", "uacch-hope"],
  poinsett: ["asu-newport", "east-arkansas"],
  prairie: ["uaccb", "phillips-stuttgart"],
  searcy: ["uaccb", "north-arkansas"],
  sharp: ["uaccb", "ozarka-melbourne"],
  "van-buren": ["uaccb", "north-arkansas"],
  woodruff: ["east-arkansas", "uaccb"],
  yell: ["atu", "uaccm"],
};

const serviceDoc = {
  version: "1.0.0",
  description: "Post-secondary institutions serving counties without a local campus (commuter / district service)",
  lastUpdated: "2026-07-10",
  countiesWithLocalCampus: Object.keys(localByCounty).length,
  totalCounties: counties.length,
  servedBy,
  localByCounty,
};

writeFileSync(servicePath, JSON.stringify(serviceDoc, null, 2) + "\n");

const uncovered = counties.filter((c) => !localByCounty[c.slug] && !servedBy[c.slug]);
console.log(`Institutions: ${existing.length} → ${merged.length} (+${merged.length - existing.length})`);
console.log(`Counties with local campus: ${Object.keys(localByCounty).length}/75`);
console.log(`Counties with service map: ${Object.keys(servedBy).length}`);
if (uncovered.length) {
  console.warn("Counties without local or served mapping:", uncovered.map((c) => c.slug).join(", "));
} else {
  console.log("All 75 counties have local post-secondary or served-by mapping.");
}
