Rails.application.routes.draw do
  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      resources :clients, only: :create
      resources :locations, only: :index
      resources :sessions, only: :create
      namespace :client do
        resources :conversations, only: :create
        resources :sessions, only: :create
        resources :passwords, only: [:create, :update]
        resources :relationships, only: [:create, :index]
        resources :devices, only: :create
      end
      namespace :clinician do
        resources :conversations, only: :create
        resources :sessions, only: :create
        resources :passwords, only: [:create, :update]
        resources :relationships, only: [:index, :update]
        resources :practices, only: :index
        resources :devices, only: :create
      end
    end
  end
  
  ActiveAdmin.routes(self)

  resources :sessions, only: :create
  resources :passwords, only: [:new, :create, :edit, :update], param: :password_reset_token
  
  get 'sign-in', to: 'sessions#new', as: 'sign_in'
  delete 'sign-out', to: 'sessions#destroy', as: 'sign_out'
  post 'twilio', to: 'webhooks#twilio', as: 'twilio'
end
