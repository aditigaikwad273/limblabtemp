class Api::V1::Clinician::RelationshipsController < ApiController
  before_action :require_clinician_authorization
  
  def index
    @relationships = current_clinician.relationships.active
  end

  def update
    @relationship = current_clinician.relationships.active.where(id: params[:id]).take!
    @relationship.update!(relationship_params)
  end

  private

  def relationship_params
    params.require(:relationship).permit(:notes)
  end
end
