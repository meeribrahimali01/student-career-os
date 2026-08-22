/**
 * VIT Chennai Campus Map Vector Geometry & Route Graph
 *
 * Vector coordinates mapped to an SVG coordinate viewBox="0 0 1000 700".
 * Follows the real spatial layout of VIT Chennai on Vandalur-Kelambakkam Road.
 */

export interface BuildingPolygon {
  id: string;
  name: string;
  category: string;
  points: string; // SVG polygon points or path data
  fill: string;
  stroke: string;
  labelPos: { x: number; y: number };
  badgeText: string;
  isImportant?: boolean;
}

export interface Waypoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  neighbors: string[]; // Connected waypoint IDs
}

// Campus Roads, Boulevards, and Pedestrian Walkways
export const CAMPUS_ROADS = [
  // Arterial Highway: Vandalur - Kelambakkam Road along the bottom
  {
    d: "M 50,650 L 950,650",
    stroke: "#94A3B8",
    strokeWidth: 24,
    strokeDasharray: "none",
    type: "highway",
    label: "Vandalur - Kelambakkam Road",
  },
  {
    d: "M 50,650 L 950,650",
    stroke: "#F8FAFC",
    strokeWidth: 2,
    strokeDasharray: "12, 12",
    type: "highway_divider",
  },

  // Main Campus Entrance Boulevard (Northbound from Gate 1)
  {
    d: "M 300,650 L 300,540 L 300,430 L 300,350",
    stroke: "#CBD5E1",
    strokeWidth: 16,
    type: "primary_road",
  },

  // Secondary Entrance Road (From Gate 2 to Hostel Ring)
  {
    d: "M 620,650 L 620,530 L 670,440 L 730,440",
    stroke: "#CBD5E1",
    strokeWidth: 14,
    type: "primary_road",
  },

  // Central Academic Cross-Avenue (East-West Boulevard)
  {
    d: "M 180,430 L 300,430 L 460,430 L 620,430 L 820,430",
    stroke: "#CBD5E1",
    strokeWidth: 14,
    type: "primary_road",
  },

  // North Academic Ring (Connecting AB-1, AB-3, AB-2, Hostels)
  {
    d: "M 300,350 L 380,350 L 460,320 L 460,250 L 550,280 L 550,350 L 700,350 L 790,350",
    stroke: "#E2E8F0",
    strokeWidth: 12,
    type: "secondary_road",
  },

  // West Sports & Gymnasium Access Boulevard
  {
    d: "M 180,430 L 180,320 L 180,220 L 250,220",
    stroke: "#E2E8F0",
    strokeWidth: 12,
    type: "secondary_road",
  },

  // East Hostel Inner Ring Road
  {
    d: "M 620,530 L 770,530 L 770,390 L 730,320 L 700,220",
    stroke: "#E2E8F0",
    strokeWidth: 12,
    type: "secondary_road",
  },

  // Pedestrian Walkways & Garden Paths
  {
    d: "M 380,380 L 420,450 L 490,460 L 550,360",
    stroke: "#E2E8F0",
    strokeWidth: 6,
    strokeDasharray: "4, 4",
    type: "pedestrian",
  },
  {
    d: "M 300,350 L 380,380 L 460,250",
    stroke: "#E2E8F0",
    strokeWidth: 6,
    strokeDasharray: "4, 4",
    type: "pedestrian",
  },
  {
    d: "M 490,460 L 650,520 L 670,440",
    stroke: "#E2E8F0",
    strokeWidth: 6,
    strokeDasharray: "4, 4",
    type: "pedestrian",
  },
  {
    d: "M 260,460 L 340,480 L 420,450",
    stroke: "#E2E8F0",
    strokeWidth: 6,
    strokeDasharray: "4, 4",
    type: "pedestrian",
  },
];

