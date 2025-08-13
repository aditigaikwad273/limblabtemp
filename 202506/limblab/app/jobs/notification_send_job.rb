class NotificationSendJob < ApplicationJob
  ERRORS = [ Aws::SNS::Errors::EndpointDisabled,
             Aws::SNS::Errors::PlatformApplicationDisabled,
             Aws::SNS::Errors::InvalidParameter ]
  
  def perform(notification, conversationSID)
    options = {}
    options[:target_arn] = notification.device.arn
    options[:message] = message_for(notification, conversationSID)
    options[:message_structure] = "json"

    begin
      Aws::SNS::Client.new.publish(options)
      notification.sent!
    rescue *ERRORS => e
      Rails.logger.error("Error while publishing to AWS:#{e.message}")
      begin
        notification.device.update!(active: false)
      rescue => e2
        Rails.logger.error("Error while updating device to false:#{e2.message}")
      end

      begin
        notification.failed!
      rescue => e3
        Rails.logger.error("Error while updating notification status as failed:#{e3.message}")
      end
    end
  end

  private

  def message_for(notification, conversationSID)
    payload = notification.payload || {}

    aps = { aps: { alert: notification.body, sound: 'default', badge: 1 } }
    gcm = { notification: { title: 'LimbLab', body: notification.body } }
    
    message = {}
    message[:default] = notification.body
    message[:APNS_SANDBOX] = payload.merge(aps).to_json
    message[:APNS] = payload.merge(aps).to_json
    message[:GCM] =  { data: payload.merge({ notificationId: notification.id, conversationSID: conversationSID }) }.merge(gcm).to_json

    message.to_json
  end
end
