class UpgradeQueSchema < ActiveRecord::Migration[6.1]
  def up
    Que.migrate!(version: 7)
  end

  def down
    Que.migrate!(version: 3)
  end
end
