class Api::V1::SessionsController < ApiController
  def create
    @session = Session.new(session_params)
    if @sessionable = (@session.authenticate(Client) || @session.authenticate(Clinician))
      @sessionable.touch
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
