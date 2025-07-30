class Api::V1::Client::SessionsController < ApiController
  def create
    @session = Session.new(session_params)
    if @client = @session.authenticate(Client)
      @client.touch
      @platform = platform
    else
      render json: { errors: @session.errors }, status: 422
    end
  end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end
end
