role :web, ["#{fetch(:deploy_user)}@3.238.55.104"]
role :web, ["ubuntu@ec2-3-238-55-104.compute-1.amazonaws.com"], no_release: true

role :worker, ["#{fetch(:deploy_user)}@3.239.203.103"]
role :worker, ["ubuntu@ec2-3-239-203-103.compute-1.amazonaws.com"], no_release: true
