class PasswordMailer < ApplicationMailer
  def requested(user)
    @user = user

    mail(to: @user.email, subject: 'Limb Lab Password Request')
  end

  def reset(user)
    @user = user

    mail(to: @user.email, subject: 'Limb Lab Password Updated')
  end
end
