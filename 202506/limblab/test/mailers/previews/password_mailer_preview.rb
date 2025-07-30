class PasswordMailerPreview < ActionMailer::Preview
  def requested
    admin = Admin.first
    admin.password_reset_token = SecureRandom.uuid
    PasswordMailer.requested(admin)
  end

  def reset
    admin = Admin.first
    PasswordMailer.reset(admin)
  end
end
