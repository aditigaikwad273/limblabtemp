class NotificationSendJob < ApplicationJob
  ERRORS = [ Aws::SNS::Errors::EndpointDisabled,
             Aws::SNS::Errors::PlatformApplicationDisabled,
             Aws::SNS::Errors::InvalidParameter ]

  def perform(notification, conversationSID, messageCreatedAt)
    options = {}
    options[:target_arn] = notification.device.arn
    options[:message] = message_for(notification, conversationSID, messageCreatedAt)
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

  def message_for(notification, conversationSID, messageCreatedAt)
        payload = notification.payload || {}

        # Build APS depending on whether it's visible or silent
        aps = if notification.body.present?
        {
          aps: {
            alert: {
              title: 'LimbLab',
              body: notification.body
            },
            sound: 'default',
            badge: 1
          }
        }
      else
        {
          aps: {
            'content-available' => 1
          }
        }
      end

      # Merge custom data into APNS
      apns_payload = payload.merge(aps).merge({ conversationSID: conversationSID, messageCreatedAt: messageCreatedAt })

      # GCM (Android) — always include both notification & data
    gcm = {
            notification: {
            title: 'LimbLab',
            body: notification.body
            },
            priority: "high",
            data: payload.merge({
            notificationId: notification.id,
            conversationSID: conversationSID,
            messageCreatedAt: messageCreatedAt
            })
    }

    message = {}
    message[:default] = notification.body || "New message"
    message[:APNS_SANDBOX] = apns_payload.to_json
    message[:APNS] = apns_payload.to_json
    message[:GCM] = gcm.to_json

    message.to_json
  end
end
