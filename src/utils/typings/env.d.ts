declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      TICKET_CATEGORY_ID: string;
      LOGS_CHANNEL_ID: string;
      USER_IDS_TO_NOT_APPLY_FILTER: string;
      WELCOME_ROLE_ID: string;
      TICKET_TOOL_BOT_ID: string;
    }
  }
}

// // If this file has no import/export statements (i.e. is a script)
// // convert it into a module by adding an empty export statement.
export {};
