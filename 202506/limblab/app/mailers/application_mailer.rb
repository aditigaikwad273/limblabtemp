class ApplicationMailer < ActionMailer::Base
  default from: ENV['LL_FROM_EMAIL']
  layout 'mailer'
end
