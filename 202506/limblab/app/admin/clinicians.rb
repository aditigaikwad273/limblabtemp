ActiveAdmin.register Clinician do
  menu priority: 2
  
  filter :email
  filter :first_name
  filter :last_name
  filter :code
  
  index do
    column :first_name
    column :last_name
    column :email
    column :code
    actions defaults: false do |clinician|
      item 'View', clinician_path(clinician), class: :member_link
    end
  end

  show do
    attributes_table do
      row :first_name
      row :last_name
      row :email
      row :code
      row :title
      row :created_at
      row :updated_at
    end
    if resource.practices.exists?
      panel 'Locations' do
        table do |t|
          t.tr do |tr|
            t.th 'Name'
            t.th 'City'
            t.th 'State'
            t.th 'Primary'
            t.th
          end
          resource.practices.each do |practice|
            t.tr do |tr|
              tr.td do
                practice.location.name
              end
              tr.td do
                practice.location.city
              end
              tr.td do
                practice.location.state
              end
              tr.td do
                status_tag practice.primary
              end
              tr.td do
                link_to 'View', location_path(practice.location)
              end
            end
          end
        end
      end
    end
    if resource.relationships.exists?      
      panel 'Clients' do
        table do |t|
          t.tr do |tr|
            t.th 'Name'
            t.th 'Email'
            t.th 'Phone'
            t.th 'Primary'
            t.th 'Notes'
            t.th
          end
          resource.relationships.each do |relationship|
            t.tr do |tr|
              tr.td do
                relationship.client.full_name
              end
              tr.td do
                relationship.client.email
              end
              tr.td do
                relationship.client.phone
              end
              tr.td do
                status_tag relationship.primary
              end
              tr.td do
                relationship.notes.present? ? relationship.notes.squish : nil
              end
              tr.td do
                link_to 'View', client_path(relationship.client)
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
      f.input :title
      f.input :code
      f.input :password
      f.input :password_confirmation
    end
    f.inputs name: 'Locations' do
      f.has_many :practices, heading: false, allow_destroy: true, new_record: 'Add Location' do |p|
        p.input :location_id, as: :select, collection: Location.all
        p.input :primary
      end
    end
    f.inputs name: 'Clients' do
      f.has_many :relationships, heading: false, allow_destroy: true, new_record: 'Add Client' do |p|
        p.input :client_id, as: :select, collection: Client.active
        p.input :notes, as: :text
        p.input :primary
      end
    end
    f.actions
  end

  permit_params do
    [:first_name, :last_name, :password, :password_confirmation, :email, :title, :code,
     relationships_attributes: [:id, :client_id, :primary, :notes, :_destroy],
     practices_attributes: [:id, :location_id, :primary, :_destroy] ]
  end
end
