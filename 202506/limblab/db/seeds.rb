Admin.create(email: 'ryan.krug@accella.net', password: SecureRandom.uuid) unless Admin.exists?
