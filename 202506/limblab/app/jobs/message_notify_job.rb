class MessageNotifyJob < ApplicationJob
  def perform(message)
    unless message.client?
      message.conversation.client.devices.active.each do |device|
        NotificationSendJob.perform_later(Notification.create!(device: device, body: body_for(message)))
      end
    end
    message.conversation.client.relationships.active.each do |relationship|
      unless message.clinician == relationship.clinician
        relationship.clinician.devices.active.each do |device|
          NotificationSendJob.perform_later(Notification.create!(device: device, body: body_for(message)))
        end
      end      
    end
  end

  private

  def body_for(message)
    if message.urgency > 0
      'You have an URGENT LimbLab message waiting for you'
    else
      'You have a new LimbLab message waiting for you'
    end
  end
end
