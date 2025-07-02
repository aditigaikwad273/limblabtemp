class Api::V1::Client::RelationshipsController < ApiController
  before_action :require_client_authorization
  
  def index
    @relationships = current_client.relationships.active
  end
  
  def create
    if clinician = Clinician.active.where(clinician_params).take
      # TODO: should hook into a clinician's practices (hopefully just one?)
      @relationship = current_client.relationships.find_or_create_by!(clinician: clinician)

      #if clinician.practices.count > 1
        # error
      #  render json: { errors: { practice_id: "is required" }, practices: [ practices ] }, status: 422
      #else
        # next
      #end
      
      @relationship.reload
    else
      render json: { errors: { code: "doesn't match an active clinician" } }, status: 422
    end
  end

  private

  def clinician_params
    params.require(:clinician).permit(:code)
  end
end
