class Session
  include ActiveModel::Model

  attr_accessor :email, :password

  validates :email, presence: true, email: true
  validates :password, presence: true
  
  def authenticate(sessionable)
    if valid?
      if user = sessionable.active.find_by_normalized_email(email)
        if user.authenticate(password)
          return user
        else
          errors[:password] << "does not appear to be correct"
        end
      else
        errors[:email] << "does not have an active #{sessionable.model_name.human} account"
      end
    end
    return nil
  end
end