// Building footprint geometry with stylized academic architecture
export const CAMPUS_BUILDINGS: BuildingPolygon[] = [
  // 1. Academic Block 1 (AB-1)
  {
    id: "ab1",
    name: "Academic Block 1",
    category: "Academic",
    points: "330,340 430,340 430,420 330,420",
    fill: "#4338CA",
    stroke: "#312E81",
    labelPos: { x: 380, y: 380 },
    badgeText: "AB-1",
    isImportant: true,
  },
  // 2. Academic Block 2 (AB-2)
  {
    id: "ab2",
    name: "Academic Block 2",
    category: "Academic",
    points: "500,320 600,320 600,400 500,400",
    fill: "#4338CA",
    stroke: "#312E81",
    labelPos: { x: 550, y: 360 },
    badgeText: "AB-2",
    isImportant: true,
  },
  // 3. Academic Block 3 (AB-3) - Grand Mega Block
  {
    id: "ab3",
    name: "Academic Block 3 (Mega Complex)",
    category: "Academic",
    points: "390,210 530,210 530,290 390,290",
    fill: "#3730A3",
    stroke: "#1E1B4B",
    labelPos: { x: 460, y: 250 },
    badgeText: "AB-3",
    isImportant: true,
  },
  // 4. Central Library
  {
    id: "library",
    name: "Central Library",
    category: "Library",
    points: "260,310 340,310 340,390 260,390",
    fill: "#059669",
    stroke: "#065F46",
    labelPos: { x: 300, y: 350 },
    badgeText: "Library",
    isImportant: true,
  },
  // 5. Administrative Block
  {
    id: "admin",
    name: "Administrative Block",
    category: "Administration",
    points: "220,420 300,420 300,490 220,490",
    fill: "#D97706",
    stroke: "#92400E",
    labelPos: { x: 260, y: 455 },
    badgeText: "Admin",
  },
  // 6. Mahatma Gandhi Auditorium (MGA)
  {
    id: "mga",
    name: "Mahatma Gandhi Auditorium",
    category: "Auditorium",
    points: "310,460 380,460 395,510 295,510",
    fill: "#7C3AED",
    stroke: "#5B21B6",
    labelPos: { x: 345, y: 485 },
    badgeText: "MGA Auditorium",
  },
  // 7. North Square Food Court & Cafeteria
  {
    id: "northsquare",
    name: "North Square Food Court",
    category: "Dining",
    points: "460,430 530,430 530,490 460,490",
    fill: "#EA580C",
    stroke: "#9A3412",
    labelPos: { x: 495, y: 460 },
    badgeText: "North Square",
  },
  // 8. Gazebo Pavilion & Open Pods
  {
    id: "gazebo",
    name: "Gazebo Discussion Pods",
    category: "Dining",
    points: "405,435 435,435 445,465 415,475 395,455",
    fill: "#F97316",
    stroke: "#C2410C",
    labelPos: { x: 420, y: 455 },
    badgeText: "Gazebo",
  },
  // 9. Health Centre & Clinic
  {
    id: "health",
    name: "Health Centre (24/7 Clinic)",
    category: "Healthcare",
    points: "640,415 700,415 700,465 640,465",
    fill: "#DC2626",
    stroke: "#991B1B",
    labelPos: { x: 670, y: 440 },
    badgeText: "Health Centre",
  },
  // 10. V-Mart & Campus Store
  {
    id: "vmart",
    name: "V-Mart Supermarket",
    category: "Services",
    points: "620,495 680,495 680,545 620,545",
    fill: "#0284C7",
    stroke: "#075985",
    labelPos: { x: 650, y: 520 },
    badgeText: "V-Mart",
  },
  // 11. Indian Bank & ATMs
  {
    id: "bank",
    name: "Indian Bank & ATM",
    category: "Services",
    points: "200,500 260,500 260,540 200,540",
    fill: "#0284C7",
    stroke: "#075985",
    labelPos: { x: 230, y: 520 },
    badgeText: "Bank / ATM",
  },
  // 12. Men's Hostel Alpha Block
  {
    id: "alpha_hostel",
    name: "Alpha Block (Men's Hostel)",
    category: "Hostels",
    points: "690,290 770,290 770,350 690,350",
    fill: "#7E22CE",
    stroke: "#581C87",
    labelPos: { x: 730, y: 320 },
    badgeText: "Alpha Hostel",
  },
  // 13. Men's Hostel Beta Block
  {
    id: "beta_hostel",
    name: "Beta Block (Men's Hostel)",
    category: "Hostels",
    points: "750,360 830,360 830,420 750,420",
    fill: "#7E22CE",
    stroke: "#581C87",
    labelPos: { x: 790, y: 390 },
    badgeText: "Beta Hostel",
  },
  // 14. Delta Block (D1 & D2) Hostels
  {
    id: "delta_hostel",
    name: "Delta Block (D1 & D2)",
    category: "Hostels",
    points: "730,450 820,450 820,520 730,520",
    fill: "#6B21A8",
    stroke: "#3B0764",
    labelPos: { x: 775, y: 485 },
    badgeText: "Delta (D1/D2)",
  },
  // 15. Jasmine & Sarojini (Women's Hostels)
  {
    id: "jasmine_hostel",
    name: "Women's Hostels (Jasmine & Sarojini)",
    category: "Hostels",
    points: "660,190 740,190 740,255 660,255",
    fill: "#9333EA",
    stroke: "#6B21A8",
    labelPos: { x: 700, y: 220 },
    badgeText: "Women's Hostel",
  },
  // 16. University Guest House
  {
    id: "guesthouse",
    name: "University Guest House",
    category: "Services",
    points: "580,180 640,180 640,230 580,230",
    fill: "#0369A1",
    stroke: "#075985",
    labelPos: { x: 610, y: 205 },
    badgeText: "Guest House",
  },
  // 17. Indoor Sports Complex & Gymnasium
  {
    id: "indoor_sports",
    name: "Indoor Sports & Gym",
    category: "Sports",
    points: "140,295 220,295 220,350 140,350",
    fill: "#15803D",
    stroke: "#14532D",
    labelPos: { x: 180, y: 320 },
    badgeText: "Indoor Gym",
  },
  // 18. Olympic Swimming Pool
  {
    id: "swimming_pool",
    name: "Olympic Swimming Pool",
    category: "Sports",
    points: "110,250 170,250 170,290 110,290",
    fill: "#0284C7",
    stroke: "#0369A1",
    labelPos: { x: 140, y: 270 },
    badgeText: "Swimming Pool",
  },
  // 19. Basketball & Tennis Courts
  {
    id: "courts",
    name: "Basketball & Tennis Courts",
    category: "Sports",
    points: "200,240 260,240 260,285 200,285",
    fill: "#16A34A",
    stroke: "#15803D",
    labelPos: { x: 230, y: 260 },
    badgeText: "Courts",
  },
  // 20. Student Parking Area (West)
  {
    id: "parking_west",
    name: "Student Parking (West)",
    category: "Services",
    points: "200,560 260,560 260,600 200,600",
    fill: "#475569",
    stroke: "#334155",
    labelPos: { x: 230, y: 580 },
    badgeText: "Student Parking",
  },
  // 21. Main Gate (Gate 1) Gateway
  {
    id: "main_gate",
    name: "Main Entrance (Gate 1)",
    category: "Entrance",
    points: "270,615 330,615 330,640 270,640",
    fill: "#334155",
    stroke: "#0F172A",
    labelPos: { x: 300, y: 628 },
    badgeText: "Gate 1 (Main)",
  },
  // 22. Gate 2 (Service Entry)
  {
    id: "gate_2",
    name: "Gate 2 (Service Entry)",
    category: "Entrance",
    points: "590,615 650,615 650,640 590,640",
    fill: "#334155",
    stroke: "#0F172A",
    labelPos: { x: 620, y: 628 },
    badgeText: "Gate 2",
  },
];

