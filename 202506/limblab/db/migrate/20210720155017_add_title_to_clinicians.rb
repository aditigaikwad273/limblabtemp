class AddTitleToClinicians < ActiveRecord::Migration[6.1]
  def up
    add_column :clinicians, :title, :string
  end

  def down
    remove_column :clinicians, :title, :string
  end
end
