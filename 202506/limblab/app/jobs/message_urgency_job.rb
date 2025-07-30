class MessageUrgencyJob < ApplicationJob
  def perform(message)
    unless message.conversation.messages.where('created_at > ?', message.created_at).where.not(clinician_id: nil).exists?
      MessageMailer.urgent(message).deliver_later
    end
  end
end
