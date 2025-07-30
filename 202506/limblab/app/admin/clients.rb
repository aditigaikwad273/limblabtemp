ActiveAdmin.register Client do
  menu priority: 1

  filter :email
  filter :phone
  filter :first_name
  filter :last_name
  
  scope 'All', default: true do |scope|
    scope.active
  end
  scope 'Inactive' do |scope|
    scope.inactive
  end
  
  member_action :deactivate, method: :put do
    resource.inactive!
    flash[:notice] = "Client login was successfully deactivated."
    redirect_to root_url
  end

  member_action :activate, method: :put do
    resource.active!
    flash[:notice] = "Client login was successfully activated."
    redirect_to root_url
  end

  action_item :activate, only: :show do
    if resource.inactive?
      link_to 'Activate Login', activate_client_path(resource), method: :put, data: { confirm: 'Are you sure you want to activate login for this client?' }
    end
  end

  action_item :deactivate, only: :show do
    if resource.active?
      link_to 'Deactivate Login', deactivate_client_path(resource), method: :put, data: { confirm: 'Are you sure you want to disable login for this client?' }
    end
  end
  
  index do
    column :first_name
    column :last_name
    column :email
    column :phone
    actions defaults: false do |client|
      item 'View', client_path(client), class: :member_link
    end
  end

  show do
    attributes_table do
      row :first_name
      row :last_name
      row :email
      row :phone
      row :created_at
      row :updated_at
    end

    if resource.relationships.exists?      
      panel 'Clinicians' do
        table do |t|
          t.tr do |tr|
            t.th 'Name'
            t.th 'Email'
            t.th 'Primary'
            t.th 'Notes'
            t.th
          end
          resource.relationships.each do |relationship|
            t.tr do |tr|
              tr.td do
                relationship.clinician.full_name
              end
              tr.td do
                relationship.clinician.email
              end
              tr.td do
                status_tag relationship.primary
              end
              tr.td do
                relationship.notes.present? ? relationship.notes.squish : nil
              end
              tr.td do
                link_to 'View', clinician_path(relationship.clinician)
              end
            end
          end
        end
      end
    end    
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :first_name
      f.input :last_name
      f.input :email
      f.input :phone
      f.input :password
      f.input :password_confirmation
      
    end
    f.inputs name: 'Clinicians' do
      f.has_many :relationships, heading: false, allow_destroy: true, new_record: 'Add Clinician' do |p|
        p.input :clinician_id, as: :select, collection: Clinician.active
        p.input :notes, as: :text
        p.input :primary
      end
    end
    f.actions
  end

  permit_params do
    [:first_name, :last_name, :password, :password_confirmation, :email, :phone,
     relationships_attributes: [:id, :clinician_id, :primary, :notes, :_destroy] ]
  end
end
