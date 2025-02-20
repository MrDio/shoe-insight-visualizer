
import { ApplicationData } from '@/types/data';

export const createCurrentDistributionData = (dypApps: number, nonDypApps: number) => ({
  nodes: [
    { id: "Applications" },
    { id: "DyP" },
    { id: "Non-DyP" },
    { id: "PaaS" },
    { id: "CaaS" },
    { id: "IT Services" },
    { id: "IT Operations" },
    { id: "IT Technology" },
    { id: "IT Communication" },
    { id: "IT Governance" }
  ],
  links: [
    // Level 1 to 2: Applications to DyP/Non-DyP
    {
      source: "Applications",
      target: "DyP",
      value: dypApps
    },
    {
      source: "Applications",
      target: "Non-DyP",
      value: nonDypApps
    },
    // Level 2 to 3: DyP/Non-DyP to PaaS/CaaS
    {
      source: "DyP",
      target: "PaaS",
      value: Math.round(dypApps * 0.6)
    },
    {
      source: "DyP",
      target: "CaaS",
      value: Math.round(dypApps * 0.4)
    },
    {
      source: "Non-DyP",
      target: "PaaS",
      value: Math.round(nonDypApps * 0.3)
    },
    {
      source: "Non-DyP",
      target: "CaaS",
      value: Math.round(nonDypApps * 0.7)
    },
    // Level 3 to 4: PaaS/CaaS to IT Departments
    {
      source: "PaaS",
      target: "IT Services",
      value: Math.round((dypApps * 0.6 + nonDypApps * 0.3) * 0.2)
    },
    {
      source: "PaaS",
      target: "IT Operations",
      value: Math.round((dypApps * 0.6 + nonDypApps * 0.3) * 0.2)
    },
    {
      source: "PaaS",
      target: "IT Technology",
      value: Math.round((dypApps * 0.6 + nonDypApps * 0.3) * 0.2)
    },
    {
      source: "PaaS",
      target: "IT Communication",
      value: Math.round((dypApps * 0.6 + nonDypApps * 0.3) * 0.2)
    },
    {
      source: "PaaS",
      target: "IT Governance",
      value: Math.round((dypApps * 0.6 + nonDypApps * 0.3) * 0.2)
    },
    {
      source: "CaaS",
      target: "IT Services",
      value: Math.round((dypApps * 0.4 + nonDypApps * 0.7) * 0.2)
    },
    {
      source: "CaaS",
      target: "IT Operations",
      value: Math.round((dypApps * 0.4 + nonDypApps * 0.7) * 0.2)
    },
    {
      source: "CaaS",
      target: "IT Technology",
      value: Math.round((dypApps * 0.4 + nonDypApps * 0.7) * 0.2)
    },
    {
      source: "CaaS",
      target: "IT Communication",
      value: Math.round((dypApps * 0.4 + nonDypApps * 0.7) * 0.2)
    },
    {
      source: "CaaS",
      target: "IT Governance",
      value: Math.round((dypApps * 0.4 + nonDypApps * 0.7) * 0.2)
    }
  ]
});

export const createYearlyTrendData = (dypApps: number, nonDypApps: number) => ({
  nodes: [
    { id: "2025" },
    { id: "2026" },
    { id: "2027" },
    { id: "2028" },
    { id: "2029" },
    { id: "DyP 2025" },
    { id: "Non-DyP 2025" },
    { id: "DyP 2026" },
    { id: "Non-DyP 2026" },
    { id: "DyP 2027" },
    { id: "Non-DyP 2027" },
    { id: "DyP 2028" },
    { id: "Non-DyP 2028" },
    { id: "DyP 2029" },
    { id: "Non-DyP 2029" }
  ],
  links: [
    // 2025 (current)
    {
      source: "2025",
      target: "DyP 2025",
      value: dypApps
    },
    {
      source: "2025",
      target: "Non-DyP 2025",
      value: nonDypApps
    },
    // 2025 to 2026
    {
      source: "DyP 2025",
      target: "DyP 2026",
      value: Math.round(dypApps * 1.2)
    },
    {
      source: "Non-DyP 2025",
      target: "DyP 2026",
      value: Math.round(nonDypApps * 0.2)
    },
    {
      source: "Non-DyP 2025",
      target: "Non-DyP 2026",
      value: Math.round(nonDypApps * 0.8)
    },
    // 2026 to 2027
    {
      source: "DyP 2026",
      target: "DyP 2027",
      value: Math.round(dypApps * 1.4)
    },
    {
      source: "Non-DyP 2026",
      target: "DyP 2027",
      value: Math.round(nonDypApps * 0.3)
    },
    {
      source: "Non-DyP 2026",
      target: "Non-DyP 2027",
      value: Math.round(nonDypApps * 0.7)
    },
    // 2027 to 2028
    {
      source: "DyP 2027",
      target: "DyP 2028",
      value: Math.round(dypApps * 1.6)
    },
    {
      source: "Non-DyP 2027",
      target: "DyP 2028",
      value: Math.round(nonDypApps * 0.4)
    },
    {
      source: "Non-DyP 2027",
      target: "Non-DyP 2028",
      value: Math.round(nonDypApps * 0.6)
    },
    // 2028 to 2029
    {
      source: "DyP 2028",
      target: "DyP 2029",
      value: Math.round(dypApps * 1.8)
    },
    {
      source: "Non-DyP 2028",
      target: "DyP 2029",
      value: Math.round(nonDypApps * 0.5)
    },
    {
      source: "Non-DyP 2028",
      target: "Non-DyP 2029",
      value: Math.round(nonDypApps * 0.5)
    }
  ]
});
