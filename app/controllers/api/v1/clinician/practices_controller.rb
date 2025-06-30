class Api::V1::Clinician::PracticesController < ApiController
  before_action :require_clinician_authorization
  
  def index
    @practices = current_clinician.practices.active
  end
end
