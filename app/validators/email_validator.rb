class EmailValidator < ActiveModel::EachValidator
  def self.matches?(value)
    /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i =~ value
  end
  
  def validate_each(record, attribute, value)
    unless self.class.matches?(value)
      record.errors[attribute] << (options[:message] || "is not an email")
    end
  end
end
