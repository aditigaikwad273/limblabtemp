ActiveAdmin.register Admin do
  menu priority: 4
  
  filter :email
  filter :first_name
  filter :last_name
  
  index do
    column :first_name
    column :last_name
    column :email
    actions defaults: false do |admin|
      item 'View', admin_path(admin), class: :member_link
    end
  end

  show do
    attributes_table do
      row :first_name
      row :last_name
      row :email
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :first_name
      f.input :last_name
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end
  
  permit_params do
    [:first_name, :last_name, :password, :password_confirmation, :email ]
  end
end
