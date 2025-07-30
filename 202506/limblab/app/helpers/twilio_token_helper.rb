module TwilioTokenHelper
  def twilio_token(identity, platform)
    grant = Twilio::JWT::AccessToken::ChatGrant.new
    grant.service_sid = ENV['TWILIO_CONVERSATIONS_SID']
    grant.push_credential_sid = ENV["TWILIO_#{platform.upcase}_PUSH_SID"]

    Twilio::JWT::AccessToken.new(
      ENV['TWILIO_SID'],
      ENV['TWILIO_API_KEY'],
      ENV['TWILIO_API_SECRET'],
      [grant],
      identity: identity,
      ttl: 1.hour.to_i
    )
  end
end
