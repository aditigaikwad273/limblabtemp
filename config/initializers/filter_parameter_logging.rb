# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [
  :passw, :password, :password_reset_token, :api_token, :Body, :secret, :token, :_key, :crypt, :salt, :certificate, :otp, :ssn
]
