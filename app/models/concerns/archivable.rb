module Archivable
  extend ActiveSupport::Concern

  included do
    def self.active
      where(active: true)
    end

    def self.inactive
      where(active: false)
    end

    def inactive?
      !self.active?
    end

    def inactive!
      self.update!(active: false)
    end

    def active!
      self.update!(active: true)
    end
  end
end
