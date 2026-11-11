-- Task 7: Table journal_activite

CREATE TABLE journal_activite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profil_id UUID REFERENCES profils(id),
  action VARCHAR NOT NULL,
  table_cible VARCHAR NOT NULL,
  enregistrement_id UUID,
  motif TEXT,
  anciennes_valeurs JSONB,
  nouvelles_valeurs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_journal_activite_profil_created ON journal_activite(profil_id, created_at);
CREATE INDEX idx_journal_activite_table_created ON journal_activite(table_cible, created_at);
CREATE INDEX idx_journal_activite_enregistrement ON journal_activite(enregistrement_id);