// Outdoor Sports Stadium / Cricket Turf Oval (Dedicated render)
export const SPORTS_OVAL = {
  cx: 190,
  cy: 190,
  rx: 75,
  ry: 55,
  fill: "#22C55E",
  stroke: "#15803D",
  trackRx: 85,
  trackRy: 65,
};

// Campus Central Water Body / Lake buffer
export const CAMPUS_LAKE = {
  d: "M 480,120 Q 560,100 620,130 Q 670,160 630,175 Q 550,180 490,160 Z",
  fill: "#38BDF8",
  stroke: "#0284C7",
};

// Waypoint Route Graph for Accurate Turn-by-Turn Pathfinding
export const CAMPUS_WAYPOINTS: Record<string, Waypoint> = {
  w_gate1: { id: "w_gate1", x: 300, y: 628, label: "Main Entrance Gate 1", neighbors: ["w_busbay", "w_admin_entry", "w_parking_west"] },
  w_gate2: { id: "w_gate2", x: 620, y: 628, label: "Gate 2 Entrance", neighbors: ["w_busbay", "w_vmart_lane", "w_delta_lane"] },
  w_busbay: { id: "w_busbay", x: 380, y: 600, label: "Campus Bus Bay", neighbors: ["w_gate1", "w_gate2", "w_mga_cross"] },
  w_parking_west: { id: "w_parking_west", x: 230, y: 580, label: "West Parking Area", neighbors: ["w_gate1", "w_bank_entry"] },
  w_bank_entry: { id: "w_bank_entry", x: 230, y: 520, label: "Indian Bank & ATM", neighbors: ["w_parking_west", "w_admin_entry"] },
  w_admin_entry: { id: "w_admin_entry", x: 260, y: 460, label: "Admin Block Plaza", neighbors: ["w_gate1", "w_bank_entry", "w_mga_cross", "w_lib_south"] },
  w_mga_cross: { id: "w_mga_cross", x: 340, y: 480, label: "MG Auditorium Junction", neighbors: ["w_admin_entry", "w_busbay", "w_gazebo_lane", "w_lib_south"] },
  w_gazebo_lane: { id: "w_gazebo_lane", x: 420, y: 450, label: "Gazebo & Discussion Pods", neighbors: ["w_mga_cross", "w_ns_plaza", "w_ab1_south"] },
  w_ns_plaza: { id: "w_ns_plaza", x: 490, y: 460, label: "North Square Food Court", neighbors: ["w_gazebo_lane", "w_vmart_lane", "w_ab2_south", "w_ab1_south"] },
  w_vmart_lane: { id: "w_vmart_lane", x: 650, y: 520, label: "V-Mart Shopping Plaza", neighbors: ["w_ns_plaza", "w_gate2", "w_health_lane", "w_delta_lane"] },
  w_health_lane: { id: "w_health_lane", x: 670, y: 440, label: "Health Centre Junction", neighbors: ["w_vmart_lane", "w_ab2_south", "w_delta_lane", "w_alpha_lane"] },
  w_delta_lane: { id: "w_delta_lane", x: 775, y: 485, label: "Delta Block Hostels", neighbors: ["w_vmart_lane", "w_health_lane", "w_beta_lane", "w_gate2"] },
  w_beta_lane: { id: "w_beta_lane", x: 790, y: 390, label: "Beta Hostel Entry", neighbors: ["w_delta_lane", "w_alpha_lane"] },
  w_alpha_lane: { id: "w_alpha_lane", x: 730, y: 320, label: "Alpha Hostel Quad", neighbors: ["w_beta_lane", "w_health_lane", "w_jasmine_lane", "w_ab2_north"] },
  w_jasmine_lane: { id: "w_jasmine_lane", x: 700, y: 220, label: "Women's Hostels Gate", neighbors: ["w_alpha_lane", "w_guesthouse_lane"] },
  w_guesthouse_lane: { id: "w_guesthouse_lane", x: 610, y: 205, label: "University Guest House", neighbors: ["w_jasmine_lane", "w_ab3_east"] },
  w_lib_south: { id: "w_lib_south", x: 300, y: 350, label: "Central Library Entrance", neighbors: ["w_admin_entry", "w_mga_cross", "w_ab1_west", "w_sports_entry"] },
  w_ab1_west: { id: "w_ab1_west", x: 340, y: 380, label: "AB-1 West Portico", neighbors: ["w_lib_south", "w_ab1_south", "w_ab3_south"] },
  w_ab1_south: { id: "w_ab1_south", x: 380, y: 380, label: "AB-1 Main Entrance", neighbors: ["w_ab1_west", "w_gazebo_lane", "w_ns_plaza", "w_ab2_south"] },
  w_ab2_south: { id: "w_ab2_south", x: 550, y: 360, label: "AB-2 Main Entrance", neighbors: ["w_ab1_south", "w_ns_plaza", "w_health_lane", "w_ab2_north"] },
  w_ab2_north: { id: "w_ab2_north", x: 550, y: 280, label: "AB-2 North Portico", neighbors: ["w_ab2_south", "w_ab3_east", "w_alpha_lane"] },
  w_ab3_south: { id: "w_ab3_south", x: 460, y: 300, label: "AB-3 South Quadrangle", neighbors: ["w_ab1_west", "w_ab1_south", "w_ab3_main"] },
  w_ab3_main: { id: "w_ab3_main", x: 460, y: 250, label: "AB-3 Grand Portal", neighbors: ["w_ab3_south", "w_ab3_east"] },
  w_ab3_east: { id: "w_ab3_east", x: 530, y: 250, label: "AB-3 East Link", neighbors: ["w_ab3_main", "w_ab2_north", "w_guesthouse_lane"] },
  w_sports_entry: { id: "w_sports_entry", x: 230, y: 350, label: "Sports Complex Hub", neighbors: ["w_lib_south", "w_indoor_gym", "w_courts", "w_stadium"] },
  w_indoor_gym: { id: "w_indoor_gym", x: 180, y: 320, label: "Indoor Gymnasium & Arena", neighbors: ["w_sports_entry", "w_pool"] },
  w_pool: { id: "w_pool", x: 140, y: 270, label: "Olympic Swimming Pool", neighbors: ["w_indoor_gym", "w_stadium"] },
  w_courts: { id: "w_courts", x: 230, y: 260, label: "Basketball & Tennis Courts", neighbors: ["w_sports_entry", "w_stadium"] },
  w_stadium: { id: "w_stadium", x: 190, y: 220, label: "Outdoor Sports Stadium", neighbors: ["w_sports_entry", "w_indoor_gym", "w_pool", "w_courts"] },
};

