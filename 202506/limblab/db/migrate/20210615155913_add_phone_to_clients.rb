class AddPhoneToClients < ActiveRecord::Migration[6.1]
  def up
    add_column :clients, :phone, :string
  end

  def down
    remove_column :clients, :phone
  end
end
