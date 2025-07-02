json.role @sessionable.model_name.human.downcase
case @sessionable
when Client
  json.(@sessionable, :email, :phone, :first_name, :last_name, :api_token)
when Clinician
  json.(@sessionable, :email, :first_name, :last_name, :title, :api_token)
end
json.twilio_token twilio_token(@sessionable.email, @platform).to_jwt
json.(@sessionable, :created_at, :updated_at)