// Location ID to Nearest Waypoint ID mapping
export const LOCATION_TO_WAYPOINT: Record<string, string> = {
  ab1: "w_ab1_south",
  ab2: "w_ab2_south",
  ab3: "w_ab3_main",
  library: "w_lib_south",
  admin: "w_admin_entry",
  mga: "w_mga_cross",
  health: "w_health_lane",
  vmart: "w_vmart_lane",
  bank: "w_bank_entry",
  northsquare: "w_ns_plaza",
  gazebo: "w_gazebo_lane",
  alpha_hostel: "w_alpha_lane",
  beta_hostel: "w_beta_lane",
  delta_hostel: "w_delta_lane",
  jasmine_hostel: "w_jasmine_lane",
  guesthouse: "w_guesthouse_lane",
  sports_ground: "w_stadium",
  indoor_sports: "w_indoor_gym",
  swimming_pool: "w_pool",
  courts: "w_courts",
  main_gate: "w_gate1",
  gate_2: "w_gate2",
  parking_west: "w_parking_west",
  bus_bay: "w_busbay",
};

/**
 * Dijkstra's shortest path algorithm over the campus waypoint graph
 */
export function findShortestPath(startLocationId: string, targetLocationId: string): {
  path: Array<{ x: number; y: number; label?: string }>;
  distanceMeters: number;
  walkingMinutes: number;
  steps: string[];
} {
  const startWaypointId = LOCATION_TO_WAYPOINT[startLocationId] || "w_gate1";
  const targetWaypointId = LOCATION_TO_WAYPOINT[targetLocationId] || "w_lib_south";

  if (startWaypointId === targetWaypointId) {
    const wp = CAMPUS_WAYPOINTS[startWaypointId];
    return {
      path: [{ x: wp.x, y: wp.y, label: wp.label }],
      distanceMeters: 0,
      walkingMinutes: 0,
      steps: ["You are already at your destination!"],
    };
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const id in CAMPUS_WAYPOINTS) {
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  }
  distances[startWaypointId] = 0;

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const id of unvisited) {
      if (distances[id] < minDistance) {
        minDistance = distances[id];
        currentId = id;
      }
    }

    if (!currentId || minDistance === Infinity) break;
    if (currentId === targetWaypointId) break;

    unvisited.delete(currentId);
    const currentWp = CAMPUS_WAYPOINTS[currentId];

    for (const neighborId of currentWp.neighbors) {
      if (!unvisited.has(neighborId)) continue;
      const neighborWp = CAMPUS_WAYPOINTS[neighborId];
      const dx = neighborWp.x - currentWp.x;
      const dy = neighborWp.y - currentWp.y;
      const stepDist = Math.sqrt(dx * dx + dy * dy);

      const alt = distances[currentId] + stepDist;
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
      }
    }
  }

  // Reconstruct path
  const pathWaypoints: string[] = [];
  let curr: string | null = targetWaypointId;
  while (curr) {
    pathWaypoints.unshift(curr);
    curr = previous[curr];
  }

  if (pathWaypoints[0] !== startWaypointId) {
    // Fallback direct
    const s = CAMPUS_WAYPOINTS[startWaypointId];
    const t = CAMPUS_WAYPOINTS[targetWaypointId];
    return {
      path: [{ x: s.x, y: s.y }, { x: t.x, y: t.y }],
      distanceMeters: 250,
      walkingMinutes: 3,
      steps: [`Walk from ${s.label || "Start"} directly towards ${t.label || "Destination"}.`],
    };
  }

  const pathPoints = pathWaypoints.map((id) => {
    const wp = CAMPUS_WAYPOINTS[id];
    return { x: wp.x, y: wp.y, label: wp.label };
  });

  // Calculate real metric distance (scaling factor: approx 1.25 meters per SVG unit)
  let totalSvgUnits = 0;
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const dx = pathPoints[i + 1].x - pathPoints[i].x;
    const dy = pathPoints[i + 1].y - pathPoints[i].y;
    totalSvgUnits += Math.sqrt(dx * dx + dy * dy);
  }

  const distanceMeters = Math.round(totalSvgUnits * 1.35);
  const walkingMinutes = Math.max(1, Math.round(distanceMeters / 75)); // standard 4.5 km/h walking pace ~ 75m/min

  // Generate turn-by-turn navigation steps
  const steps: string[] = [];
  steps.push(`Start from ${pathPoints[0].label || "your starting point"}.`);
  for (let i = 1; i < pathPoints.length - 1; i++) {
    steps.push(`Proceed along the walkway passing ${pathPoints[i].label}.`);
  }
  steps.push(`Arrive at ${pathPoints[pathPoints.length - 1].label}. Destination is in front of you.`);

  return {
    path: pathPoints,
    distanceMeters,
    walkingMinutes,
    steps,
  };
}
