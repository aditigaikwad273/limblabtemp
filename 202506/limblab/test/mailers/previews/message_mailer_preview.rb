class MessageMailerPreview < ActionMailer::Preview
  def urgent
    message = Message.last || Message.new(conversation: Conversation.new(client: Client.first))
    MessageMailer.urgent(message)
  end
end
