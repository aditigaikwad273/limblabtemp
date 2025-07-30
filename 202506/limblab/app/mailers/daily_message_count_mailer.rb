class DailyMessageCountMailer < ApplicationMailer
  layout 'dmc_mailer'
  def counted(clinician, count)
    @clinician = clinician
    @count = count

    mail(to: clinician.email, subject: 'You received ' + count.to_s + " message(s) in the Limb Lab app today")
  end
  
end

