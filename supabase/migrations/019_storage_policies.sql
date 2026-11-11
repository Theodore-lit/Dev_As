-- Task 19: Storage buckets et politiques
-- Les buckets sont créés via Supabase dashboard ou CLI, pas SQL
-- Cette migration documente la configuration

-- Configuration en JSON pour Supabase Storage:
/*
{
  "buckets": [
    {
      "name": "candidatures-photos",
      "public": false,
      "avif_auto_conversion": false,
      "file_size_limit": 307200,
      "allowed_mime_types": ["image/webp", "image/jpeg", "image/png"]
    },
    {
      "name": "participants-photos",
      "public": true,
      "avif_auto_conversion": false,
      "file_size_limit": 307200,
      "allowed_mime_types": ["image/webp", "image/jpeg", "image/png"]
    },
    {
      "name": "actualites-images",
      "public": true,
      "avif_auto_conversion": false,
      "file_size_limit": 307200,
      "allowed_mime_types": ["image/webp", "image/jpeg", "image/png"]
    }
  ],
  "policies": [
    {
      "bucket": "candidatures-photos",
      "definition": {
        "role": "authenticated",
        "operation": "SELECT",
        "condition": "a_permission('candidatures')"
      }
    }
  ]
}
*/

-- Les politiques de storage doivent être configurées via Supabase dashboard
