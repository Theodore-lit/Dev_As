-- Task 9: Fonctions helpers

CREATE FUNCTION est_admin() RETURNS BOOLEAN AS $$
  SELECT role = 'admin' OR role = 'super_admin'
  FROM profils
  WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE FUNCTION est_super_admin() RETURNS BOOLEAN AS $$
  SELECT role = 'super_admin'
  FROM profils
  WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE FUNCTION a_permission(permission_nom TEXT) RETURNS BOOLEAN AS $$
  SELECT permission_nom = ANY(permissions)
  FROM profils
  WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;
