json.role 'client'
json.(@client, :email, :phone, :first_name, :last_name, :api_token)
json.twilio_token twilio_token(@client.email, @platform).to_jwt
json.(@client, :created_at, :updated_at)
