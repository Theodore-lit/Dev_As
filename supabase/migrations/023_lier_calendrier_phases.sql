ALTER TABLE edition_calendrier
ADD COLUMN phase_id UUID REFERENCES phases(id) ON DELETE CASCADE;

CREATE INDEX idx_edition_calendrier_phase
  ON edition_calendrier(phase_id, ordre);

UPDATE edition_calendrier AS calendar
SET phase_id = phase.id
FROM phases AS phase
WHERE phase.edition_id = calendar.edition_id
  AND phase.ordre = CASE calendar.ordre
    WHEN 1 THEN 1
    WHEN 2 THEN 1
    WHEN 3 THEN 2
    WHEN 4 THEN 3
    WHEN 5 THEN 3
    WHEN 6 THEN 4
    WHEN 7 THEN 4
    WHEN 8 THEN 5
    WHEN 9 THEN 6
    WHEN 10 THEN 7
    WHEN 11 THEN 8
    WHEN 12 THEN 9
    WHEN 13 THEN 10
    WHEN 14 THEN 11
  END;
