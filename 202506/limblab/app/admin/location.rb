ActiveAdmin.register Location do
  menu priority: 3

  filter :name
  filter :manager_email
  filter :city
  filter :state
  
  index do
    column :name
    column :manager_email
    column :city
    column :state
    actions defaults: false do |location|
      item 'View', location_path(location), class: :member_link
    end
  end

  show do
    attributes_table do
      row :name
      row :manager_email
      row :address_line1
      row :address_line2
      row :city
      row :state
      row :postal
      row :phone
      row :fax
      row :mobile
      row :lat
      row :lng
      row :hero_image do |location|
        if location.hero_image.attached?
          image_tag url_for(location.hero_image)
        else
          nil
        end
      end
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :name
      f.input :manager_email
      f.input :address_line1
      f.input :address_line2
      f.input :city
      f.input :state
      f.input :postal
      f.input :phone
      f.input :fax
      f.input :mobile
      f.input :lat
      f.input :lng
      f.input :hero_image, as: :file
    end
    f.actions
  end
  
  permit_params do
    [:name, :manager_email, :address_line1, :address_line2, :city, :state, :postal, :phone, :fax, :mobile, :lat, :lng, :hero_image]
  end
end
