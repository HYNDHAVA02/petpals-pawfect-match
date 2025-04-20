
-- Enable real-time updates for matches table
ALTER TABLE matches REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
