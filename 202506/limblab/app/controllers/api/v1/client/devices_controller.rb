class Api::V1::Client::DevicesController < ApiController
  before_action :require_client_authorization
  
  def create
    @device = Device.where(device_params.merge(platform: platform)).take
    if @device.present?
      @device.update!(client: current_client, active: true)
    else
      @device = current_client.devices.create!(device_params.merge(platform: platform))
      DeviceRegisterJob.perform_later(@device)
    end
  end

  private

  def device_params
    params.require(:device).permit(:token)
  end
end

