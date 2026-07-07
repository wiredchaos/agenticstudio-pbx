import http from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.PORT || process.env.AGENTICSTUDIO_BACKEND_PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const DISTRICT_ID = "entertainment-district";

const ecosystemRepos = [
  {
    id: "hermes-city",
    name: "HERMES-CITY",
    role: "City runtime and district shell for Agentropolis surfaces.",
    url: "https://github.com/wiredchaos/HERMES-CITY",
    lane: "runtime"
  },
  {
    id: "agentropolis-agent-mcp",
    name: "AGENTROPOLIS-AGENT-MCP",
    role: "MCP bridge layer for tools, agents, and backend integrations.",
    url: "https://github.com/wiredchaos/AGENTROPOLIS-AGENT-MCP",
    lane: "agent-tools"
  },
  {
    id: "agentropolis-creator",
    name: "AGENTROPOLIS-CREATOR",
    role: "Creator workflow layer for media, studio assets, prompts, and publishing flows.",
    url: "https://github.com/wiredchaos/AGENTROPOLIS-CREATOR",
    lane: "creator-ops"
  },
  {
    id: "agenticstudio-pbx",
    name: "agenticstudio-pbx",
    role: "Entertainment District application backend and studio production surface.",
    url: "https://github.com/wiredchaos/agenticstudio-pbx",
    lane: "application"
  }
];

const district = {
  id: DISTRICT_ID,
  name: "Entertainment District",
  codename: "ENTERTAINMENT_DISTRICT",
  status: "online",
  layerRole: "district/application bridge",
  domain: "Media, studios, shows, creator workflows, narrative assets, and distribution ops.",
  function:
    "Turns Agentic Studio into a production backend for Agentropolis entertainment properties while staying connected to the city runtime, MCP tool layer, and creator stack.",
  upstream: ["hermes-city", "agentropolis-agent-mcp", "agentropolis-creator"],
  applications: ["agenticstudio-pbx"],
  doctrine: [
    "Entertainment is a district, not a random content folder.",
    "Studios own shows, shows generate assets, assets move through distribution.",
    "Backend first: every public surface should have a registry, health check, and routing contract."
  ]
};

const services = [
  {
    id: "studio-registry",
    name: "Studio Registry",
    status: "ready",
    description: "Tracks studios, brands, channels, shows, and public studio surfaces."
  },
  {
    id: "creator-pipeline",
    name: "Creator Pipeline",
    status: "ready",
    description: "Connects prompts, scripts, media assets, publishing tasks, and creator workflows."
  },
  {
    id: "district-bridge",
    name: "District Bridge",
    status: "ready",
    description: "Exposes canonical Entertainment District metadata to frontend and external agents."
  },
  {
    id: "mcp-handoff",
    name: "MCP Handoff",
    status: "planned",
    description: "Reserved bridge for AGENTROPOLIS-AGENT-MCP tool calls and agent task dispatch."
  }
];

function json(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function notFound(res, pathname) {
  json(res, 404, {
    ok: false,
    error: "not_found",
    message: `No Agentic Studio backend route exists for ${pathname}`,
    availableRoutes: [
      "/api/health",
      "/api/district",
      "/api/district/services",
      "/api/ecosystem/repos"
    ]
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization"
    });
    res.end();
    return;
  }

  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "method_not_allowed", method: req.method });
    return;
  }

  if (url.pathname === "/" || url.pathname === "/api/health") {
    json(res, 200, {
      ok: true,
      service: "agenticstudio-backend",
      district: DISTRICT_ID,
      status: "online",
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (url.pathname === "/api/district") {
    json(res, 200, { ok: true, district });
    return;
  }

  if (url.pathname === "/api/district/services") {
    json(res, 200, { ok: true, districtId: DISTRICT_ID, services });
    return;
  }

  if (url.pathname === "/api/ecosystem/repos") {
    json(res, 200, { ok: true, repos: ecosystemRepos });
    return;
  }

  notFound(res, url.pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`Agentic Studio backend online at http://localhost:${PORT}`);
  console.log(`District bridge: http://localhost:${PORT}/api/district`);
});
