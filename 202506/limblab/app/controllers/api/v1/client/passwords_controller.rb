class Api::V1::Client::PasswordsController < ApiController
  def create
    @password = Password.new(password_params)
    if @client = @password.request(Client)
      PasswordMailer.requested(@client).deliver_later
    else
      render json: { errors: @password.errors }, status: 422
    end
  end

  private

  def password_params
    params.require(:password).permit(:email)
  end
end

