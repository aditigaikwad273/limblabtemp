class ApiController < ActionController::API
  helper TwilioTokenHelper
  
  before_action :require_authorization

  def require_authorization
    unless valid_key?
      head :unauthorized
    end
  end

  def require_client_authorization
    unless current_client.present?
      head :unauthorized
    end
  end

  def require_clinician_authorization
    unless current_clinician.present?
      head :unauthorized
    end
  end

  def platform
    api_client
  end

  def current_client
    @current_client ||= find_current_client
  end

  def current_clinician
    @current_clinician ||= find_current_clinician
  end

  def twilio_client
    @twilio_client ||= create_twilio_client
  end

  private

  def create_twilio_client
    Twilio::REST::Client.new(ENV['TWILIO_SID'], ENV['TWILIO_AUTH_TOKEN'])
  end

  def find_current_client
    Client.active.where(api_token: api_token).take
  end

  def find_current_clinician
    Clinician.active.where(api_token: api_token).take
  end

  def api_client
    request.headers['x-ll-api-client'] || 'ios'
  end
  
  def api_key
    request.headers['x-ll-api-key'] || ''
  end

  def api_token
    request.headers['x-ll-api-token'] || ''
  end

  def valid_key?
    ActiveSupport::SecurityUtils.secure_compare(api_key, ENV['LL_API_KEY'])
  end
end
