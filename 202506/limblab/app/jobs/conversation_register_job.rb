class ConversationRegisterJob < ApplicationJob
  def perform(conversation, relationship)
    client = Twilio::REST::Client.new(ENV['TWILIO_SID'], ENV['TWILIO_AUTH_TOKEN'])

    client.conversations.services(ENV['TWILIO_CONVERSATIONS_SID']).conversations(conversation.api_token).participants.create(identity: relationship.clinician.email, attributes: { role: 'clinician', primary: relationship.primary }.to_json)
  end
end
