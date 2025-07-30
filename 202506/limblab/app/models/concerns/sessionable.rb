module Sessionable
  extend ActiveSupport::Concern

  included do
    has_secure_password
    
    validates :email, presence: true, uniqueness: true, email: true
    
    def self.find_by_normalized_email(email)
      where(email: email.to_s.strip.downcase).take
    end

    def email=(value)
      if value.present?
        super(value.to_s.strip.downcase)
      else
        super(nil)
      end
    end
    
    def display_name
      self.full_name.presence || self.email
    end

    def full_name
      [self.first_name, self.last_name].select(&:present?).join(' ').presence || nil
    end

    def set_password_reset_request!
      self.update!(password_reset_token: SecureRandom.uuid,
                   password_reset_requested_at: Time.current)
    end

    def password_resettable?
      self.password_reset_token.present? &&
        self.password_reset_requested_at.present? &&
        self.password_reset_requested_at >= 6.hours.ago
    end
    
    def reset_password(password)
      if self.password_resettable?
        self.update!(password: password,
                     password_reset_token: nil,
                     password_reset_requested_at: nil)
      else
        false
      end
    end
  end
end
