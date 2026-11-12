CREATE VIEW v_compteurs_candidatures_publics AS
SELECT
  edition_id,
  COUNT(*)::INTEGER AS total
FROM candidatures
GROUP BY edition_id;

GRANT SELECT ON TABLE v_compteurs_candidatures_publics TO anon, authenticated;
