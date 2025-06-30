class ApplicationJob < ActiveJob::Base
  def self.exists?
    !ActiveRecord::Base.connection.exec_query("SELECT 1 FROM que_jobs WHERE args->0->>'job_class' = '#{self.name}'").empty?
  end
end
