class AddQueScheduleSchema < ActiveRecord::Migration[6.1]
  def change
    Que::Scheduler::Migrations.migrate!(version: 7)
  end
end
