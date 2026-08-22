import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Navigation,
  Compass,
  MapPin,
  ExternalLink,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock,
  Phone,
  Info,
  Route,
  ArrowRightLeft,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Library,
  HeartPulse,
  Utensils,
  Home,
  Trophy,
  ShoppingBag,
  GraduationCap,
  Award,
} from "lucide-react";
import {
  CAMPUS_LOCATIONS,
  QUICK_DESTINATIONS,
  LOCATION_CATEGORIES,
  CampusLocation,
} from "../../data/campusLocations";
import {
  CAMPUS_ROADS,
  CAMPUS_BUILDINGS,
  SPORTS_OVAL,
  CAMPUS_LAKE,
  findShortestPath,
} from "../../data/campusMapData";

interface CampusMapProps {
  initialLocationId?: string | null;
  onNavigateToTutor?: () => void;
}

export default function CampusMap({ initialLocationId, onNavigateToTutor }: CampusMapProps) {
  // Map Viewport / Pan & Zoom State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Selection & Search State
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(initialLocationId || "ab1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);

  // Directions & Routing State
  const [isRoutingMode, setIsRoutingMode] = useState<boolean>(false);
  const [routeStartId, setRouteStartId] = useState<string>("main_gate");
  const [routeTargetId, setRouteTargetId] = useState<string>("library");

  // Geolocation State
  const [userLocationState, setUserLocationState] = useState<{
    active: boolean;
    loading: boolean;
    coords?: { x: number; y: number };
    message?: string;
  }>({ active: false, loading: false });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Synchronize initial location from props
  useEffect(() => {
    if (initialLocationId) {
      setSelectedLocationId(initialLocationId);
      centerOnLocation(initialLocationId);
    }
  }, [initialLocationId]);

  // Selected Location Object
  const selectedLocation = useMemo(() => {
    return CAMPUS_LOCATIONS.find((loc) => loc.id === selectedLocationId) || null;
  }, [selectedLocationId]);

  // Search Results Filtering
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return CAMPUS_LOCATIONS.filter((loc) => {
      const matchName = loc.name.toLowerCase().includes(query);
      const matchShort = loc.shortName.toLowerCase().includes(query);
      const matchCategory = loc.category.toLowerCase().includes(query);
      const matchKeywords = loc.keywords.some((k) => k.toLowerCase().includes(query));
      const matchAliases = loc.aliases.some((a) => a.toLowerCase().includes(query));
      return matchName || matchShort || matchCategory || matchKeywords || matchAliases;
    }).slice(0, 6);
  }, [searchQuery]);

  // Visible Buildings by Category Filter
  const visibleBuildingIds = useMemo(() => {
    if (activeCategory === "All") return null;
    return new Set(
      CAMPUS_LOCATIONS.filter((l) => l.category === activeCategory).map((l) => l.id)
    );
  }, [activeCategory]);

  // Calculated Active Route
  const activeRoute = useMemo(() => {
    if (!isRoutingMode || !routeStartId || !routeTargetId) return null;
    return findShortestPath(routeStartId, routeTargetId);
  }, [isRoutingMode, routeStartId, routeTargetId]);

  // Map Controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const centerOnLocation = (locId: string) => {
    const loc = CAMPUS_LOCATIONS.find((l) => l.id === locId);
    if (!loc) return;
    // Map viewBox center is 500, 350
    const targetX = (500 - loc.position.x) * 0.7;
    const targetY = (350 - loc.position.y) * 0.7;
    setPan({ x: targetX, y: targetY });
    setZoom(1.3);
  };

  // Mouse Drag Handlers for Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.75), 2.5));
  };

  // Geolocation Trigger
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setUserLocationState({ active: true, loading: true });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // VIT Chennai GPS: 12.8406° N, 80.1534° E
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const isNearCampus =
          Math.abs(lat - 12.8406) < 0.05 && Math.abs(lng - 80.1534) < 0.05;

        setUserLocationState({
          active: true,
          loading: false,
          coords: isNearCampus
            ? { x: 300, y: 628 } // Approximate Main Gate
            : { x: 300, y: 628 },
          message: isNearCampus
            ? "Positioned near VIT Chennai Main Gate."
            : "Viewing VIT Chennai Campus (Vandalur-Kelambakkam Rd).",
        });
      },
      (error) => {
        setUserLocationState({
          active: false,
          loading: false,
          message: "Location permission denied. Showing default campus map view.",
        });
      }
    );
  };

  // Start Navigation to selected location
  const handleStartNavigationTo = (targetId: string) => {
    setIsRoutingMode(true);
    setRouteTargetId(targetId);
    if (routeStartId === targetId) {
      setRouteStartId("main_gate");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP HEADER & OFFICIAL WAYFINDER BAR                         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <Compass size={12} className="animate-spin-slow" />
              VIT Chennai Campus Wayfinding
            </span>
            <span className="text-xs text-muted-foreground">Vandalur - Kelambakkam Road, Chennai</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <span>VIT Chennai Campus Navigator</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Interactive 2D spatial layout with turn-by-turn directions, floor directories, and 3D WayFinder integration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Geolocation Button */}
          <button
            onClick={handleRequestLocation}
            disabled={userLocationState.loading}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              userLocationState.active
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-secondary hover:bg-secondary/80 border-border text-foreground"
            }`}
            title="Use My Location"
          >
            <Navigation size={13} className={userLocationState.loading ? "animate-spin" : ""} />
            <span>{userLocationState.loading ? "Locating..." : "Use My Location"}</span>
          </button>

          {/* Toggle Directions Mode */}
          <button
            onClick={() => setIsRoutingMode((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isRoutingMode
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary hover:bg-secondary/80 border border-border text-foreground"
            }`}
          >
            <Route size={14} />
            <span>{isRoutingMode ? "Exit Directions" : "Get Directions"}</span>
          </button>

          {/* Official 3D WayFinder External Trigger */}
          <a
            href="http://chennaiwayfinder.vit.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all hover:opacity-95 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
          >
            <Sparkles size={13} />
            <span>Open Official 3D WayFinder</span>
            <ExternalLink size={12} className="opacity-80" />
          </a>
        </div>
      </div>

      {/* Geolocation Notice Banner (if active) */}
      {userLocationState.message && (
        <div className="bg-primary/5 border border-primary/20 text-foreground text-xs px-4 py-2 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
            <span>{userLocationState.message}</span>
          </div>
          <button
            onClick={() => setUserLocationState({ active: false, loading: false })}
            className="text-muted-foreground hover:text-foreground text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. SEARCH, CATEGORIES & QUICK DESTINATIONS                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Prominent Search Bar */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search campus buildings (e.g. AB-1, Library, Health Centre, Hostels, V-Mart)..."
              className="w-full text-xs bg-secondary border border-border rounded-xl pl-10 pr-9 py-2.5 outline-none transition-all placeholder:text-muted-foreground focus:border-primary text-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            )}

            {/* Instant Search Autocomplete Dropdown */}
            {isSearchFocused && filteredSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-border">
                {filteredSearchResults.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocationId(loc.id);
                      centerOnLocation(loc.id);
                      setIsSearchFocused(false);
                      setSearchQuery("");
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-secondary flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: loc.color }}
                      >
                        {loc.shortName.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{loc.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-sm">
                          {loc.category} • {loc.zone}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded bg-primary/10">
                      View on Map →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scroll py-1">
            {LOCATION_CATEGORIES.slice(0, 7).map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Access Destination Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scroll pb-1">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 flex-shrink-0">
            <Sparkles size={12} className="text-primary" />
            Quick Access:
          </span>
          {QUICK_DESTINATIONS.map((dest) => {
            const isSelected = selectedLocationId === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => {
                  setSelectedLocationId(dest.id);
                  centerOnLocation(dest.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary/15 text-primary border border-primary/30 font-bold"
                    : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                }`}
              >
                <span>{dest.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. MAIN INTERACTIVE MAP CANVAS & SIDE PANELS                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[580px]">
        {/* Left / Center Map Canvas (8 Columns) */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl relative overflow-hidden flex flex-col shadow-xs">
          {/* Map Floating HUD Controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-card/90 backdrop-blur-md border border-border p-1.5 rounded-xl shadow-md">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleResetView}
              className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Compass Rose Indicator (Top-Left) */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-xl shadow-xs text-xs font-bold text-foreground">
            <Compass size={16} className="text-primary" />
            <span className="tracking-wider text-[11px] font-mono">NORTH ↑</span>
            <span className="text-[10px] text-muted-foreground">| VIT Chennai</span>
          </div>

          {/* Route Info Badge on Map (when active) */}
          {activeRoute && (
            <div className="absolute bottom-3 left-3 z-10 bg-card/95 backdrop-blur-md border border-primary/30 p-3 rounded-xl shadow-lg max-w-sm">
              <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                <Route size={14} />
                <span>Active Walking Route</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-foreground">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Distance</span>
                  <span>{activeRoute.distanceMeters} meters</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Est. Time</span>
                  <span>~{activeRoute.walkingMinutes} min walk</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive SVG Canvas */}
          <div
            className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden bg-[#0F172A]/5 dark:bg-[#090D16]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 1000 700"
              className="w-full h-full object-contain transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              <defs>
                {/* Lawn Grass Pattern */}
                <pattern id="campusGrass" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#10B981" fillOpacity="0.04" />
                  <circle cx="10" cy="10" r="1" fill="#10B981" fillOpacity="0.12" />
                </pattern>

                {/* Building Shadow Filter */}
                <filter id="buildingShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.25" />
                </filter>

                {/* Glowing Active Route Line */}
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
              </defs>

              {/* Campus Base Terrain & Boundaries */}
              <rect x="20" y="30" width="960" height="640" rx="24" fill="url(#campusGrass)" stroke="#334155" strokeWidth="2" strokeDasharray="8, 6" />

              {/* Campus Lake / Waterbody Buffer */}
              <path d={CAMPUS_LAKE.d} fill={CAMPUS_LAKE.fill} fillOpacity="0.35" stroke={CAMPUS_LAKE.stroke} strokeWidth="2" />
              <text x="560" y="145" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                Campus Lake & Rainwater Retention
              </text>

              {/* Sports Athletic Oval (Cricket & 400m Track) */}
              <ellipse
                cx={SPORTS_OVAL.cx}
                cy={SPORTS_OVAL.cy}
                rx={SPORTS_OVAL.trackRx}
                ry={SPORTS_OVAL.trackRy}
                fill="#F87171"
                fillOpacity="0.18"
                stroke="#DC2626"
                strokeWidth="2"
                strokeDasharray="4, 4"
              />
              <ellipse
                cx={SPORTS_OVAL.cx}
                cy={SPORTS_OVAL.cy}
                rx={SPORTS_OVAL.rx}
                ry={SPORTS_OVAL.ry}
                fill={SPORTS_OVAL.fill}
                fillOpacity="0.3"
                stroke={SPORTS_OVAL.stroke}
                strokeWidth="2"
              />
              <text x={SPORTS_OVAL.cx} y={SPORTS_OVAL.cy + 4} textAnchor="middle" fill="#15803D" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                Main Sports Oval & 400m Track
              </text>

              {/* Campus Road Network */}
              {CAMPUS_ROADS.map((road, idx) => (
                <g key={idx}>
                  <path
                    d={road.d}
                    fill="none"
                    stroke={road.stroke}
                    strokeWidth={road.strokeWidth}
                    strokeDasharray={road.strokeDasharray || "none"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {road.label && (
                    <text
                      x="500"
                      y="668"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      letterSpacing="2"
                    >
                      {road.label}
                    </text>
                  )}
                </g>
              ))}

              {/* Dynamic Turn-by-Turn Route Rendering (when active) */}
              {activeRoute && activeRoute.path.length > 1 && (
                <g className="route-layer">
                  {/* Glowing wide underlay */}
                  <path
                    d={activeRoute.path.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`, "")}
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="10"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Animated dashed path line */}
                  <path
                    d={activeRoute.path.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`, "")}
                    fill="none"
                    stroke="url(#routeGlow)"
                    strokeWidth="4"
                    strokeDasharray="8, 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                  />
                  {/* Waypoint nodes along the path */}
                  {activeRoute.path.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={idx === 0 || idx === activeRoute.path.length - 1 ? 6 : 3.5}
                      fill={idx === 0 ? "#10B981" : idx === activeRoute.path.length - 1 ? "#EF4444" : "#4F46E5"}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  ))}
                </g>
              )}

              {/* Building Footprints */}
              {CAMPUS_BUILDINGS.map((bldg) => {
                const isSelected = selectedLocationId === bldg.id;
                const isHovered = hoveredBuildingId === bldg.id;
                const isFiltered = visibleBuildingIds && !visibleBuildingIds.has(bldg.id);

                return (
                  <g
                    key={bldg.id}
                    className="cursor-pointer transition-opacity duration-200"
                    opacity={isFiltered ? 0.25 : 1}
                    onClick={() => setSelectedLocationId(bldg.id)}
                    onMouseEnter={() => setHoveredBuildingId(bldg.id)}
                    onMouseLeave={() => setHoveredBuildingId(null)}
                  >
                    {/* Building Polygon Geometry */}
                    <polygon
                      points={bldg.points}
                      fill={isSelected ? "#4F46E5" : isHovered ? "#6366F1" : bldg.fill}
                      stroke={isSelected ? "#FFFFFF" : bldg.stroke}
                      strokeWidth={isSelected ? 3.5 : 1.5}
                      filter="url(#buildingShadow)"
                    />

                    {/* Selected Pulsing Halo */}
                    {isSelected && (
                      <polygon
                        points={bldg.points}
                        fill="none"
                        stroke="#818CF8"
                        strokeWidth="8"
                        strokeOpacity="0.5"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Building Label Badge */}
                    <rect
                      x={bldg.labelPos.x - 38}
                      y={bldg.labelPos.y - 10}
                      width="76"
                      height="20"
                      rx="6"
                      fill={isSelected ? "#1E1B4B" : "#0F172A"}
                      fillOpacity="0.85"
                      stroke={isSelected ? "#818CF8" : "#334155"}
                      strokeWidth="1"
                    />
                    <text
                      x={bldg.labelPos.x}
                      y={bldg.labelPos.y + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {bldg.badgeText}
                    </text>
                  </g>
                );
              })}

              {/* Location Pin Markers */}
              {CAMPUS_LOCATIONS.map((loc) => {
                const isSelected = selectedLocationId === loc.id;
                const isFiltered = visibleBuildingIds && !visibleBuildingIds.has(loc.id);

                return (
                  <g
                    key={loc.id}
                    transform={`translate(${loc.position.x}, ${loc.position.y})`}
                    opacity={isFiltered ? 0.2 : 1}
                    className="cursor-pointer"
                    onClick={() => setSelectedLocationId(loc.id)}
                  >
                    {isSelected && (
                      <circle cx="0" cy="0" r="14" fill={loc.color} fillOpacity="0.3" className="animate-ping" />
                    )}
                    <circle cx="0" cy="0" r="5" fill={loc.color} stroke="#FFFFFF" strokeWidth="2" />
                  </g>
                );
              })}

              {/* User GPS Radar Dot (if active) */}
              {userLocationState.active && userLocationState.coords && (
                <g transform={`translate(${userLocationState.coords.x}, ${userLocationState.coords.y})`}>
                  <circle cx="0" cy="0" r="18" fill="#3B82F6" fillOpacity="0.3" className="animate-ping" />
                  <circle cx="0" cy="0" r="7" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2.5" />
                  <rect x="-40" y="-24" width="80" height="16" rx="4" fill="#1E3A8A" fillOpacity="0.9" />
                  <text x="0" y="-13" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                    You Are Here
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Information & Routing Control Panel (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* ─── DIRECTIONS PANEL (When active) ─── */}
          {isRoutingMode ? (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Route size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground">Turn-by-Turn Route</h3>
                    <p className="text-[11px] text-muted-foreground">Optimal campus pedestrian path</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRoutingMode(false)}
                  className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* From / To Selectors */}
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground block">From (Starting Point)</label>
                  <select
                    value={routeStartId}
                    onChange={(e) => setRouteStartId(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center -my-1">
                  <button
                    onClick={() => {
                      const temp = routeStartId;
                      setRouteStartId(routeTargetId);
                      setRouteTargetId(temp);
                    }}
                    className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors cursor-pointer shadow-xs"
                    title="Swap Route"
                  >
                    <ArrowRightLeft size={12} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground block">To (Destination)</label>
                  <select
                    value={routeTargetId}
                    onChange={(e) => setRouteTargetId(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Route Summary */}
              {activeRoute && (
                <div className="bg-secondary/60 border border-border rounded-xl p-3.5 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center border-b border-border/60 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">Walking Distance</span>
                      <span className="text-sm font-black text-foreground">{activeRoute.distanceMeters} m</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">Estimated Time</span>
                      <span className="text-sm font-black text-primary">~{activeRoute.walkingMinutes} min</span>
                    </div>
                  </div>

                  {/* Step-by-Step Directions */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-foreground block">Walking Steps:</span>
                    <ol className="space-y-1.5 text-xs text-muted-foreground">
                      {activeRoute.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* ─── LOCATION DETAILS CARD ─── */}
          {selectedLocation ? (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded text-white"
                        style={{ background: selectedLocation.color }}
                      >
                        {selectedLocation.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">{selectedLocation.shortName}</span>
                    </div>
                    <h2 className="text-lg font-black text-foreground tracking-tight">{selectedLocation.name}</h2>
                    <p className="text-xs text-muted-foreground font-medium">{selectedLocation.zone} • VIT Chennai</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-foreground/80 leading-relaxed bg-secondary/40 p-3 rounded-xl border border-border">
                  {selectedLocation.description}
                </p>

                {/* Timings & Contact */}
                <div className="space-y-2 text-xs">
                  {selectedLocation.timings && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={14} className="text-primary flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">Timings:</strong> {selectedLocation.timings}
                      </span>
                    </div>
                  )}
                  {selectedLocation.contact && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={14} className="text-emerald-500 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">Contact:</strong> {selectedLocation.contact}
                      </span>
                    </div>
                  )}
                </div>

                {/* Floor Directory (if available) */}
                {selectedLocation.floors && selectedLocation.floors.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-foreground block">Floor Directory</span>
                    <div className="space-y-1 max-h-36 overflow-y-auto no-scroll pr-1">
                      {selectedLocation.floors.map((floor, idx) => (
                        <div key={idx} className="text-[11px] text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-lg border border-border/50">
                          {floor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facilities Badges */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-foreground block">Key Amenities & Facilities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLocation.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded-md border border-border text-foreground"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleStartNavigationTo(selectedLocation.id)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center justify-center gap-2 transition-all hover:opacity-95 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                >
                  <Route size={14} />
                  <span>Get Directions Here</span>
                </button>

                <a
                  href={`http://chennaiwayfinder.vit.ac.in/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 border border-border text-foreground flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>3D View</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                <MapPin size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Select a Building</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Click any marker or building on the map to view floor directories, facilities, and walking routes.
                </p>
              </div>
            </div>
          )}

          {/* AI Mentor Assistant Prompt Banner */}
          {onNavigateToTutor && (
            <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Sparkles size={11} />
                  AI Campus Guide
                </span>
                <p className="text-xs font-medium text-foreground">Have questions about lab timings or department locations?</p>
              </div>
              <button
                onClick={onNavigateToTutor}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <span>Ask AI Tutor</span>
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
