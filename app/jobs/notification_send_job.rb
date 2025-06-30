class NotificationSendJob < ApplicationJob
  ERRORS = [ Aws::SNS::Errors::EndpointDisabled,
             Aws::SNS::Errors::PlatformApplicationDisabled,
             Aws::SNS::Errors::InvalidParameter ]
  
  def perform(notification)
    options = {}
    options[:target_arn] = notification.device.arn
    options[:message] = message_for(notification)
    options[:message_structure] = "json"

    begin
      Aws::SNS::Client.new.publish(options)
      notification.sent!
    rescue *ERRORS
      notification.device.update!(active: false)
      notification.failed!
    end
  end

  private

  def message_for(notification)
    payload = notification.payload || {}

    aps = { aps: { alert: notification.body, sound: 'default', badge: 1 } }
    gcm = { notification: { title: 'LimbLab', body: notification.body } }
    
    message = {}
    message[:default] = notification.body
    message[:APNS_SANDBOX] = payload.merge(aps).to_json
    message[:APNS] = payload.merge(aps).to_json
    message[:GCM] =  { data: payload.merge({ notificationId: notification.id }) }.merge(gcm).to_json

    message.to_json
  end
end
