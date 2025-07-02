class SessionsController < ApplicationController
  before_action :require_authorization, only: :destroy
  before_action :require_no_authorization, except: :destroy
  
  def new
    @session = Session.new
  end

  def create
    @session = Session.new(session_params)
    if admin = @session.authenticate(Admin)
      sign_in admin

      redirect_to root_url
    else
      render action: :new
    end
  end

  def destroy
    sign_out

    flash[:notice] = 'You have been successfully signed out.'
    redirect_to sign_in_url
  end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end
end
