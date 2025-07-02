class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :signed_in?, :signed_out?, :current_admin

  protected
    
  def handle_unverified_request
    sign_out
    super
  end
  
  def require_authorization
    unless signed_in?
      deny_access
    end
  end

  def require_no_authorization
    unless signed_out?
      redirect_back(fallback_location: root_url)
    end
  end
  
  def signed_in?
    current_admin.present?
  end

  def signed_out?
    !signed_in?
  end

  def sign_out
    session[:admin_id] = nil
  end
  
  def sign_in(admin)
    if admin.present?
      session[:admin_id] = admin.id
    end
  end
  
  def current_admin
    if @current_admin.nil? && session[:admin_id].present?
      @current_admin = ::Admin.active.where(id: session[:admin_id]).take
    end
    @current_admin
  end
  
  def deny_access(flash_message=nil)
    flash[:error] = flash_message || 'You need to sign in before continuing.'

    if signed_in?
      redirect_to root_url
    else
      redirect_to sign_in_url      
    end
  end
end
