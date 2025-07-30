json.array! @locations do |location|
  json.(location,
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
  json.hero_image location.hero_image.attached? ?
                    polymorphic_url(location.hero_image) :
                    nil
end

