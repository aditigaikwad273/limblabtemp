class Api::V1::Clinician::SessionsController < ApiController
  def create
    @session = Session.new(session_params)
    if @clinician = @session.authenticate(Clinician)
      @clinician.touch
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
