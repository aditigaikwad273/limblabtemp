class MessageMailer < ApplicationMailer
  def urgent(message)
    @clinician = message.conversation.client.clinicians.where(relationships: { primary: true }).take
    if @clinician.present?
      @location = @clinician.locations.where(practices: { primary: true }).take
      if @location.try(:manager_email).present?
        mail(to: @location.manager_email, subject: 'Urgent Message Pending Clinician Reply')
      end
    end
  end
end
