export const SUPPORTED_APPS = ["google_drive", "slack", "notion"] as const;
export const SUPPORTED_EVENTS = {
  google_drive: ["new_file"],
  slack: ["send_message"],
  notion: ["create_page"],
} as const;
