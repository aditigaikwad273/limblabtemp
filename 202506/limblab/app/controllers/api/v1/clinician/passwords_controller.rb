class Api::V1::Clinician::PasswordsController < ApiController
  def create
    @password = Password.new(password_params)
    if @clinician = @password.request(Clinician)
      PasswordMailer.requested(@clinician).deliver_later
    else
      render json: { errors: @password.errors }, status: 422
    end
  end

  private

  def password_params
    params.require(:password).permit(:email)
  end
end

