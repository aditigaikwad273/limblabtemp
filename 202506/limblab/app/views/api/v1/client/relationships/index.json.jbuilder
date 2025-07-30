json.array! @relationships do |relationship|
  json.(relationship, :id)
  json.(relationship.clinician, :first_name, :last_name, :email, :title)
  json.practices relationship.clinician.practices do |practice|
    json.(practice.location,
          :name,
          :address_line1,
          :address_line2,
          :city,
          :state,
          :postal,
          :phone,
          :fax,
          :mobile,
          :lat,
          :lng)
    json.hero_image practice.location.hero_image.attached? ?
                      polymorphic_url(practice.location.hero_image) :
                      nil
    json.primary practice.primary
  end
  json.(relationship, :primary)
end
