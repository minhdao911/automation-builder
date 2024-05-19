import Category from "@/components/icons/category";
import Workflows from "@/components/icons/workflows";
// import Home from "@/components/icons/home";
// import Settings from "@/components/icons/settings";

export const integrations = [
  "gmail",
  "google-drive",
  "google-calendar",
  "slack",
  "notion",
  "discord",
];

export const menuOptions = [
  { name: "Workflows", Component: Workflows, href: "/workflows" },
  { name: "Connections", Component: Category, href: "/connections" },
  // { name: "Settings", Component: Settings, href: "/settings" },
];
