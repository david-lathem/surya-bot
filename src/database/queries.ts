import {
  channelIdQuery,
  StickyMessage,
  TicketTracker,
} from "../utils/typings/types.js";
import db from "./index.js";

// [STICKY MESSAGE]
export const upsertStickyMessage = db.prepare<StickyMessage>(`
  INSERT INTO sticky_messages (channelId, content)
  VALUES (@channelId, @content)
  ON CONFLICT(channelId) DO UPDATE SET
    content = excluded.content
`);

export const deleteStickyMessage = db.prepare<channelIdQuery>(`
  DELETE FROM sticky_messages WHERE channelId = @channelId
`);

export const getStickyMessage = db.prepare<channelIdQuery, StickyMessage>(`
  SELECT * FROM sticky_messages WHERE channelId = @channelId
`);

// [Ticket Tracker]

export const creatTicketTracker = db.prepare<channelIdQuery>(`
  INSERT INTO ticket_tracker (channelId)
  VALUES (@channelId)
`);

export const updateTicketTrackerUser = db.prepare<TicketTracker>(`
  UPDATE ticket_tracker SET userId = @userId WHERE channelId = @channelId
`);

export const getTicketTrackerByChannel = db.prepare<
  channelIdQuery,
  TicketTracker
>(`
  SELECT * FROM ticket_tracker WHERE channelId = @channelId
`);

export const deleteTicketTrackerByChannel = db.prepare<channelIdQuery>(`
  DELETE FROM ticket_tracker WHERE channelId = @channelId
`);
