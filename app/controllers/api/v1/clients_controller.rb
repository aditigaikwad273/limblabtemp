class Api::V1::ClientsController < ApiController
  def create
    @client = Client.new(client_params)

    if @client.save
      @client.reload
      @platform = platform
    else
      render json: { errors: @client.errors }, status: 422
    end
  end

  private

  def client_params
    params.require(:client).permit(:first_name, :last_name, :email, :phone, :password, :password_confirmation)
  end
end
