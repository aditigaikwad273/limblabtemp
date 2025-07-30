class DailyMessageCountNotificationJob < ApplicationJob
  def perform()

    # lookup all DailyMessageCount for today
    counters = DailyMessageCounter.where("updated_at >  ?", 24.hours.ago)
    # for each DMC, notify the clinician of their count
    counters.each do |counter|
      DailyMessageCountMailer.counted(counter.clinician, counter.count).deliver
    end

  end
end

