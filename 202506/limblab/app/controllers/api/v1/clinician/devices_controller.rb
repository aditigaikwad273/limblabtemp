class Api::V1::Clinician::DevicesController < ApiController
  before_action :require_clinician_authorization
  
  def create
    @device = Device.where(device_params.merge(platform: platform)).take
    if @device.present?
      @device.update!(clinician: current_clinician, active: true)
    else
      @device = current_clinician.devices.create!(device_params.merge(platform: platform))
      DeviceRegisterJob.perform_later(@device)
    end
  end

  private

  def device_params
    params.require(:device).permit(:token)
  end
end

