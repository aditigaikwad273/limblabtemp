class Api::V1::Clinician::ConversationsController < ApiController
  before_action :require_clinician_authorization

  def create
    relationship = current_clinician.relationships.active.where(conversation_params).take!
    
    @conversation = relationship.client.conversations.take || create_default_conversation(relationship.client)
  end

  private

  def conversation_params
    params.require(:conversation).permit(:client_id)
  end

  def create_default_conversation(client)
    conversation = twilio_client.conversations.services(ENV['TWILIO_CONVERSATIONS_SID']).conversations.create(
      messaging_service_sid: ENV['TWILIO_MESSAGING_SID'],
      unique_name: client.email
    )

    conversation.participants.create(identity: client.email, attributes: { role: 'client' }.to_json)

    client.conversations.create!(api_token: conversation.sid)    
  end
end
