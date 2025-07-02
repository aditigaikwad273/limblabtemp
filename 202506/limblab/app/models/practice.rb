class Practice < ApplicationRecord
  include Archivable
  
  before_create :ensure_first_primary
  after_update :ensure_one_primary
  
  belongs_to :clinician
  belongs_to :location

  private

  def ensure_first_primary
    unless self.clinician.practices.where(primary: true).exists?
      self.primary = true
    end
  end

  def ensure_one_primary
    if self.saved_change_to_primary? && self.primary?
      self.class.where.not(id: self.id).where(primary: true).update_all(primary: false)
    end
  end
end
