json.(@relationship, :id, :client_id)
json.(@relationship.client, :first_name, :last_name, :email, :phone)
json.(@relationship, :primary, :notes)
