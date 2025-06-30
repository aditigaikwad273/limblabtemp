class DeviceRegisterJob < ApplicationJob
  def perform(device)
    options = {}
    options[:platform_application_arn] = ENV["AWS_SNS_#{device.platform.upcase}_ARN"]
    options[:token] = device.token
    
    endpoint = Aws::SNS::Client.new.create_platform_endpoint(options)
    
    device.update!(arn: endpoint[:endpoint_arn])
  end
end
