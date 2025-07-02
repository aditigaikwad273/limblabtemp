json.role 'clinician'
json.(@clinician, :email, :first_name, :last_name, :title, :api_token)
json.twilio_token twilio_token(@clinician.email, @platform).to_jwt
json.(@clinician, :created_at, :updated_at)
