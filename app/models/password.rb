class Password
  include ActiveModel::Model

  attr_accessor :email,
                :password,
                :password_reset_token

  validates :email, presence: true, email: true, on: :create
  validates :password, presence: true, on: :update
  validates :password_reset_token, presence: true, on: :update

  def to_param    
    self.password_reset_token
  end

  def new_record?
    !self.persisted?
  end

  def persisted?
    self.password_reset_token.present?
  end

  def request(sessionable)
    if valid?(:create)
      user = sessionable.active.find_by_normalized_email(self.email)
      if user.try(:set_password_reset_request!)
        return user
      else
        errors[:email] << "does not have an account"
      end
    end
    return nil
  end

  def reset(sessionable)
    if valid?(:update)
      user = sessionable.active.where(password_reset_token: self.password_reset_token).take
      if user.try(:reset_password, self.password)
        return user
      else
        errors[:base] << "Your password reset request has expired. Please submit a new <a href='/passwords/new'>password request</a>.".html_safe
      end
    end
    return nil
  end
end
