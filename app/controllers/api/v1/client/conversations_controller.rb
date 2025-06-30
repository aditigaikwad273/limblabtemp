class Api::V1::Client::ConversationsController < ApiController
  before_action :require_client_authorization

  def create
    @conversation = current_client.conversations.take || create_default_conversation
  end

  private

  def create_default_conversation
    conversation = twilio_client.conversations.services(ENV['TWILIO_CONVERSATIONS_SID']).conversations.create(
      messaging_service_sid: ENV['TWILIO_MESSAGING_SID'],
      unique_name: current_client.email
    )

    conversation.participants.create(identity: current_client.email, attributes: { role: 'client' }.to_json)

    current_client.conversations.create!(api_token: conversation.sid)    
  end
end
