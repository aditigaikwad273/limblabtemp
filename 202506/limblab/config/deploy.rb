lock "~> 3.17.1"

set :format, :pretty
set :log_level, :info
set :format_options, command_output: false

set :application, "limblab"
set :repo_url, "git@bitbucket.org:accella/#{fetch(:application)}.git"

set :migration_role, :web
set :assets_roles, [:web, :worker]

append :linked_dirs, ".bundle", "log", "tmp/cache", "tmp/pids", "tmp/sockets"
