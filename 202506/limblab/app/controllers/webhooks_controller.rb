class WebhooksController < ApplicationController
  protect_from_forgery with: :reset_session
  
  def twilio
    case params[:EventType]
    when 'onMessageAdded'
      if conversation = Conversation.where(api_token: params[:ConversationSid]).take
        api_token = params[:MessageSid]
        clinician = conversation.client.clinicians.find_by_normalized_email(params[:Author])
        urgency = JSON.parse(params[:Attributes] || '{}')['urgency'].to_i
        created = Time.zone.iso8601(params[:DateCreated])
        
        message = conversation.messages.create!(api_token: api_token,
                                                clinician: clinician,
                                                urgency: urgency,
                                                created_at: created,
                                                updated_at: created)

        counter = DailyMessageCounter.where("DATE(day) = ?", Date.today).and(DailyMessageCounter.where(clinician: clinician))
        begin
            if counter.blank?
              counter = DailyMessageCounter.create(day: Date.today, clinician: clinician, count: 1)
              counter.save!
            else
              counter.increment_counter(:count, counter.pluck(:id))
            end
        rescue ActiveRecord::RecordInvalid => invalid
            puts invalid.record.errors
        end

        MessageNotifyJob.perform_later(message, params[:ConversationSid])
        
        if urgency > 0
          MessageUrgencyJob.set(wait: 1.hour).perform_later(message)
        end
      end
    end

    head :ok
  end
end
